/**
 * 配置说明见src/menus.js
 */

 import { Dbtype } from '@/pages/server/state';
 
 // server 数据库详情的二级菜单有多种情况
 // 0：Oracle、1：Mysql 后续可能会增加
const Model = Object.keys(Dbtype);

const OracleMenu = [{
    path: '/server/oracle/space',
    title: '表空间',
    isQuery: true,
    model: Model[0]
},{
    path: '/server/oracle/user',
    title: '数据库用户',
    isQuery: true,
    model: Model[0]
}];

const MysqlMenu = [{
    path: '/server/mysql/db',
    title: '数据库',
    isQuery: true,
    model: Model[1]
},{
    path: '/server/mysql/user',
    title: '数据库用户',
    isQuery: true,
    model: Model[1]
},{
    path: '/server/mysql/link',
    title: '数据库链接',
    isQuery: true,
    model: Model[1]
}]

const Server = [{
    path: '/server',
    title: 'DB服务管理',
    icon: 'cloud-server',
    twoLevel: [
        {
            path: `/server/info`,
            title: '基本信息',
            isQuery: true,
            model: [ ...Model ]
        },
        ...OracleMenu,
        ...MysqlMenu
    ]
}]

export default Server;
