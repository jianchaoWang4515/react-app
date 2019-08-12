import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './app';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default function App(props) {
    
    return (
        <Router>
            <LocaleProvider locale={zh_CN}>
                <AppLayout></AppLayout>
            </LocaleProvider>
        </Router>
    );
}
