import React from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { API } from '@/api';
import { TableStatus } from '../state';
const { TextArea } = Input;
const { Option } = Select;
class AddUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dbList: [],
            loading: false
        };
    }
    componentWillMount() {
        this.getMysqlDbList(this.props.serviceid);
    }
     /**
     * 获取表空间
     */
    getMysqlDbList = (id) => {
        const params = {
            page_size: 9999,
            serviceid: id
          }
          this.setState({
            loading: true
          })
          API.serverDetail.mysql.db({ params }).then(res => {
              this.setState({
                dbList: res.results || []
              })
          }).finally(() => {
                this.setState({
                loading: false
              });
          });
    };
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
            <Form className="add-tablespace-form" {...formItemLayout}>
                {!this.props.isAdd && (
                    <Form.Item label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                        initialValue: formData.password
                    })(
                        <Input.Password />,
                    )}
                    </Form.Item>
                )}
                <Form.Item label="用户名称">
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名称' }],
                    initialValue: formData.username
                })(
                    <Input
                    disabled={this.props.isAdd ? false : true}
                    placeholder="用户名称"
                    />,
                )}
                </Form.Item>
                <Form.Item label="用户类型">
                {getFieldDecorator('user_type', {
                    rules: [{ required: true }],
                    initialValue: formData.user_type
                })(
                    <Radio.Group disabled={!this.props.isAdd}>
                        <Radio value="1">普通用户</Radio>
                        <Radio value="2">只读用户</Radio>
                  </Radio.Group>,
                )}
                </Form.Item>
                {!this.props.isAdd && (
                    <Form.Item label="状态">
                    {getFieldDecorator('status', {
                        rules: [{ required: true, message: '状态' }],
                        initialValue: formData.status
                    })(
                        <Select disabled={!this.props.isAdd}>
                            {[...TableStatus].map((item) => (
                                <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                            ))}
                        </Select>,
                    )}
                    </Form.Item>
                )}
                <Form.Item label="所属数据库">
                {this.props.isAdd && getFieldDecorator('databases', {
                    rules: [{ required: true, message: '请选择所属数据库'}],
                    initialValue: undefined
                })(
                    <Select mode="multiple" disabled={!this.props.isAdd} placeholder="请选择所属数据库" loading={this.state.loading} allowClear={true}>
                    {this.state.dbList.map((item) => (
                        <Option key={item.databasename} value={item.databasename}>{item.databasename}</Option>
                    ))}
                    </Select>
                )}
                {!this.props.isAdd && getFieldDecorator('databases', {
                    rules: [{ required: true, message: '请选择所属数据库'}],
                    initialValue: formData.databases.join()
                })(
                    <TextArea disabled={true}/>
                )}
                </Form.Item>
                <Form.Item label="Host">
                {getFieldDecorator('mysql_host', {
                    rules: [{ required: true, message: '请输入Host' }],
                    initialValue: formData.mysql_host
                })(
                    <Input
                    disabled={!this.props.isAdd}
                    placeholder="Host"
                    />,
                )}
                </Form.Item>
                <Form.Item label="使用者">
                {getFieldDecorator('owners', {
                    rules: [{ required: true, message: '请输入使用者' }],
                    initialValue: formData.owners
                })(
                    <Input
                    placeholder="使用者"
                    />,
                )}
                </Form.Item>
                <Form.Item label="使用应用">
                {getFieldDecorator('applications', {
                    rules: [{ required: true, message: '请输入使用应用' }],
                    initialValue: formData.applications
                })(
                    <Input
                    placeholder="使用应用"
                    />,
                )}
                </Form.Item>
                {!this.props.isAdd && (
                    <Form.Item label="权限信息">
                    {getFieldDecorator('sys_privage', {
                        initialValue: formData.sys_privage
                    })(
                        <TextArea />,
                    )}
                    </Form.Item>
                )}
                <Form.Item label="备注">
                {getFieldDecorator('remarks', {
                    initialValue: formData.remarks
                })(
                    <TextArea />,
                )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddUserForm);
