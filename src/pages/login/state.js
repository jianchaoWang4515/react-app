import JSONLocalStorage from '@/utils/local-storage';

export function InitLoginState(props) {
    const { username = '', password = '', rememberMe = false } = JSONLocalStorage.getItem('loginForm') || {};
    console.log(username);
    return {
        username,
        password,
        rememberMe,
        loading: false
    }
};