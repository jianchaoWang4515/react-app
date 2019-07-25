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
                placeholder="请输入服务名"
                onPressEnter={this.props.onChange}
                onSearch={this.props.onChange}
                style={{ width: 250 }}
              />,
            )}
          </Form.Item>
          <Form.Item label="数据库类型" className="m-l-24" style={{float: "right"}}>
            {this.props.form.getFieldDecorator('dbtype', {
                initialValue: this.props.data.dbtype,
              })(
                <Select placeholder="数据库类型" style={{width: 150}} onChange={this.props.onChange}>
                      <Option value="-1">全部</Option>
                      <Option value="0">Oracle</Option>
                      <Option value="1">Mysql</Option>
                  </Select>
              )}
          </Form.Item>
        </Form>
    )
  }
}

export default Form.create()(SearchForm);
