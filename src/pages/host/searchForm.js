import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;
const Search = Input.Search;

class SearchForm extends React.Component { 
  render () {
    return (
      <Form layout='inline' className="app-flex-1">
          <Form.Item label="" style={{float: "right"}}>
            {this.props.form.getFieldDecorator('search', {
              initialValue: this.props.data.search,
            })(
              <Search
                placeholder="请输入主机IP"
                onPressEnter={this.props.onChange}
                onSearch={this.props.onChange}
                style={{ width: 250 }}
              />,
            )}
          </Form.Item>
          <Form.Item label="主机类型" className="m-l-24" style={{float: "right"}}>
            {this.props.form.getFieldDecorator('servermode', {
                initialValue: this.props.data.servermode,
              })(
                <Select style={{width: 150}} onSelect={this.props.onChange}>
                  <Option value="-1">全部</Option>
                  <Option value="0">物理机</Option>
                  <Option value="1">虚拟机</Option>
                </Select>
              )}
          </Form.Item>
          <Form.Item label="环境" className="m-l-24" style={{float: "right"}}>
            {this.props.form.getFieldDecorator('servertype', {
                initialValue: this.props.data.servertype,
              })(
                <Select style={{width: 150}} onSelect={this.props.onChange}>
                  <Option value="-1">全部</Option>
                  <Option value="0">生产</Option>
                  <Option value="1">测试</Option>
                </Select>
              )}
          </Form.Item>
        </Form>
    )
  }
}

export default Form.create()(SearchForm);
