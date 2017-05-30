import React from 'react';
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

import "babel-polyfill";

import ListTeacher from './teacher/ListTeacher';
import ListLesson from './lesson/ListLesson';

import 'antd/dist/antd.css';

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

const RouterList = () =>(
    <Router>
        <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="lesson">课程管理</Menu.Item>
        <Menu.Item key="teacher">教师管理</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '12px 0' }}>
        {/*<Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Lesson</Breadcrumb.Item>*/}
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/teacher" component={ListTeacher}/>
            <Route path="/lesson" component={ListLesson}/>
            <Route component={Welcome}/>
          </Switch>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      教务系统
    </Footer>
  </Layout>
            
    </Router>
)

export default RouterList;