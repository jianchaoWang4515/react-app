import Server from '@/pages/server';
import Info from '@/pages/server/info';
import OracleSpace from '@/pages/server/oracle/space';
import OracleUser from '@/pages/server/oracle/user';
import OracleLockWait from '@/pages/server/oracle/lockWait';
import OracleReport from '@/pages/server/oracle/report';
import MysqlDb from '@/pages/server/mysql/db';
import MysqlUser from '@/pages/server/mysql/user';
import MysqlLink from '@/pages/server/mysql/link';
import MysqlSlowSQL from '@/pages/server/mysql/slowSQL';


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
},{
    path: '/server/oracle/lock',
    breadcrumbName: '锁等待',
    exact: true,
    component: OracleLockWait
},{
    path: '/server/oracle/report',
    breadcrumbName: '巡检报告',
    exact: true,
    component: OracleReport
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
},{
    path: '/server/mysql/slowSQL',
    breadcrumbName: '慢SQL',
    exact: true,
    component: MysqlSlowSQL
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
