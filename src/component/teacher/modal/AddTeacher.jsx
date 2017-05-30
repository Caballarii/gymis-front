import React from 'react';
import {Form,Button,Modal,Input} from 'antd';
const FormItem=Form.Item;

import {FetchUtil} from '../../utils/FetchUtils';

class AddTeacher extends React.Component{

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
            let data=await FetchUtil('teacher','POST',values);
            if(data.success){
                Modal.success({
                    title:'新增成功！'
                });
                this.setState({
                    visible:false
                });
                this.props.reload();
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
                <Modal visible={this.state.visible} title={'新增教师'} onOk={this.handleSubmit} onCancel={this.handleCancel}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label="教师名"
                        >
                        {getFieldDecorator('teacherName', {
                            rules: [{ type: 'string', required: true, message: '请输入教师名!' },{
                                type:'string',
                                max:100,
                                message:'不能超过100字!'
                            }],
                        })(
                            <Input placeholder="教师名"/>
                        )}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create({})(AddTeacher);