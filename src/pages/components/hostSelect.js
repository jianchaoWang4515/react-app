import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
/**
 * 主机ip列表
 */

 export class HostSelect extends React.Component {
    render () {
        const { placeholder = '请选择架构类型', allowClear = false, list = [], loading = false } = this.props;
        return (
            <Select placeholder={placeholder} loading={loading} allowClear={allowClear}>
                {list.map((item) => (
                    <Option key={item.id} value={item.id}>{item.ip}</Option>
                ))}
            </Select>
        )
    }
 }
