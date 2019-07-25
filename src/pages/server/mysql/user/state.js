export const InitModalState = {
    visible: false,
    loading: false
}

export const InitTableState = {
    data: [],
    loading: false
}

export const InitAddFormState = {
    username: '',
    user_type: '1',
    databases: '',
    owners: '',
    applications: '',
    status: '',
    password: '',
    remarks: '',
    mysql_host: '%',
    sys_privage: ''
}

export const TableStatus = new Map([
    ['-1', '下线'],
    ['0', '正常'],
    ['1', '连接失败'],
    ['2', '创建中'],
])

export const UserType = new Map([
    ['0', '管理用户'],
    ['1', '普通用户'],
    ['2', '只读用户']
])