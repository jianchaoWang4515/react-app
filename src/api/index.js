import axios from '@/plugin/xhr';

export const API = {
    global: {
        session() {
            return axios.get('/api/user/basedata/');
        }
    },
    login: {
        submit(params) {
            return axios.post('/api/api/v1/login/', params);
        }
    },
    /**
     * 主机管理
     */
    host: {
        list(params) {
            return axios.get('/api/host/hostinfo/', params);
        },
        create(params) {
            return axios.post('/api/host/hostinfo/', params);
        },
        edit(id, params) {
            return axios.put(`/api/host/hostinfodetail/${id}/`, params);
        },
        delete(id) {
            return axios.delete(`/api/host/hostinfodetail/${id}/`);
        },
        sync() {
            return axios.get('/api/host/hostinfo/?action=synchost');
        },
        detail: {
            info(id, params) {
                return axios.get(`/api//host/hostinfodetail/${id}/`, params);
            },
            baseInfo(id, params) {
                return axios.get(`/api/host/hostdetail/${id}/`, params);
            }
        }
    },
    server: {
        list(params) {
            return axios.get('/api/service/serviceinfo/', params);
        },
        delete(id) {
            return axios.delete(`/api/service/serviceinfodetail/${id}/`);
        },
        create(params) {
            return axios.post(`/api/service/serviceinfoadd/`, params);
        },
        /**
         * 架构类型
         */
        framework(params) {
            return axios.get(`/api/service/framework/`, params);
        }
    },
    serverDetail: {
        info(serviceid) {
            return axios.get(`/api/service/serviceinfodetail/${serviceid}/`);
        },
        // 数据库实例
        schema(params) {
            return axios.get('/api/schema/schemainfo/', params);
        },
        // 刷新数据库实例
        schemaDetail(id) {
            return axios.get(`/api/schema/schemadetail/${id}/?action=refresh`);
        },
        edit(serviceid, params) {
            return axios.put(`/api/service/serviceinfodetail/${serviceid}/`, params);
        },
        oracle: {
            /**
             * 获取表空间及数据文件信息
             */
            space(serviceid, params) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/`, params);
            },
            /**
             * 增加表空间或增加数据文件
             */
            add(serviceid, action, params) {
                return axios.put(`/api/dbadmin/oracleadmin/${serviceid}/?action=${action}`, params);
            },
            /**
             * 数据库用户列表
             */
            dbUserList(params) {
                return axios.get('/api/serviceuser/serviceuserinfo/', params);
            },
            /**
             * 同步Oracle数据库用户
             */
            syncDbUser(serviceid) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=sync_user`);
            },
            createDbUser(params) {
                return axios.post('/api/serviceuser/serviceuserinfo/', params);
            },
            /**
             * 修改用户
             */
            editUser(userId, params) {
                return axios.put(`/api/serviceuser/serviceuserdetail/${userId}/`, params);
            },
            resetPwd(id, params) {
                return axios.put(`/api/serviceuser/serviceuserdetail/${id}/?action=change_password`, params);
            },
            /**
             * 获取owner
             */
            owners(serviceid) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=owners`);
            },
            /**
             * 获取owner所有表名
             */
            ownersTables(serviceid, owner) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=owner_tables&owner=${owner}`);
            },
            deleteUser(userId, params) {
                return axios.put(`/api/serviceuser/serviceuserdetail/${userId}/?action=delete`, params);
            }
        },
        mysql: {
            db(params) {
                return axios.get('/api/servicedatabase/servicedatabaseinfo/', params);
            },
            create(params) {
                return axios.post(`/api/servicedatabase/servicedatabaseinfo/`, params);
            },
            /**
             * 删除数据库
             * @param {string} id 数据库id
             */
            delete(id) {
                return axios.delete(`/api/servicedatabase/servicedatabasedetial/${id}/`);
            },
            syncDB(serviceid) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=sync_database`);
            },
            /**
             * 同步Mysql数据库用户
             */
            syncDbUser(serviceid) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=sync_user`);
            },
            /**
             * 数据库链接列表
             */
            dbLink(serviceid) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=full_processlist`);
            },
            /**
             * kill数据库结进程
             * @param {string} serviceid 服务id
             * @param {string} pid 进程id
             */
            killDbLink(serviceid, pid) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=killsession&pid=${pid}`);
            }
        }
    }
}
