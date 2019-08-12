import axios from '@/plugin/xhr';
import { cancelAxios } from './util';

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
        list: {
            url: '/api/host/hostinfo/',
            method: 'get',
            send(params) {
                return axios[this.method](this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
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
        list: {
            url: '/api/service/serviceinfo/',
            method: 'get',
            send(params) {
                return axios[this.method](this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
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
        info: {
            url: '/api/service/serviceinfodetail/${serviceid}/',
            method: 'get',
            send(serviceid) {
                const url = `/api/service/serviceinfodetail/${serviceid}/`;
                this.url = url;
                return axios[this.method](url);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        /**
         * 数据库实例
         *  */
        schema: {
            url: '/api/schema/schemainfo/',
            method: 'get',
            send(params) {
                return axios[this.method](this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        /**
         * 新增实例
         */
        addSchema(params) {
            return axios.post('/api/schema/schemainfo/', params);
        },
        /**
         * 删除实例
         */
        delSchema(id) {
            return axios.delete(`/api/schema/schemadetail/${id}/`);
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
             * 数据库链接列表
             */
            space: {
                url: '/api/dbadmin/oracleadmin/${serviceid}/',
                method: 'get',
                send(serviceid, params) {
                    const url = `/api/dbadmin/oracleadmin/${serviceid}/`;
                    this.url = url;
                    return axios[this.method](url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
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
            dbUserList: {
                url: '/api/serviceuser/serviceuserinfo/',
                method: 'get',
                send(params) {
                    return axios[this.method](this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
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
            },
            /**
             * 获取锁等待列表
             */
            slowWait: {
                url: '/api/dbadmin/oracleadmin/${serviceid}/?action=locked',
                method: 'get',
                send(serviceid) {
                    const url = `/api/dbadmin/oracleadmin/${serviceid}/?action=locked`;
                    this.url = url;
                    return axios[this.method](url);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            // slowWait(serviceid) {
            //     return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=locked`);
            // },
            killSlowWait(serviceid, sid, serial, inst_id) {
                return axios.delete(`/api/dbadmin/oracleadmin/${serviceid}/?action=killsession&sid=${sid}&serial=${serial}&inst_id=${inst_id}`);
            },
            /**
             * 巡检报告
             */
            report: {
                url: '/api/dbadmin/oraclereport/',
                method: 'get',
                send(params) {
                    return axios[this.method](this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
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
            dbLink: {
                url: '/api/dbadmin/mysqladmin/${serviceid}/?action=full_processlist',
                method: 'get',
                send(serviceid) {
                    const url = `/api/dbadmin/mysqladmin/${serviceid}/?action=full_processlist`;
                    this.url = url;
                    return axios[this.method](url);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            /**
             * kill数据库结进程
             * @param {string} serviceid 服务id
             * @param {string} pid 进程id
             */
            killDbLink(serviceid, pid) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=killsession&pid=${pid}`);
            },
            /**
             * 慢日志列表
             */
            slowSQLList: { 
                url: '/api/dbadmin/mysqlslowlog',
                method: 'get',
                send(params) {
                    return axios[this.method](this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            /**
             * 慢日志样例
             */
            slowSQLSample(params) {
                return axios.get('/api/dbadmin/mysqlslowloghistory/', params);
            },
            /**
             * 慢日志优化
             */
            slowSQLOptimize(checksum, serviceid) {
                return axios.get(`/api/dbadmin/mysqlslowlogoptimize/${checksum}/?serviceid=${serviceid}`);
            }
        }
    }
}
