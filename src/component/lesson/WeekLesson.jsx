import React from 'react';
import {Table,Pagination,Row,Col,Input,Button,Form} from 'antd';
import {Link} from 'react-router-dom';
const FormItem = Form.Item;

import {FetchUtil} from '../utils/FetchUtils';

import moment from 'moment';

export default class WeekLesson extends React.Component{

    state={
        tData:[],

        pageNum:1,
        totalCount:0,

        teacherId:'',
        beginDate:moment().add(-20,'day'),

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

    handleSearch=()=>{
        this.fetchData();
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
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={'课程名'}>
                                <Input name="lessonName" value={this.state.lessonName} onChange={this.handleChange}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <Button size={'large'} type={'primary'} onClick={this.handleSearch}>搜索</Button>{' '}
                            {/*<AddLesson reload={this.fetchData} listTeacher={this.state.listTeacher}/>*/}
                            <Link to="/addLesson"><Button size={'large'} type={'primary'} onClick={this.handleSearch}>新增</Button></Link>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}