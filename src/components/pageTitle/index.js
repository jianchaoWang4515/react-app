import React from 'react';
import { Icon } from 'antd';
import './index.less';

function PageTitle(props) {
    return (
        <div className="app-page-title p-b-8 clear-box">
            { props.isIcon !== false && <Icon type={props.icon || "environment"} />}
            <span className="title m-l-8">{props.title}</span>
            {props.children}
        </div>
    ) 
}

export default React.memo(PageTitle);
