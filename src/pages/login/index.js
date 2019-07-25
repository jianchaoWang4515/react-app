import React, { useReducer } from 'react';
import { message } from 'antd';
import './index.less';
import LoginForm from './loginForm';
import { InitLoginState } from './state';
import { submitReducer } from './reducer';
import { API } from '@/api';
import JSONLocalStorage from '@/utils/local-storage';

function Login(props) {
  let formRef;
  const { login:XHR } = API;
  const [formState, dispath] = useReducer(submitReducer, InitLoginState());

  function submit(e) {
    e.preventDefault();
    dispath({type: 'login'});
    formRef.props.form.validateFields((err, values) => {
        if (!err) {
          const { username, password, rememberMe } = values;
          const params = {
            username,
            password
          };
          XHR.submit(params).then((res) => {
            let rememberState = {
              username,
              password: '',
              rememberMe: false
            };
            if (rememberMe) {
              rememberState.password = password;
              rememberState.rememberMe = rememberMe;
            };
            JSONLocalStorage.setItem('loginForm', rememberState);
            // 由于后端登录权限认证方式为拿req.header.Authorization的值去认证，
            // 故先储存token 在xhr设置header.Authorization
            sessionStorage.setItem('sessionToken', `JWT ${res.token || ''}`);
            message.success('登录成功');
            props.history.push('/');
          }).catch(() => {
            dispath({type: 'error'});
          })
        };
      });
      
  }
  return (
      <div className="app-login">
        <div className="app-login_box">
          <div className="title">Forrest</div>
          <LoginForm wrappedComponentRef={(form) => formRef = form} formData={formState} onSubmit={submit}/>
        </div>
      </div>
  )
}

export default Login;
