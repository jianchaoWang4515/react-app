
export const InitState = {
    loading: false,
    error: ''
}

// 添加已安装服务表单数据
export const InitInstalledFormState = {
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

// 安装服务表单数据
export const InitInstallFormState = {
    servicename: '',
    dbtype: '0',
    framework: '',
    vip: '',
    mysql_port: '',
    oracle_port: '',
    sid: '',
    hostList: {},
    master_info: '',
    slave_info: ''
}