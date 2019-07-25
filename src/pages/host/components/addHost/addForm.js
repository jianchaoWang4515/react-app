import React from 'react';
import { Form, Input, Select } from 'antd';
const { Option } = Select;
class AddHostForm extends React.Component {
    render () {
        const { getFieldDecorator } = this.props.form;
        const { formData } = this.props;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 18 },
            },
          };
        return (
            <Form className="add-host-form" {...formItemLayout}>
                <Form.Item label="IP">
                {getFieldDecorator('ip', {
                    rules: [{ required: true, message: '请输入ip' }],
                    initialValue: formData.ip
                })(
                    <Input
                    placeholder="IP"
                    />,
                )}
                </Form.Item>
                <Form.Item label="port">
                {getFieldDecorator('port', {
                    rules: [
                        { required: true, message: '请输入端口' },
                        { type: 'number', transform: (val) => Number(val), message: '格式有误' }
                    ],
                    initialValue: formData.port
                })(
                    <Input
                    placeholder="port"
                    />,
                )}
                </Form.Item>
                <Form.Item label="管理用户">
                {getFieldDecorator('admin_user', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.admin_user
                })(
                    <Input
                    placeholder="管理用户"
                    />,
                )}
                </Form.Item>
                <Form.Item label="用户密码">
                {getFieldDecorator('admin_password', {
                    rules: [{ required: true, message: '请输入用户密码' }],
                    initialValue: formData.admin_password
                })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="主机类型">
                    {getFieldDecorator('servermode', {
                        initialValue: formData.servermode
                    })(
                        <Select>
                            <Option value="0">物理机</Option>
                            <Option value="1">虚拟机</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="环境">
                    {getFieldDecorator('servertype', {
                        initialValue: formData.servertype
                    })(
                        <Select>
                            <Option value="0">生产</Option>
                            <Option value="1">测试</Option>
                        </Select>
                    )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddHostForm);
