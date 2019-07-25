import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
/**
 * 架构类型列表
 */
export class FrameworkSelect extends React.Component {
    render () {
        const { placeholder = '请选择架构类型', allowClear = false, loading = false, list = [] } = this.props;
        return (
            <Select placeholder={placeholder} loading={loading} allowClear={allowClear}>
                {list.map((item) => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                ))}
            </Select>
        )
    }
}
