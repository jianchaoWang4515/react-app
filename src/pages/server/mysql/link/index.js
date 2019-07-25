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
function MysqlLink(props) {
  const serverid = parse(props.location.search, 'serviceid');
  const { mysql:XHR } = API.serverDetail;
  useAddBreadcrumb(props);

  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;

  const [killLoading, setKillLoading] = useState(false);
  const [actionLink, setActionLink] = useState(false);

  useEffect(() => {
    ResetDbMode(props).then(() => {
      getDta(serverid);
    })
  }, []);

  function getDta(id) {
    dispathTable({ type: 'fetch'});
    XHR.dbLink(id).then(res => {
      dispathTable({ type: 'success', data: res || []});
    }).catch(() => {
      dispathTable({ type: 'error'});
    });
  };

  function onKill(e, id, pid) {
    e.stopPropagation();
    setKillLoading(true);
    XHR.killDbLink(id, pid).then(res => {
      getDta(id);
      message.success('操作成功');
    }).finally(() => {
      setKillLoading(false);
    });
  }
  return (
      <div className="app-page">
        <PageTitle title={`数据库链接-Mysql`}></PageTitle>
        <Table
         className="m-t-24"
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record) => record.ID}
          dataSource={data}
        >
          <Column
            title="ID"
            dataIndex="ID"
            key="ID"
            align="center"
          />
          <Column
            title="HOST"
            dataIndex="HOST"
            key="HOST"
            align="center"
          />
          <Column
            title="DB"
            dataIndex="DB"
            key="DB"
            align="center"
          />
          <Column
            title="COMMAND"
            dataIndex="COMMAND"
            key="COMMAND"
            align="center"
          />
          <Column
            title="TIME"
            dataIndex="TIME"
            key="TIME"
            align="center"
          />
          <Column
            title="STATE"
            dataIndex="STATE"
            key="STATE"
            align="center"
          />
          <Column
            title="INFO"
            dataIndex="INFO"
            key="INFO"
            align="center"
            className="word-wrap"
          />
          <Column
            title="操作"
            key="action"
            align="center"
            render={(text, record) => (
              <Popconfirm title="是否KILL此链接？" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) => onKill(e, serverid, record.ID)}>
                <Button size="small" type="danger" onClick={() => setActionLink(record)} loading={actionLink.ID === record.ID && killLoading}>KILL</Button>
              </Popconfirm>
            )}
          />
        </Table>
      </div>
  )
}

export default withRouter(MysqlLink);
