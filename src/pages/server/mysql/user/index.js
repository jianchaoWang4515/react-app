import React, { useReducer, useEffect, useState } from 'react';
import { Button, Table, Modal, message, Popconfirm, Typography, Tooltip } from 'antd';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { useAddBreadcrumb } from '@/hook';
import { InitModalState, InitTableState, InitAddFormState, TableStatus, UserType } from './state';
import { modalReducer, tableReducer } from './reducer';
import { ResetDbMode } from '@/pages/server/util';
import AddUserForm from './components/addForm';
import { API } from '@/api';
const { Column } = Table;
const { Paragraph } = Typography;
function MysqlDbUser(props) {
  let addFormRef;
  useAddBreadcrumb(props);
  const serverid = parse(props.location.search, 'serviceid');
  const { oracle:XHR } = API.serverDetail;

  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);
  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const [addFormState, setAddFormState] = useState(InitAddFormState);
  const { data, loading } = tableState;

  const [syncLoading, setSyncLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);// true 新增 false 修改
  const [actionUser, setActionUser] = useState(null); // 当前操作的用户信息

  useEffect(() => {
    ResetDbMode(props).then(() => {
      getUser(serverid)
    });
    return () => {
      XHR.dbUserList.cancel();
    };
  }, []);

  function getUser(id) {
    const params = {
      page_size: 9999,
      serviceid: id
    }
    dispathTable({type: 'fetch'});
    XHR.dbUserList.send({ params }).then(res => {
      let data = res.results || [];
      data.forEach(item => {
        item.delLoading = false;
        item.resetLoading = false;
      });
      dispathTable({type: 'success', data: res.results || []});
    }).catch(() => {
      dispathTable({type: 'error', data: []});
    });
  }

  function submit(id) {
    addFormRef.props.form.validateFields((errors, values) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            let xhr = null;
            if (isAdd) {
              const params = {
                ...values,
                user_type: Number(values.user_type),
                databases: values.databases ? values.databases.join() : '',
                dbtype: 1,
                serviceid: id,
                mode: 0
              };
              xhr = XHR.createDbUser(params);
            } else {
              const params = {
                ...values,
                databases: values.databases,
                serviceid: id,
              };
              xhr = XHR.editUser(actionUser.id, params);
            }
            xhr.then(() => {
                getUser(serverid)
                message.success(isAdd ? '新增成功！' : '修改成功');
                dispathModal({type: 'success'});
            }).finally(() => {
              dispathModal({type: 'error'});
            });
        };
    });
  }
  /**
   * 改变某一行loading状态
   * @param {Object} id 
   * @param {string} type del 修改删除loading  reset 重置密码loading
   */
  function setRowLoading(id, type) {
    let newData = data.map(item => {
      if (item.id === id) {
        if (type === 'del') item.delLoading = !item.delLoading;
        else item.resetLoading = !item.resetLoading;
      }
      return item;
    });
    dispathTable({type: 'success', data: newData});
  }

  function resetAddForm() {
    addFormRef.props.form.resetFields();
    setAddFormState({
      ...InitAddFormState
    });
  };

  function resetPwd(userId, serviceid) {
    const params = {
      serviceid,
      password: ''
    };
    setRowLoading(userId, 'reset');
    XHR.resetPwd(userId, params).then(() => {
      message.success('重置成功');
    }).finally(() => {
      setRowLoading(userId, 'reset');
    });
  };

  /**
   * 删除数据库
   * @param { Number } id 数据库id 
   */
  function onDel(e, userId, mode) {
    e.stopPropagation();
    setRowLoading(userId, 'del');
    XHR.deleteUser(userId, { mode }).then(() => {
      const dataSource = [...data];
      dispathTable({ type: 'success', data: dataSource.filter(item => item.id !== userId) });
      message.success('删除成功');
    }).catch(() => {
      setRowLoading(userId, 'del');
    });
  };

  function syncDbUser(id) {
    setSyncLoading(true);
    API.serverDetail.mysql.syncDbUser(id).then(() => {
      getUser(id);
      message.success('同步成功');
    }).finally(() => {
      setSyncLoading(false);
    });
  };

  function onEdit(record) {
    setIsAdd(false);
    const { password, username, user_type, status, databases, privilege = "", remarks } = record;
    const newPrivilege = privilege ? JSON.parse(privilege.replace(/'([^']*)'/g, '"$1"')) : {};
    const { sys_privage = '' } = newPrivilege;
    const owners = newPrivilege.owners ? newPrivilege.owners.reduce((a,b,index) => {
      return a + `${index === 0 ? '' : ','}${b.ownername}`;
    }, '') : '';
    const applications = newPrivilege.applications ? newPrivilege.applications.reduce((a,b,index) => {
      return a + `${index === 0 ? '' : ','}${b.appname}`;
    }, '') : '';
    setAddFormState({
      ...addFormState,
      username,
      password,
      user_type: `${user_type}`,
      status: `${status}`,
      owners,
      sys_privage: JSON.stringify(sys_privage),
      applications,
      databases: databases ? databases.split(',') : [],
      remarks
    });
    setActionUser(record);
    dispathModal({type: 'change'});
  }
  return (
      <div className="app-page">
        <PageTitle title={`数据库-Mysql-${props.location.state ? props.location.state.servicename : ''}`}></PageTitle>
        <Button type="primary" className="m-t-8 m-b-24" onClick={() => {dispathModal({type: 'change'});setIsAdd(true)}}>添加用户</Button>
        <Button loading={syncLoading} type="primary" className="m-t-8 m-l-24" onClick={() => syncDbUser(serverid)}>同步数据库用户</Button>
        <Table
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record) => record.id}
          dataSource={data}
        >
          <Column
            title="用户"
            dataIndex="username"
            key="username"
            align="center"
          />
          <Column
            title="Host"
            dataIndex="mysql_host"
            key="mysql_host"
            align="center"
          />
          <Column
            title="用户类型"
            dataIndex="user_type"
            key="user_type"
            align="center"
            render={(text) => (
              <span>
                {UserType.get(String(text))}
              </span>
            )}
          />
          <Column
            title="状态"
            dataIndex="status"
            key="status"
            align="center"
            render={(text) => (
              <span>
                {TableStatus.get(String(text))}
              </span>
            )}
          />
          <Column
            title="数据库"
            dataIndex="databases"
            key="databases"
            align="center"
            width="300px"
            className="word-wrap"
          />
          <Column
            title="加密串"
            dataIndex="encryption_string"
            key="encryption_string"
            align="center"
            className="word-wrap"
            render={(text) => (
                <Tooltip title={text} overlayStyle={{maxWidth:'50%'}}>
                  <Paragraph style={{marginBottom: 0}} copyable={Boolean(text)} ellipsis={{rows: 1}}>{text}</Paragraph>
                </Tooltip>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            width="250px"
            render={(text, record) => (
              <>
                {record.user_type !== 0 && (
                  <Button size="small" type="primary" onClick={() => onEdit(record)}>修改</Button>
                )}
                <Popconfirm title="此操作会重置数据库中该用户密码,是否重置?" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) => {resetPwd(record.id, serverid)}}>
                  <Button size="small" loading={record.resetLoading} className={record.user_type !== 0 ? 'm-l-8' : ''} type="danger">重置密码</Button>
                </Popconfirm>
                {record.user_type !== 0 && (
                  <Popconfirm title="是否在数据库中删除数据?" cancelText="只删除记录" okText="确定" onCancel={(e) => onDel(e, record.id, 1)} onConfirm={(e) => onDel(e, record.id, 0)}>
                    <Button size="small" loading={record.delLoading} className="m-l-8" type="danger">删除</Button>
                  </Popconfirm>
                )}
              </>
            )}
          />
        </Table>
        <Modal
          title='创建数据库'
          cancelText="取消"
          okText="确定"
          maskClosable={false}
          visible={modalState.visible}
          onOk={() => submit(serverid)}
          confirmLoading={modalState.loading}
          onCancel={() => dispathModal({type: 'change'})}
          afterClose={resetAddForm}
          bodyStyle={{
            maxHeight: `${document.body.clientHeight * 0.6}px`,
            overflow: 'auto'
          }}
        >
          <AddUserForm wrappedComponentRef={(form) => addFormRef = form} 
                      formData={addFormState}
                      serviceid={serverid} 
                      isAdd={isAdd}/>
        </Modal>
      </div>
  )
}

export default MysqlDbUser;
