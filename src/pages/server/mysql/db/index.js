import React, { useReducer, useEffect, useState } from 'react';
import { Button, Table, Modal, message, Popconfirm } from 'antd';
import Moment from 'moment';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { useAddBreadcrumb } from '@/hook';
import { InitModalState, InitTableState, InitAddFormState } from './state';
import { modalReducer, tableReducer } from './reducer';
import AddDbForm from './components/addForm';
import { ResetDbMode } from '@/pages/server/util';
import { API } from '@/api';
const { Column } = Table;
function MysqlDb(props) {
  let addFormRef;
  useAddBreadcrumb(props);
  const serverid = parse(props.location.search, 'serviceid');
  const { mysql:XHR } = API.serverDetail;

  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);
  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const [addFormState] = useState(InitAddFormState);
  const { data, loading } = tableState;

  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    ResetDbMode(props).then(() => {
      getData(serverid);
    });
  }, []);

  function getData(id) {
    const params = {
      page_size: 9999,
      serviceid: id
    }
    dispathTable({type: 'fetch'});
    XHR.db({ params }).then(res => {
      let data = res.results || [];
      data.forEach(item => {
        item.loading = false;
      });
      dispathTable({type: 'success', data});
    }).catch(() => {
      dispathTable({type: 'error', data: []});
    });
  }

  function submit(id) {
    addFormRef.props.form.validateFields((errors, values) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            const params = {
              ...values,
              serviceid: id,
              mode: 0
            }
            XHR.create(params).then(() => {
                getData(serverid)
                message.success('新增成功！');
                dispathModal({type: 'success'});
            }).finally(() => {
              dispathModal({type: 'error'});
            });
        };
    });
  }

  function resetAddForm() {
    addFormRef.props.form.resetFields();
  } 

  /**
   * 改变某一行loading状态
   * @param {Object} id 
   * @param {string} type del 修改删除loading  reset 重置密码loading
   */
  function setRowLoading(id) {
    let newData = data.map(item => {
      if (item.id === id) item.loading = !item.loading;
      return item;
    });
    dispathTable({type: 'success', data: newData});
  }

  /**
   * 删除数据库
   * @param { Number } id 数据库id 
   */
  function onDel(e, id) {
    e.stopPropagation();
    setRowLoading(id)
    XHR.delete(id).then(() => {
      const dataSource = [...data];
      dispathTable({ type: 'success', data: dataSource.filter(item => item.id !== id) });
      message.success('删除成功');
    }).catch(() => {
      setRowLoading(id);
    })
  }

  function syncDb(id) {
    setSyncLoading(true);
    XHR.syncDB(id).then(() => {
      getData(id);
      message.success('同步成功');
    }).finally(() => {
      setSyncLoading(false);
    })
  }

  return (
      <div className="app-page">
        <PageTitle title={`数据库-Mysql-${props.location.state ? props.location.state.servicename : ''}`}></PageTitle>
        <Button type="primary" className="m-t-8 m-b-24" onClick={() => {dispathModal({type: 'change'})}}>创建数据库</Button>
        <Button loading={syncLoading} type="primary" className="m-t-8 m-l-24" onClick={() => syncDb(serverid)}>同步数据库信息</Button>
        <Table
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record) => record.id}
          dataSource={data}
        >
          <Column
            title="库名"
            dataIndex="databasename"
            key="databasename"
            align="center"
          />
          <Column
            title="字符类型"
            dataIndex="charcter"
            key="charcter"
            align="center"
          />
          <Column
            title="排序规则"
            dataIndex="collate"
            key="collate"
            align="center"
          />
          <Column
            title="创建时间"
            dataIndex="createtime"
            key="createtime"
            align="center"
            render={(text) => (
              <span>{Moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            render={(text, record) => (
              <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) => onDel(e, record.id)}>
                  <Button size="small" loading={record.loading} type="danger">删除</Button>
              </Popconfirm>
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
        >
          <AddDbForm wrappedComponentRef={(form) => addFormRef = form} formData={addFormState}/>
        </Modal>
      </div>
  )
}

export default MysqlDb;
