import React, { useState, useContext, useEffect, useCallback } from 'react';
import './index.less';
import { transformMenuNameKey } from '@/utils/menus';
import { Layout, Icon } from 'antd';
import { Menu,AppHeader } from '@/components';
import Menus from '@/menus';
import { GlobalContext } from '@/store';
const MenuIdKeyObj = transformMenuNameKey(Menus, 'id');// id为key值的菜单对象
const menuPathKeyObj = transformMenuNameKey(Menus, 'path');// path为key值的菜单对象
const { Header, Content, Sider } = Layout;

function MyLayout(props) {
    const { state, dispatch } = useContext(GlobalContext);
    const { breadcrumbList } = state;
    const [twoLevelMenu, setTwolevelMenu] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const currentRoute = breadcrumbList[breadcrumbList.length - 1];
    const [collapsed, setCollapsed] = useState(false); 

    const updateTwoLevelMenu = useCallback(() => {
        const newTwoLevelMenu = getTwoLevelMenu();
        const newSelectedKeys = getSelectedKeys();
        setTwolevelMenu(newTwoLevelMenu);
        setCollapsed(newTwoLevelMenu.length > 0);
        setSelectedKeys(newSelectedKeys);
    },[breadcrumbList])

    useEffect(() => {
        updateTwoLevelMenu();
    }, [updateTwoLevelMenu])
    
    function toggle() {
        setCollapsed(!collapsed);
    }

    /**
     * 根据当前路由prtId 判断有无二级菜单 有则显示
     */
    function getTwoLevelMenu () {
        let twoLevelMenu = [];
        const currentLocationState = props.location.state || {};
        const { model = '' } = currentLocationState;
        if (breadcrumbList && breadcrumbList.length) {
            const currenMenu = breadcrumbList[breadcrumbList.length - 1].menu;
            if (currenMenu.prtId !== '-1') {
                const prtMenu = MenuIdKeyObj[currenMenu.prtId]; // 获取父菜单
                if (prtMenu.twoLevel) {
                    if (model) {
                        // 菜单中model存在且与location中的model相同的菜单
                        prtMenu.twoLevel.forEach(item => {
                            if (item.model) {
                                if (item.model === model || 
                                    (Array.isArray(item.model) && item.model.includes(model))
                                    ) {
                                    twoLevelMenu.push(item)
                                }
                            }
                        });
                    } else {
                        // model不存在的菜单
                        prtMenu.twoLevel.forEach(item => {
                            if (!item.model) {
                                twoLevelMenu.push(item)
                            }
                        });
                    }
                }
            }
        }
        return twoLevelMenu;
    }

    /**
     * 获取需要高亮显示的菜单keys
     */
    function getSelectedKeys() {
        const selectedKeys = [];
        if (currentRoute) {
            const currentMatchPath = currentRoute ? currentRoute.matchPath : null;
            for (const key in menuPathKeyObj) {
                if (key === currentMatchPath || 
                    (menuPathKeyObj[key].child && menuPathKeyObj[key].child.includes(currentMatchPath))
                ) {
                    let { id, prtId } = menuPathKeyObj[key];
                    selectedKeys.push(prtId, id);
                }
            }
        }
        return selectedKeys;
    }
    return (
        <Layout className="app-layout">
            <Sider style={{ background: '#fff'}} trigger={null} collapsible collapsed={collapsed}>
                <div className={`app-title ${collapsed ? 'hidden' : ''}`}>Forrest</div>
                <Menu selectedKeys={selectedKeys} menus={Menus}></Menu>
            </Sider>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 99, background: 'rgb(52, 61, 80)'}}>
                    <Icon
                        className="trigger menu-toggle"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={toggle}
                    />
                    <AppHeader breadcrumbList={breadcrumbList} userInfo={state.userInfo} global={{state, dispatch}}></AppHeader>
                </Header>
                <Content style={{ marginTop: 64 }}>
                    <Layout className="app-layout_main">
                        { twoLevelMenu.length > 0 &&
                            <Sider className="app-layout_main-aside">
                                <Menu  selectedKeys={selectedKeys} menus={twoLevelMenu}></Menu>
                            </Sider>
                        }
                        <Content className="app-layout_main-content">
                            { props.children }
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )
}

export default MyLayout;
