import React from 'react';
import {Form,Button,Modal,Input,Select,DatePicker,InputNumber,Row,Col} from 'antd';
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
            values.beginTime=moment(values.beginDate).hours(values.beginH).minutes(values.beginM).seconds("00");
            values.endTime=moment(values.beginTime).add('minutes',values.period);
            let data=await FetchUtil('lesson','POST',values);
            
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
                Modal.error({
                    title:data.msg
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
                            label="起始日期"
                            >
                            {getFieldDecorator('beginDate',{
                                initialValue:moment().add(1,"days"),
                                rules: [{ type: 'object', required: true, message: '请选择时间!' }], 
                            })(
                                <DatePicker format="YYYY-MM-DD" disabledDate={(date)=>{return date<moment().add(-1,"days")}}/>
                            )}
                        </FormItem>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    labelCol={{xs: { span: 24 }, sm: { span: 10 }}}
                                    wrapperCol= {{xs: { span: 24 }, sm: { span: 14 }}}
                                    label="起始时间"
                                    >
                                    
                                    {getFieldDecorator('beginH',{
                                        initialValue: '08',
                                        rules: [{ type: 'string', required: true, message: '请输入小时!' },{
                                            pattern: /(^[0-1][0-9]$)|(^2[0-3]$)/, message:'请输入小时(24制)'
                                        }], 
                                    })(
                                        <Input placeholder="时"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} offset={1}>
                                <FormItem labelCol={{xs: { span: 0 }, sm: { span: 0 }}}
                                    wrapperCol= {{xs: { span: 24 }, sm: { span: 14 }}}>
                                {getFieldDecorator('beginM', {
                                    initialValue: '00',
                                    rules: [{ type: 'string', required: true, message: '请输入分钟!' },{
                                            pattern: /(^[0-5][0-9]$)/, message:'请输入分钟'
                                        }], 
                                })(
                                    <Input placeholder="分"/>
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
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create({})(AddLesson);