import React from 'react';
import { Form, Button, Modal, Input, Select, DatePicker, InputNumber, Row, Col,Steps} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;

import { FetchUtil } from '../utils/FetchUtils';

import moment from 'moment';
import './Lesson.less';

class AddLesson extends React.Component {

    state = {
        current:0,
        listTeacher:[]
    }

    steps = [{
        title: 'First',
        content: (
            <div>
                
            </div>
        ),
    }, {
        title: 'Second',
        content: 'Second-content',
    }, {
        title: 'Last',
        content: 'Last-content',
    }];

    handleCancel = () => {
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            values.beginTime = moment(values.beginDate).hours(values.beginH).minutes(values.beginM).seconds("00");
            values.endTime = moment(values.beginTime).add('minutes', values.period);
            let data = await FetchUtil('lesson', 'POST', values);

            if (data.success) {
                Modal.success({
                    title: '新增成功！'
                });
            }
            else {
                Modal.error({
                    title: data.msg
                });
            }
            this.setState({
                visible: false
            });
            this.props.reload();
        });
    }

    componentWillMount=async ()=>{
        let teacherData=await FetchUtil('/teacher/list');
        console.log(teacherData);
        this.setState({
            listTeacher:teacherData.data.list
        })
    }

    render() {
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
                <div>
                    <Steps current={this.state.current}>
                        {this.steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div className="steps-content">
                        <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="课程名"
                        >
                            {getFieldDecorator('lessonName', {
                                rules: [{ type: 'string', required: true, message: '请输入课程名!' }, {
                                    type: 'string',
                                    max: 100,
                                    message: '不能超过100字!'
                                }],
                            })(
                                <Input placeholder="课程名" />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="教师"
                        >
                            {getFieldDecorator('teacherId', {
                                rules: [{ required: true, message: '请选择教师!' }],
                            })(
                                <Select>
                                    <Option value={''}>请选择</Option>
                                    {this.state.listTeacher.map((info, index) => {
                                        return <Option value={info.id + ''} key={index}>{info.teacherName}</Option>
                                    })}
                                </Select>
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="起始日期"
                        >
                            {getFieldDecorator('beginDate', {
                                initialValue: moment().add(1, "days"),
                                rules: [{ type: 'object', required: true, message: '请选择时间!' }],
                            })(
                                <DatePicker format="YYYY-MM-DD" disabledDate={(date) => { return date < moment().add(-1, "days") }} />
                                )}
                        </FormItem>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    labelCol={{ xs: { span: 24 }, sm: { span: 10 } }}
                                    wrapperCol={{ xs: { span: 24 }, sm: { span: 14 } }}
                                    label="起始时间"
                                >

                                    {getFieldDecorator('beginH', {
                                        initialValue: '08',
                                        rules: [{ type: 'string', required: true, message: '请输入小时!' }, {
                                            pattern: /(^[0-1][0-9]$)|(^2[0-3]$)/, message: '请输入小时(24制)'
                                        }],
                                    })(
                                        <Input placeholder="时" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={11} offset={1}>
                                <FormItem labelCol={{ xs: { span: 0 }, sm: { span: 0 } }}
                                    wrapperCol={{ xs: { span: 24 }, sm: { span: 14 } }}>
                                    {getFieldDecorator('beginM', {
                                        initialValue: '00',
                                        rules: [{ type: 'string', required: true, message: '请输入分钟!' }, {
                                            pattern: /(^[0-5][0-9]$)/, message: '请输入分钟'
                                        }],
                                    })(
                                        <Input placeholder="分" />
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
                                rules: [{ required: true, message: '请输入持续时间!' }],
                            })(
                                <InputNumber placeholder="以分钟为单位" />
                                )}
                        </FormItem>
                    </Form></div>
                    <div className="steps-action">
                        {
                            this.state.current < this.steps.length - 1
                            &&
                            <Button type="primary" onClick={() => this.next()}>Next</Button>
                        }
                        {
                            this.state.current === this.steps.length - 1
                            &&
                            <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                        }
                        {
                            this.state.current > 0
                            &&
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        }
                    </div>
                </div>

            </span>
        );
    }
}

export default Form.create({})(AddLesson);