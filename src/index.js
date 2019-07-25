import React from 'react';
import ReactDOM from 'react-dom';
import JSONSessionStorage from '@/utils/session-storage';
import './theme/index.less';
import App from './pages';
import * as serviceWorker from './serviceWorker';

if (!JSONSessionStorage.getItem('history')) {
    // history用户储存页面搜索字段 页面返回时所用达到浏览的还是上次数据的效果以提高用户体验
    // 点击根菜单会清空一次
    JSONSessionStorage.setItem('history', {});
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
