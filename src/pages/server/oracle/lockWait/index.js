import React, { useReducer, useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { withRouter } from 'react-router-dom';
import { InitTableState } from './state';
import { tableReducer } from './reducer';
import { useAddBreadcrumb } from '@/hook';
import { ResetDbMode } from '@/pages/server/util';
import { API } from '@/api';
const { Column } = Table;
function LockWait(props) {
  const serverid = parse(props.location.search, 'serviceid');
  const { oracle:XHR } = API.serverDetail;
  useAddBreadcrumb(props);

  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;

  useEffect(() => {
    ResetDbMode(props).then(() => {
      getDta(serverid);
    });
    return () => {
      XHR.slowWait.cancel();
    };
  }, []);

  function getDta(id) {
    dispathTable({ type: 'fetch'});
    XHR.slowWait.send(id).then(res => {
      let data = res || [];
      data.forEach(ele => {
        const { INST_ID, SID} = ele;
        ele._id = `${INST_ID}${SID}`;
        ele.loading = false;
      });
      dispathTable({ type: 'success', data});
    }).catch(() => {
      dispathTable({ type: 'error'});
    });
  };
  /**
   * 改变某一行loading状态
   * @param {Object} record 要改变的行数据
   * @param {string} key 唯一值
   */
  function setRowLoading(record, key) {
    let newData = data.map(item => {
      if (item[key] === record[key]) item.loading = !item.loading;
      return item;
    });
    dispathTable({ type: 'success', data: newData});
  }
  function onKill(e, serverid, record) {
    e.stopPropagation();
    const { SID, INST_ID } = record;
    setRowLoading(record, '_id');
    XHR.killSlowWait(serverid, SID, record['SERIAL#'], INST_ID).then(res => {
      getDta(serverid);
      message.success('操作成功');
      setRowLoading(record, '_id');
    });
  }
  return (
      <div className="app-page">
        <PageTitle title={`数据库链接-Oracle-${props.location.state ? props.location.state.servicename : ''}`}></PageTitle>
        <Table
         className="m-t-24"
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record) => record._id}
          dataSource={data}
        >
          <Column
            title="INST_ID"
            dataIndex="INST_ID"
            key="INST_ID"
            align="center"
          />
          <Column
            title="SID"
            dataIndex="SID"
            key="SID"
            align="center"
          />
          <Column
            title="SERIAL#"
            dataIndex="SERIAL#"
            key="SERIAL#"
            align="center"
          />
          <Column
            title="USERNAME"
            dataIndex="USERNAME"
            key="USERNAME"
            align="center"
          />
          <Column
            title="PROGRAM"
            dataIndex="PROGRAM"
            key="PROGRAM"
            align="center"
          />
          <Column
            title="SECONDS_IN_WAIT"
            dataIndex="SECONDS_IN_WAIT"
            key="SECONDS_IN_WAIT"
            align="center"
          />
          <Column
            title="SQL_ID"
            dataIndex="SQL_ID"
            key="SQL_ID"
            align="center"
          />
          <Column
            title="SQL_TEXT"
            dataIndex="SQL_TEXT"
            key="SQL_TEXT"
            align="center"
            className="word-wrap"
          />
          <Column
            title="操作"
            key="action"
            align="center"
            render={(text, record) => (
              <Popconfirm title="是否KILL此链接？" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) => onKill(e, serverid, record)}>
                <Button size="small" type="danger" loading={record.loading}>KILL</Button>
              </Popconfirm>
            )}
          />
        </Table>
      </div>
  )
}

export default withRouter(LockWait);
