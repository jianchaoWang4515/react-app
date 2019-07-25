import JSONSessionStorage from '@/utils/session-storage';

export const InitState = {
    total: 0,
    tableData: [],
    formData: {
        ip: '',
        servertype: '0',
        servermode: '0',
        port: '',
        admin_user: '',
        admin_password: '',
    }
}

export function InitSearchFormData(props) {
    const { search = '', servermode = '-1', servertype = '-1', page = 1 } = JSONSessionStorage.getItem('history')[props.match.path] || {};
    return {
        search,
        servermode,
        servertype,
        page,
        page_size: 10
    }
}
