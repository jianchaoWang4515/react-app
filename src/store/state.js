import JSONSessionStorage from '@/utils/session-storage';
const breadcrumbList = JSONSessionStorage.getItem('crumb');
export const GlobalState = {
    /**
     * 面包屑数组
     * {
     *    breadcrumbName: 名称
     *    params: url参数
     *    search: hash,
     *    state: {},
     *    matchPath,
     *    path,
     *    menu: 所属菜单项数据
     * }
     */
    breadcrumbList: breadcrumbList || [],
    routeId: 1,
    test: 2,
    userInfo: ''
} 
