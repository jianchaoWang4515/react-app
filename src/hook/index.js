import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import { UPDATE_BREADCRUMB } from '@/store/type';
import { transformNameKey } from '@/utils';
import routes from '@/router';
import menus from '@/menus';
import { transformMenuNameKey } from '@/utils/menus';
const MenuPathKeyObj = transformMenuNameKey(menus, 'path');// path为key值的菜单对象
/**
 * 路由变化时更新面包屑
 * @param { Object } props 页面组件props
 */
export function useAddBreadcrumb(props) {
    const { dispatch } = useContext(GlobalContext);
    const routesKey = transformNameKey(routes, 'path'); // 以path为key的对象
    useEffect(() => {
        let currentMenu = null;
        const { match, location } = props;
        const { path: matchPath, params } = match;
        const { search, pathname: path, state } = location;
        /**
         * 在面包屑中储存当前页面所属的菜单，用于获取二级菜单
         */
        for (const key in MenuPathKeyObj) {
            // 如果菜单path匹配到或者在child中存在储存当前菜单
            if (key === matchPath || 
            (MenuPathKeyObj[key].child && MenuPathKeyObj[key].child.includes(matchPath))
            ) {
                currentMenu = MenuPathKeyObj[key];
            }
        };
        dispatch({ 
            type: UPDATE_BREADCRUMB,
            breadcrumbList: {
                breadcrumbName: routesKey[matchPath].breadcrumbName,
                path,
                matchPath,
                params,
                search,
                state,
                menu: currentMenu
            }
        })
    }, [props.location]);
}

/**
 * 更新应用title
 * @param {string} title 页面标题
 */
export function useDocumentTitle(title) {
    useEffect(
      () => {
        document.title = title;
        return () => (document.title = "Forrest");
      },
      [title]
    );
}