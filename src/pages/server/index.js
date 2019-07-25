import React, { useState, useEffect, useCallback } from 'react';
import JSONSessionStorage from '@/utils/session-storage';
import { PageTitle } from '@/components';
import './index.less';
import { Button, Table, Popconfirm, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { API } from '@/api';
import { InitAddFormState, InitSearchFormData, InitTableState } from './state';
import SearchForm from './searchForm';
import AddServer from './components/addServer';
const { Column } = Table;
function Server(props) {

  const { server:XHR } = API;
  let formRef;
  useAddBreadcrumb(props);
  
  const [tableState, setTableState] = useState(InitTableState);
  const {tableData, total} = tableState;

  const [visibleModal, setVisibleModal] = useState(false);

  const [addFormState, setAddFormState] = useState(InitAddFormState);

  const [searchFormData, setSearchFormData] = useState(InitSearchFormData(props));

  const [loading, setLoading] = useState(false);

  const { search, dbtype, page, page_size } = searchFormData;
  const fetch = useFetch({search, dbtype, page});
  
  useEffect(() => {
    fetch()
  }, [fetch]);

  function useFetch({ search = '', dbtype = '-1', page = 1, page_size = 10 }) {
    return useCallback(() => {
      getData({search, dbtype, page, page_size});
    }, [search, dbtype, page, page_size]);
  }

  function getData({ search, dbtype, page, page_size }) {

    JSONSessionStorage.updateItem('history', {[props.match.path]: {search, dbtype, page }});

    setLoading(true);

    XHR.list({
      params: {
        search,
        dbtype: dbtype === '-1' ? "" : dbtype,
        page,
        page_size
      }
    }).then((res) => {
      const { results, count } = res;
      const data = results.map(item => {
              item.framework = item.framework ? item.framework.name : '-';
              return item; 
      });
      setTableState({
        ...tableState,
        total: count || 0,
        tableData: data
      })
    }).finally(() => {
      setLoading(false);
    })
  }

  /**
   * 搜索项改变之后搜索
   */
  function searchData() {
    // 用setTimeout获取select控件onChange事件更新过后的值
    setTimeout(() => {
      const { search, dbtype } = formRef.props.form.getFieldsValue();
      setSearchFormData({
        search,
        dbtype,
        page: 1,
      });
    });
  }

  /**
   * 页码改变之后搜索
   */
  function changePage(page) {
    setSearchFormData({
      ...searchFormData,
      page,
    });
  }

  /**
   * 更改新增主机弹框状态
   * @parma { Boolean } isFetch 是否需要重新获取数据
   */
  function changeModal({ isFetch = false }) {
    setVisibleModal(!visibleModal);
    if (isFetch) getData({search, dbtype, page, page_size});
  }
  
  /**
   * 新增
   */
  function addhandle() {
    changeModal({});
  }

  /**
   * 删除主机
   * @param { Number } id 主机id 
   */
  function onDel(e, serviceid) {
    e.stopPropagation();
    XHR.delete(serviceid).then(() => {
      const dataSource = [...tableData];
      setTableState({ ...tableState, tableData: dataSource.filter(item => item.serviceid !== serviceid) });
      message.success('删除成功');
    })
  }

  /**
   * 重置
   */
  function onReset() {
    setSearchFormData({
      search: '',
      dbtype: '-1',
      page: 1
    });
    formRef.props.form.resetFields();
  }

  function lookDetail(record) {
    props.history.push({
      pathname: `/server/info`,
      search: `serviceid=${record.serviceid}`,
      state: {
        model: `${record.dbtype}`
      }
    })
  }

  return (
      <div className="app-page server-page">
        <PageTitle title="DB服务列表"></PageTitle>
        <div className="clear-box app-flex app-flex-middle">
          <Button type="primary" onClick={addhandle}>新增服务</Button>
          <SearchForm wrappedComponentRef={(form) => formRef = form} data={{search, dbtype}} onChange={searchData} />
          <Button type="primary" onClick={onReset}>重置</Button>
        </div>
        <Table className="m-t-24" size="middle"
                rowKey={(record) => record.id} 
               dataSource={tableData} 
               loading={loading}
               onRow={record => {
                  return {
                    onClick: event => lookDetail(record),
                  };
                }}
               pagination={{
                 total,
                 pageSize: page_size,
                 current: page,
                 size: "default",
                 onChange: changePage
               }} >
                 <Column
                    title="服务名称"
                    dataIndex="servicename"
                    key="servicename"
                    align="center"
                    width="200px"
                  />
                  <Column
                    title="数据库类型"
                    dataIndex="dbtype"
                    key="dbtype"
                    width="130px"
                    align="center"
                    render={(text) => (
                      <span>
                        {text === 0 ? 'Oracle' : 'Mysql'}
                      </span>
                    )}
                  />
                  <Column
                    title="数据库版本"
                    dataIndex="service_version"
                    key="service_version"
                    align="center"
                  />
                  <Column
                    title="架构类型"
                    dataIndex="framework"
                    align="center"
                    key="framework"
                  />
                  <Column
                    title="链接地址"
                    dataIndex="linkaddress"
                    key="linkaddress"
                    align="center"
                    width="100px"
                  />
                  <Column
                    title="链接端口"
                    dataIndex="port"
                    key="port"
                    align="center"
                  />
                  <Column
                    title="SID"
                    dataIndex="sid"
                    key="sid"
                    align="center"
                  />
                 <Column
                    title="操作"
                    key="action"
                    align="center"
                    render={(text, record) => (
                        <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) => onDel(e, record.serviceid)}>
                          <a href="javascript:;" onClick={(e) => e.stopPropagation()}>删除</a>
                        </Popconfirm>
                    )}
                  />
               </Table>
        <AddServer formData={addFormState} visible={visibleModal} changeModal={changeModal} changeDbtype={(val) => setAddFormState({...addFormState, dbtype:val})}/>
      </div>
  )
}

export default withRouter(Server);
