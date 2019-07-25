import Server from '@/pages/server';
import Info from '@/pages/server/info';
import OracleSpace from '@/pages/server/oracle/space';
import OracleUser from '@/pages/server/oracle/user';
import MysqlDb from '@/pages/server/mysql/db';
import MysqlUser from '@/pages/server/mysql/user';
import MysqlLink from '@/pages/server/mysql/link';


const Oracle = [{
    path: '/server/oracle/space',
    breadcrumbName: '表空间',
    exact: true,
    component: OracleSpace
},{
    path: '/server/oracle/user',
    breadcrumbName: '数据库用户',
    exact: true,
    component: OracleUser
}]

const Mysql = [{
    path: '/server/mysql/db',
    breadcrumbName: '数据库',
    exact: true,
    component: MysqlDb
},{
    path: '/server/mysql/user',
    breadcrumbName: '数据库用户',
    exact: true,
    component: MysqlUser
},{
    path: '/server/mysql/link',
    breadcrumbName: '数据库链接',
    exact: true,
    component: MysqlLink
}];

export default [{
    path: '/server',
    breadcrumbName: 'DB服务管理',
    exact: true,
    component: Server,
    children: []
},
{
    path: '/server/info',
    breadcrumbName: '基本信息',
    exact: true,
    component: Info,
    children: []
},
...Oracle,
...Mysql,
];
