import React from 'react';
import {Table,Pagination,Row,Col,Input,Button,Form} from 'antd';
const FormItem = Form.Item;

import {FetchUtil} from '../utils/FetchUtils';

import AddTeacher from './modal/AddTeacher';
import EditTeacher from './modal/EditTeacher';

export default class ListTeacher extends React.Component{

    state={
        tData:[],

        pageNum:1,
        totalCount:0,

        teacherName:''
    }

    columns = [{
            title: '序号',
            dataIndex: 'id',
            render:(t,r,i)=>{
                return i+1;
            }
        }, {
            title: '教师名',
            dataIndex: 'teacherName',
        }, {
            title: '操作',
            dataIndex: 'operation',
            render:(t,r,i)=>{
                return <EditTeacher reload={this.fetchData} record={r}/>;
            }
    }];

    fetchData=async ()=>{
        let pageSize=10;
        
        let url='/teacher?pageNum='+this.state.pageNum+'&pageSize='+pageSize;
        if(this.state.teacherName){
            url+='&teacherName='+this.state.teacherName;
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
                            <FormItem {...formItemLayout} label={'教师名'}>
                                <Input name="teacherName" value={this.state.teacherName} onChange={this.handleChange}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <Button size={'large'} type={'primary'} onClick={this.handleSearch}>搜索</Button>{' '}
                            <AddTeacher reload={this.fetchData}/>
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