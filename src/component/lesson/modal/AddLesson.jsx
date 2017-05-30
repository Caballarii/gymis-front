import React from 'react';
import {Form,Button,Modal,Input,Select,DatePicker,InputNumber} from 'antd';
const FormItem=Form.Item;
const Option=Select.Option;

import {FetchUtil} from '../../utils/FetchUtils';

import moment from 'moment';

class AddLesson extends React.Component{

    state={
        visible:false
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
            values.endTime=moment(values.beginTime).add('minutes',values.period);
            let data=await FetchUtil('lesson','POST',values);
            
            if(data.success){
                Modal.success({
                    title:'新增成功！'
                });
            }
            else{
                Modal.error({
                    title:data.message
                });
            }
            this.setState({
                visible:false
            });
            this.props.reload();
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
                        label="课程名"
                        >
                            {getFieldDecorator('lessonName', {
                                rules: [{ type: 'string', required: true, message: '请输入课程名!' },{
                                    type:'string',
                                    max:100,
                                    message:'不能超过100字!'
                                }],
                            })(
                                <Input placeholder="课程名"/>
                            )}
                        </FormItem>
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
                            label="起始时间"
                            >
                            {getFieldDecorator('beginTime',{
                                rules: [{ type: 'object', required: true, message: '请选择时间!' }], 
                            })(
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                            )}
                        </FormItem>
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
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create({})(AddLesson);