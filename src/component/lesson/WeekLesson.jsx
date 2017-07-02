import React from 'react';
import {Table,Pagination,Row,Col,Input,Button,Form,Card,Select,DatePicker,Popconfirm,Modal,Spin} from 'antd';
import {Link} from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

import {FetchUtil} from '../utils/FetchUtils';

import AddLesson from './modal/AddLesson';
import EditLesson from './modal/EditLesson';

import moment from 'moment';

export default class WeekLesson extends React.Component{

    state={
        tData:[],

        pageNum:1,
        totalCount:0,

        teacherId:'',
        beginDate:moment().day(1),

        listTeacher:[],

        loading:true
    }

    fetchData=async ()=>{
        this.setState({
            loading:true
        });
        let pageSize=10;
        
        let url='/weekLesson?beginTime='+this.state.beginDate.format("YYYY-MM-DD");
        if(this.state.teacherId){
            url+='&teacherId='+this.state.teacherId;
        }

        let data=await FetchUtil(url);
        this.setState({
            tData:data.data.list,
            loading:false
        });
    }

    componentWillMount=async ()=>{
        this.fetchData();

        let teacherData=await FetchUtil('/teacher/list');
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
        this.setState(state,this.handleSearch);
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

    selectTeacher=(teacherId)=>{
        this.setState({
            teacherId:teacherId+""
        },this.handleSearch);
    }

    selectWeek=(number)=>{
        this.setState({
            beginDate:this.state.beginDate.add(number,"weeks")
        },this.handleSearch);
    }

    deleteLesson=async (lessonId)=>{
        let data=await FetchUtil('/lesson/'+lessonId,'DELETE');
        if(data.success){
            Modal.success({
                title:'删除成功！'
            });
            this.fetchData();
        }
        else{
            Modal.error({
                title:data.msg
            });
        }  
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
                            <Button size={'large'} type={'primary'} onClick={this.selectWeek.bind(this,-1)}>上一周</Button>{' '}
                            <Button size={'large'} type={'primary'} onClick={this.selectWeek.bind(this,1)}>下一周</Button>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label={'老师名'}>
                                <Select showSearch
                                    style={{ minWidth: 100 }}
                                    value={this.state.teacherId}
                                    onChange={this.handleSelect.bind(this,'teacherId')}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                    <Option value="">全体老师</Option>
                                    {this.state.listTeacher.map((info,index)=>{
                                        return <Option key={index} value={info.id+""}>{info.teacherName}</Option>
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            {/*<Button size={'large'} type={'primary'} onClick={this.handleSearch}>搜索</Button>{' '}*/}
                            <AddLesson reload={this.fetchData} listTeacher={this.state.listTeacher}/>
                        </Col>
                    </Row>
                </div>

                <Spin spinning={this.state.loading}>
                <Row gutter={10}>
                    {
                        this.state.tData.map((info,index)=>{
                            return (
                                <Col span={3} key={index}>
                                    <h3 className="text-center">{moment(this.state.beginDate).add(index,"days").format("ddd MM-DD")}</h3>
                                    {
                                        info.map((info1)=>{
                                            return(
                                                <Card key={info1.id} bodyStyle={{ padding: 10 }}>
                                                    <a onClick={this.selectTeacher.bind(this,info1.teacherId)}>{info1.teacherName}</a><br/>
                                                    {moment(info1.beginTime).format("HH:mm")}-{moment(info1.endTime).format("HH:mm")}<br/>                           
                                                    {info1.comment}<br/>
                                                    {info1.lessonName}<br/>
                                                    Room:{info1.room}<br/>
                                                    <EditLesson reload={this.fetchData} record={info1} listTeacher={this.state.listTeacher}/>{' '}
                                                    
                                                    <Popconfirm placement="bottomLeft" title={"确认删除课程嘛？"} onConfirm={this.deleteLesson.bind(this,info1.id)} okText="Yes" cancelText="No">
                                                        <a>删除</a>
                                                    </Popconfirm>
                                                </Card>
                                            );
                                        })
                                    }
                                    
                                </Col>
                            );
                        })
                    }
                    
                </Row>
                </Spin>
            </div>
        );
    }
}