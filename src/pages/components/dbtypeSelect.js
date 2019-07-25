import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
/**
 * 架构类型列表
 */
export class DbtypeSelect extends React.Component {
    render () {
        const {  placeholder = '请选择数据库类型', 
                isAll = false, 
                onChange = () => { return false },
                onSelect = () => { return false },
                style = {},
                allowClear = false
            } = this.props;
        return (
            <Select style={{ ...style }} placeholder={placeholder} onChange={onChange} onSelect={onSelect} allowClear={allowClear}>
                {isAll && <Option value="-1">全部</Option>}
                 <Option value="0">Oracle</Option>
                 <Option value="1">Mysql</Option>
            </Select>
        )
    }
}
