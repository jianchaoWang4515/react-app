import JSONSessionStorage from '@/utils/session-storage';
export const InitAddFormState = {
        servicename: '',
        dbtype: '0',
        framework: '',
        service_version: '',
        linkaddress: '',
        port: '',
        sid: '',
        adminuser: '',
        adminpassword: '',
        schemas: {}
}

export const InitTableState = {
    total: 0,
    tableData: []
};

export function InitSearchFormData(props) {
    const { search = '', dbtype = '-1', page = 1 } = JSONSessionStorage.getItem('history')[props.match.path] || {};
    return {
        search,
        dbtype,
        page,
        page_size: 10
    }
}

// 数据库类型
export const Dbtype = {
    '0': 'Oracle',
    '1': 'Mysql'
}
