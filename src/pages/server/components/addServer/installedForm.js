import React from 'react';
import { Form, Input, Select, Icon, Button } from 'antd';
import { API } from '@/api';
const { Option } = Select;
let id = 1;
class InstalledServerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            frameworkList: {
                oracle: [],
                mysql: []
            },
            hostIpList: [],
            isLoading: false,
            hostIpLoading: false,
            API,
            XHR: API.server
        };
    }
    componentWillMount() {
        this.getHostIpList();
        this.getFrameworkList();
    };
    /**
     * 获取架构类型列表
     */
    getFrameworkList = (dbtype = 0) => {
        if (
                (dbtype === 0 && !this.state.frameworkList.oracle.length) || 
                (dbtype === 1 && !this.state.frameworkList.mysql.length)
            ) {
                this.setState({
                    isLoading: true
                });
                const param = {
                    params: {
                        page_size: 9999,
                        dbtype,
                    }
                }
                this.state.XHR.framework(param).then((res) => {
                    if (dbtype === 0) {
                        this.setState({
                            frameworkList: { ...this.state.frameworkList, oracle: res.results || [] } 
                        });
                    } else {
                        this.setState({
                            frameworkList: { ...this.state.frameworkList, mysql: res.results || [] } 
                        });
                    }
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            }
    };
    /**
     * 获取主机列表
     */
    getHostIpList = () => {
        this.setState({
            hostIpLoading: true
        });
        const param = {
            params: {
                page_size: 9999
            }
        }
        this.state.API.host.list.send(param).then((res) => {
            this.setState({
                hostIpList: res.results || []
            });
        }).finally(() => {
            this.setState({
                hostIpLoading: false
            });
        });
    };
    
    onDbTypeChange = (val) => {
        this.getFrameworkList(Number(val));// 重新获取架构类型列表
        this.props.form.setFieldsValue({
            framework: undefined
        });
        this.props.changeForm({dbtype: val});
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      };

      /**
       * 把选择过的ip禁用掉
       */
      refreshHostIpList = () => {
        const { form } = this.props;
        // 在onChange合成事件无法同步获取hostList的值 利用setTimeout解决
        setTimeout(() => {
            const schemas = form.getFieldValue('schemas');
            const existIpId = schemas.map(item => item.hostname); // 已经选择的主机ip的id集合
            let newHostIpList = [ ...this.state.hostIpList ];
            newHostIpList.forEach(item => {
                if (existIpId.includes(item.id)) item.disabled = true;
                else item.disabled = false;
            })
            this.setState({
                hostIpList: newHostIpList
            })
        });
      }


    render () {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formData } = this.props;
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
        getFieldDecorator('keys', { initialValue: [0] })
        const keys = getFieldValue('keys');
        return (
            <Form className="add-host-form" {...formItemLayout}>
                <Form.Item label="服务名称">
                {getFieldDecorator('servicename', {
                    rules: [{ required: true, message: '请输入服务名称' }],
                    initialValue: formData.servicename
                })(
                    <Input
                    placeholder="服务名称"
                    />,
                )}
                </Form.Item>
                <Form.Item label="数据库类型">
                    {getFieldDecorator('dbtype', {
                        initialValue: formData.dbtype,
                        rules: [{ required: true, message: '请选择数据库类型' }],
                    })(
                        <Select onChange={this.onDbTypeChange}>
                            <Option value="0">Oracle</Option>
                            <Option value="1">Mysql</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="架构类型">
                    {getFieldDecorator('framework', {
                        rules: [{ required: true, message: '请选择架构类型' }],
                    })(
                        <Select placeholder="请选择架构类型" loading={this.state.isLoading} allowClear={true}>
                            {formData.dbtype === '0' && this.state.frameworkList.oracle.map((item) => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                            {formData.dbtype === '1' && this.state.frameworkList.mysql.map((item) => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="数据库版本">
                {getFieldDecorator('service_version', {
                    rules: [
                        { required: true, message: '请输入数据库版本' }
                    ],
                    initialValue: formData.service_version
                })(
                    <Input
                        placeholder="数据库版本"
                    />,
                )}
                </Form.Item>
                <Form.Item label="链接地址">
                {getFieldDecorator('linkaddress', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.linkaddress
                })(
                    <Input
                        placeholder="链接地址"
                    />,
                )}
                </Form.Item>
                <Form.Item label="链接端口">
                {getFieldDecorator('port', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.port
                })(
                    <Input
                        placeholder="链接端口"
                    />,
                )}
                </Form.Item>
                {formData.dbtype === '0' && 
                    <Form.Item label="SID">
                    {getFieldDecorator('sid', {
                        rules: [{ required: true, message: '请输入SID' }],
                        initialValue: formData.sid
                    })(
                        <Input
                        placeholder="SID"
                        />,
                    )}
                    </Form.Item>
                }
                <Form.Item label="管理用户">
                {getFieldDecorator('adminuser', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.adminuser
                })(
                    <Input
                    placeholder="管理用户"
                    />,
                )}
                </Form.Item>
                <Form.Item label="管理密码">
                {getFieldDecorator('adminpassword', {
                    rules: [{ required: true, message: '请输入管理密码' }],
                    initialValue: formData.adminpassword
                })(<Input.Password placeholder="管理密码"/>)}
                </Form.Item>
                {keys.map((k, index) => (
                    <div key={k} className="app-flex app-flex-wrap" style={{paddingTop: '12px', background: '#fafafa', marginBottom: '12px'}}>
                        <Form.Item
                        label='主机'
                        required={false}
                        style={{width: formData.dbtype === '0' ? '60%' : '55%', marginBottom: '12px'}}
                        labelCol={{sm: { span: 5 }}}
                        wrapperCol={{sm: { span: 18 }}}
                        >
                        {getFieldDecorator(`schemas[${k}]hostname`, {
                            rules: [
                                {
                                    required: false
                                },
                            ],
                        })(
                            <Select placeholder="请选择主机ip" 
                                loading={this.state.hostIpLoading} 
                                allowClear={true}
                                onChange={this.refreshHostIpList}
                                showSearch
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {this.state.hostIpList.map((item) => (
                                    <Option key={item.id} value={item.id} disabled={item.disabled}>{item.ip}</Option>
                                ))}
                            </Select>
                        )}
                        </Form.Item>
                        <Form.Item
                            label='port'
                            style={{width: '40%', marginBottom: '12px'}}
                        >
                            {getFieldDecorator(`schemas[${k}]port`, {
                            rules: [
                                {
                                required: false,
                                whitespace: true,
                                message: "Please input",
                                },
                            ],
                            })(<Input placeholder="port" />)}
                        </Form.Item>
                        { formData.dbtype === '0' && 
                            <Form.Item
                            label='SID'
                            required={false}
                            style={{width: '60%', marginBottom: '12px'}}
                            labelCol={{sm: { span: 5 }}}
                            wrapperCol={{sm: { span: 18 }}}
                            >
                                {getFieldDecorator(`schemas[${k}]SID`, {
                                    rules: [
                                    {
                                        required: false,
                                        whitespace: true,
                                        message: "Please input",
                                    },
                                    ],
                                })(<Input placeholder="SID" />)}
                            </Form.Item>
                        }
                        <Form.Item style={{fontSize: '24px', marginBottom: '12px'}}>
                            {keys.length > 1 ? (
                                <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                style={{cursor: 'pointer'}}
                                onClick={() => this.remove(k)}
                                    />
                            ) : null}
                        </Form.Item>
                    </div>
                ))}
                <Form.Item wrapperCol={{sm: { span: 24 }}}>
                    <Button type="dashed" onClick={this.add} style={{width: '100%'}}>
                        <Icon type="plus" /> Add
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(InstalledServerForm);
