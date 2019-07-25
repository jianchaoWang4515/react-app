import React, { useEffect, useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import MyLayout from './layout';
import { AuthRouter } from '@/components';
import routes from '@/router';
import Login from '@/pages/login';
import { GlobalContext,GlobalReducer,GlobalState } from '@/store';
import { API } from '@/api';

 function AppLayout(props) {
    const [state, dispatch] = useReducer(GlobalReducer,GlobalState);
    const { global:XHR } = API;
    useEffect(() => {
        XHR.session().then((res) => {
            if (props.location.pathname === '/login') {
                props.history.goBack();
            } else {
                dispatch({type: 'UPDATE_USER_INFO', userInfo: res ? res[0] : ''});
            };
        });
    }, [props.location, XHR, props.history]);
    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            <Switch>
                <Route exact path="/login" component={Login} />
                {
                    state.userInfo && (
                        <MyLayout>
                            <Switch>
                                {routes.map((route,index) => {
                                    let { exact, path, component: Component, breadcrumbName } = route;
                                    return <AuthRouter breadcrumbName={breadcrumbName} exact={exact} key={index} path={path} component={Component} />
                                })}
                            </Switch>
                        </MyLayout>
                    )
                }
            </Switch>
        </GlobalContext.Provider>
    );
}

export default withRouter(AppLayout);
