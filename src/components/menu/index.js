import React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import JSONSessionStorage from '@/utils/session-storage';
const { SubMenu } = Menu;

function AppMenu(props) {
    function goTo(item, location) {
        const { path:pathname } = item;
        const { search, state } = location;
        // isQuery为真跳转时携带search与state
        props.history.push({
            pathname,
            search: item.isQuery ? search : '',
            state: item.isQuery ? state : {},
        });
        // 点击跟菜单清空历史数据
        if (item.prtId === '-1') JSONSessionStorage.setItem('history', {});
    } 
    return (
        <Menu
                mode="inline"
                selectedKeys={props.selectedKeys}
            >
                {props.menus.map((item, index) => {
                    if (!item.children || !item.children.length) {
                        return <Menu.Item key={item.id} onClick={e => goTo(item, props.location)}>
                                        { item.icon && 
                                            <Icon type={item.icon} />
                                        }
                                        <span>
                                            {item.title}
                                        </span>
                                </Menu.Item>
                    } else {
                        return <SubMenu
                                title={
                                    <span>
                                        <Icon type="video-camera" />
                                        <span>{item.title}</span>
                                    </span>
                                }
                            >
                                {item.children.map((ele) => {
                                    return <Menu.Item key={ele.id}  onClick={e => goTo(item, props.location)}>{ele.title}</Menu.Item>
                                })}
                        </SubMenu>
                    }
                })}
            </Menu>
    )
}

export default withRouter(AppMenu);
