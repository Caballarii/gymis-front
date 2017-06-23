import React from 'react';
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

import "babel-polyfill";

import ListTeacher from './teacher/ListTeacher';
import ListLesson from './lesson/ListLesson';
import AddLesson from './lesson/AddLesson';
import WeekLesson from './lesson/WeekLesson';

import 'antd/dist/antd.css';
import './Index.less';

const Home=()=>{
    return (
        <div>
            <h2>首页</h2>
        </div>
    );
}

const Welcome=()=>{
    return (
        <div>
            <h2>欢迎使用教务系统</h2>
        </div>
    )
}

const Login=()=>{
    return (
        <div>
            <h2>登录</h2>
        </div>
    );
}

class RouterList extends React.Component{
    
    state={
        currentKey:''
    }

    onSelect=(option)=>{
        this.setState({
            currentKey:option.key
        });
    }

    render(){
        return (
            <Router>
                <Layout className="layout">
            <Header>
            <div className="logo" />
            <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[this.state.currentKey]}
                style={{ lineHeight: '64px' }}
                onSelect={this.onSelect}
            >
                <Menu.Item key="lesson"><Link to="/weekLesson">课程管理</Link></Menu.Item>
                <Menu.Item key="teacher"><Link to="/teacher">教师管理</Link></Menu.Item>
            </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
                {/*<Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Lesson</Breadcrumb.Item>*/}
            </Breadcrumb>
            <div style={{ background: '#fff', padding: 24, minHeight: 580 }}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/teacher" component={ListTeacher}/>
                    <Route path="/lesson" component={ListLesson}/>
                    <Route path="/addLesson" component={AddLesson}/>
                    <Route path="/weekLesson" component={WeekLesson}/>
                    <Route component={Welcome}/>
                </Switch>
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            教务系统
            </Footer>
        </Layout>
                    
            </Router>
        )}
}

export default RouterList;