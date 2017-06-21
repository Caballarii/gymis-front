import React from 'react';
import {Table,Pagination,Row,Col,Input,Button,Form,Card,Select,DatePicker} from 'antd';
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

        listTeacher:[]
    }

    fetchData=async ()=>{
        let pageSize=10;
        
        let url='/weekLesson?beginTime='+this.state.beginDate.format("YYYY-MM-DD");
        if(this.state.teacherId){
            url+='&teacherId='+this.state.teacherId;
        }

        let data=await FetchUtil(url);
        console.log(data);
        this.setState({
            tData:data.data.list
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
            teacherId:teacherId
        },this.handleSearch);
    }

    selectWeek=(number)=>{
        this.setState({
            beginDate:this.state.beginDate.add(number,"weeks")
        },this.handleSearch);
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
                                <Select value={this.state.teacherId} onChange={this.handleSelect.bind(this,'teacherId')}>
                                    <Option value="">请选择老师</Option>
                                    {this.state.listTeacher.map((info,index)=>{
                                        return <Option key={index} value={info.id+""}>{info.teacherName}</Option>
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Button size={'large'} type={'primary'} onClick={this.handleSearch}>搜索</Button>{' '}
                            <AddLesson reload={this.fetchData} listTeacher={this.state.listTeacher}/>
                        </Col>
                    </Row>
                </div>

                <Row gutter={10}>
                    {
                        this.state.tData.map((info,index)=>{
                            return (
                                <Col span={3} key={index}>
                                    <h3 className="text-center">{moment(this.state.beginDate).add(index,"days").format("ddd MM-DD")}</h3>
                                    {
                                        info.map((info1)=>{
                                            console.log(info1);
                                            return(
                                                <Card key={info1.id} bodyStyle={{ padding: 10 }}>
                                                    <a onClick={this.selectTeacher.bind(this,info1.teacherId)}>{info1.teacherName}</a><br/>
                                                    {moment(info1.beginTime).format("HH:mm")}-{moment(info1.endTime).format("HH:mm")}<br/>                           
                                                    {info1.comment}<br/>
                                                    {info1.lessonName}<br/>
                                                    Room:{info1.room}<br/>
                                                    <EditLesson reload={this.fetchData} record={info1} listTeacher={this.state.listTeacher}/>
                                                </Card>
                                            );
                                        })
                                    }
                                    
                                </Col>
                            );
                        })
                    }
                    
                </Row>
            </div>
        );
    }
}