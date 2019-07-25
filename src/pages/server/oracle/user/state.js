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
    role: ['connect'],
    owners: '',
    applications: '',
    tables: '',
    status: '',
    password: '',
    remarks: ''
}

export const TableStatus = new Map([
    ['-1', '下线'],
    ['0', '正常'],
    ['1', '连接失败'],
    ['2', '创建中'],
])