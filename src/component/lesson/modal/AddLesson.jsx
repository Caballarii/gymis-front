import React from 'react';
import {Form,Button,Modal,Input,Select,DatePicker,InputNumber,Row,Col,Card} from 'antd';
const FormItem=Form.Item;
const Option=Select.Option;

import {FetchUtil} from '../../utils/FetchUtils';

import moment from 'moment';

class AddLesson extends React.Component{

    state={
        visible:false
    }

    twentyFour=()=>{
        let arr=[];
        for(let i=0;i<24;i++){
            if(i<10){
                arr.push('0'+i);
            }
            else{
                arr.push(i+'');
            }
        }
        return arr;
    }

    sixty=()=>{
        let arr=[];
        for(let i=0;i<60;i++){
            if(i<10){
                arr.push('0'+i);
            }
            else{
                arr.push(i+'');
            }
        }
        return arr;
    }

    showMadal=()=>{
        this.props.form.resetFields();
        this.setState({
            visible:true
        })
    }

    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }

    handleSubmit=(e)=>{
        e.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            values.beginTime=moment(values.beginDate).hours(values.beginH).minutes(values.beginM).seconds("00");
            values.endTime=moment(values.beginTime).add('minutes',values.period);
            let data=await FetchUtil('/lesson','POST',values);
            if(data.success){
                Modal.success({
                    title:'新增成功！'
                });
                this.setState({
                    visible:false
                });
                this.props.reload();
            }
            else{
                console.log(data.data.conflictLesson);
                let conflictLesson=data.data.conflictLesson;
                Modal.error({
                    title:data.msg,
                    content:
                        <span>
                        已有课程：
                            <Card bodyStyle={{ padding: 10 }}>
                                
                                {conflictLesson.teacherName}<br/>
                                {moment(conflictLesson.beginTime).format("HH:mm")}-{moment(conflictLesson.endTime).format("HH:mm")}<br/>                           
                                {conflictLesson.comment}<br/>
                                {conflictLesson.lessonName}<br/>
                                Room:{conflictLesson.room}<br/>
                            </Card>
                        请检查教师、时间、教室并重新输入
                        </span>
                });
            }           
            
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <span>
                <Button size={'large'} type={'primary'} onClick={this.showMadal}>新增</Button>
                <Modal visible={this.state.visible} title={'新增课程'} onOk={this.handleSubmit} onCancel={this.handleCancel}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label="教师"
                        >
                            {getFieldDecorator('teacherId', {
                                rules: [{required: true, message: '请选择教师!' }],
                            })(
                                <Select>
                                    <Option value={''}>请选择</Option>
                                    {this.props.listTeacher.map((info,index)=>{
                                        return <Option value={info.id+''} key={index}>{info.teacherName}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="课程日期"
                            >
                            {getFieldDecorator('beginDate',{
                                initialValue:moment().add(1,"days"),
                                rules: [{ type: 'object', required: true, message: '请选择时间!' }], 
                            })(
                                <DatePicker format="YYYY-MM-DD" disabledDate={(date)=>{return date<moment().add(-1,"days")}}/>
                            )}
                        </FormItem>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    labelCol={{xs: { span: 24 }, sm: { span: 15}}}
                                    wrapperCol= {{xs: { span: 24 }, sm: { span: 9 }}}
                                    label="起始时间"
                                    >
                                    
                                    {getFieldDecorator('beginH',{
                                        initialValue:'08',
                                        rules: [{ type: 'string', required: true, message: '请选择小时!' }], 
                                    })(
                                        <Select>
                                            {
                                                this.twentyFour().map(info=>{
                                                    return <Option value={info} key={info}>{info}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={1}>
                                <div style={{height:32,lineHeight:"32px"}}>&nbsp;&nbsp;&nbsp;:&nbsp;</div></Col>
                            <Col span={6}>
                                <FormItem labelCol={{xs: { span: 0 }, sm: { span: 0 }}}
                                    wrapperCol= {{xs: { span: 24 }, sm: { span: 12 }}}>
                                {getFieldDecorator('beginM', {
                                    initialValue:'00',
                                    rules: [{ type: 'string', required: true, message: '请选择分钟!' }], 
                                })(
                                    <Select>
                                        {
                                            this.sixty().map(info=>{
                                                return <Option value={info} key={info}>{info}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                                </FormItem>
                            </Col>

                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label="持续时间"
                            >
                            {getFieldDecorator('period', {
                                initialValue: 120,
                                rules: [{required: true, message: '请输入持续时间!' }],
                            })(
                                <InputNumber placeholder="以分钟为单位"/>
                            )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label="教室"
                        >
                            {getFieldDecorator('room', {
                                rules: [{ type: 'string', required: true, message: '请输入教室!' },{
                                    type:'string',
                                    max:100,
                                    message:'不能超过100字!'
                                }],
                            })(
                                <Input placeholder="教室"/>
                            )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label="学生"
                        >
                            {getFieldDecorator('comment', {
                                rules: [{ type: 'string', required: true, message: '请输入上课学生!' },{
                                    type:'string',
                                    max:100,
                                    message:'不能超过100字!'
                                }],
                            })(
                                <Input placeholder="学生"/>
                            )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label="课程名"
                        >
                            {getFieldDecorator('lessonName', {
                                rules: [{
                                    type:'string',
                                    max:100,
                                    message:'不能超过100字!'
                                }],
                            })(
                                <Input placeholder="课程名"/>
                            )}
                        </FormItem>                       
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create({})(AddLesson);