import React from 'react';
import {Table,Pagination,Row,Col,Input,Button,Form,Select,DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

import {FetchUtil} from '../utils/FetchUtils';

import AddLesson from './modal/AddLesson';
import EditLesson from './modal/EditLesson';

import moment from 'moment';

export default class ListLesson extends React.Component{

    state={
        tData:[],

        pageNum:1,
        totalCount:0,

        lessonName:'',
        teacherId:'',
        beginTime:moment(),
        endTime:moment().add(7,"days"),

        listTeacher:[]
    }

    columns = [{
            title: '序号',
            dataIndex: 'id',
            render:(t,r,i)=>{
                return i+1;
            }
        }, {
            title: '课程',
            dataIndex: 'lessonName',
        },{
            title: '教师',
            dataIndex: 'teacherName',
        },{
            title: '开始时间',
            dataIndex: 'beginTime',
            render:(t)=>{
                return moment(t).format("YYYY-MM-DD HH:mm:ss")
            }
        },{
            title: '结束时间',
            dataIndex: 'endTime',
            render:(t)=>{
                return moment(t).format("YYYY-MM-DD HH:mm:ss")
            }
        },{
            title: '时长',
            dataIndex: 'period',
        },{
            title: '操作',
            dataIndex: 'operation',
            render:(t,r,i)=>{
                return <EditLesson reload={this.fetchData} record={r} listTeacher={this.state.listTeacher}/>;
            }
    }];

    fetchData=async ()=>{
        let pageSize=10;
        
        let url='/lesson?pageNum='+this.state.pageNum+'&pageSize='+pageSize;
        if(this.state.lessonName){
            url+='&lessonName='+this.state.lessonName;
        }
        if(this.state.teacherId){
            url+='&teacherId='+this.state.teacherId;
        }
        if(this.state.beginTime){
            url+='&beginTime='+this.state.beginTime.format('YYYY-MM-DD');
        }
        if(this.state.endTime){
            url+='&endTime='+moment(this.state.endTime).add(1,"days").format('YYYY-MM-DD');
        }

        let data=await FetchUtil(url);
        this.setState({
            tData:data.data.list.list,
            pageNum:data.data.list.pageNum,
            totalCount:data.data.list.total
        });
    }

    componentWillMount=async ()=>{
        this.fetchData();

        let teacherData=await FetchUtil('/teacher/list');
        console.log(teacherData);
        this.setState({
            listTeacher:teacherData.data.list
        })
    }

    selectPage=(page)=>{
        this.setState({
            pageNum:page
        },this.fetchData);
    }

    handleChange=(e)=>{
        let name=e.target.name;
        let value=e.target.value;
        let state=this.state;

        state[name]=value;

        this.setState(state);
    }

    handleSelect=(name,value)=>{
        var state = this.state;
        state[name]=value;
        this.setState(state);
    }

    handleSearch=()=>{
        this.fetchData();
    }

    handleCalendar=(dates,dateStrings)=>{
    	this.setState({
    		beginTime:dates[0],
    		endTime:dates[1]
    	});
    }

    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <div>
                <div>
                    <Row gutter={40}>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label={'课程名'}>
                                <Input name="lessonName" value={this.state.lessonName} onChange={this.handleChange}/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label={'老师名'}>
                                <Select value={this.state.teacherId} onChange={this.handleSelect.bind(this,'teacherId')}>
                                    <Option value="">请选择老师</Option>
                                    {this.state.listTeacher.map((info,index)=>{
                                        return <Option key={index} value={info.id+""}>{info.teacherName}</Option>
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem labelCol={{ span: 4}} wrapperCol= {{span: 20}}  label={'起止时间'}>
                                <RangePicker value={[this.state.beginTime,this.state.endTime]} allowClear format="YYYY/MM/DD" onChange={this.handleCalendar}/>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Button size={'large'} type={'primary'} onClick={this.handleSearch}>搜索</Button>{' '}
                            <AddLesson reload={this.fetchData} listTeacher={this.state.listTeacher}/>
                        </Col>
                    </Row>
                </div>
                <Table pagination={false} dataSource={this.state.tData} columns={this.columns} rowKey={'id'}></Table>
                <div style={{marginTop:30,textAlign:"right"}}>
                    <Pagination current={this.state.pageNum} total={this.state.totalCount} onChange={this.selectPage}/>
                </div>
            </div>
        );
    }
}