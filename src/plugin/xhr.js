import axios from 'axios';
import { message } from 'antd';
global.__axiosPending = []; // 全局储存正在pending的XHR 组件unmounted时可取消请求(详情：@/api)
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 400;
}
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = sessionStorage.getItem('sessionToken') || '';// JWT后台认证登录方式
    // 取消重复请求操作
    const cancelName = `${config.method}${config.url}`;
    const markIndex = global.__axiosPending.findIndex(item => {
        return item.name === cancelName;
    });
    // 重复请求
    if (markIndex > -1) {
        global.__axiosPending[markIndex].cancel(); // 取消上个请求
        global.__axiosPending.splice(markIndex, 1); // 删掉在pendingRequest中的请求标识
    }
    // （重新）新建针对这次请求的axios的cancelToken标识
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    // 设置自定义配置requestMark项，主要用于响应拦截中
    config.cancelName = cancelName;
    global.__axiosPending.push({
        name: cancelName,
        cancel: source.cancel
    });

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    let { data = {}, config = {} } = { ...response };
    // 根据请求拦截里设置的requestMark配置来寻找对应pendingRequest里对应的请求标识
    const markIndex = global.__axiosPending.findIndex(item => {
        return item.name === config.cancelName;
    });
    markIndex > -1 && global.__axiosPending.splice(markIndex, 1);
    return data;
}, function (error) {
    // 取消请求 返回“pending”状态的Promise对象中断promise
    if (error.__CANCEL__) {
        return new Promise(()=>{});
    }
    const { data, status } = error.response;
    // 对响应错误做点什么
    if (status === 401 && window.location.pathname !== '/login') {
        message.config({
            maxCount: 1
        });
        message.warning('用户未登录', 0.5, () => {
            window.history.pushState(null,null,'/login');
            window.location.reload();
        });
        return Promise.reject(data);
    } else if (status !== 401) {
        message.error(JSON.stringify(data))
    }
    return Promise.reject(data);
});

export default axios;
