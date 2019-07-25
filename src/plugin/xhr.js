import axios from 'axios';
import { message } from 'antd';

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 400;
}
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = sessionStorage.getItem('sessionToken') || '';// 后台认证登录参数
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    let { data } = { ...response };
    return data;
}, function (error) {
    console.log(error)
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
