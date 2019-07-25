import React, { useState, useEffect, useCallback } from 'react';
import JSONSessionStorage from '@/utils/session-storage';
import { PageTitle } from '@/components';
import './index.less';
import { Button, Table, Popconfirm, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { API } from '@/api';
import { InitState, InitSearchFormData } from './state';
import SearchForm from './searchForm';
// import AddHost from './components/addHost';
const { Column } = Table;
function Host(props) {

  const { host:XHR } = API;
  let formRef;
  useAddBreadcrumb(props);
  
  // const [visibleModal, setVisibleModal] = useState(false);
  const [state, setState] = useState(InitState);
  const [searchFormData, setSearchFormData] = useState(InitSearchFormData(props));
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  // const [isAdd, setIsAdd] = useState(true); // 区分新增或修改
  // const [hostId, setHostId] = useState(0); // 修改时当前主机id
  const { search, servermode, servertype, page, page_size } = searchFormData;
  const {
          tableData, 
          total,
          formData
        } = state;
  const fetch = useFetch({search, servermode, servertype, page});
  
  useEffect(() => {
    fetch()
  }, [fetch]);

  function useFetch({ search = '', servermode = '-1', servertype = '-1', page = 1, page_size = 10 }) {
    return useCallback(() => {
      getData({search, servermode, servertype, page, page_size});
    }, [search, servermode, servertype, page, page_size]);
  }

  /**
   *  在setState之后立即执行此方法无法获取到state最新的值 暂时使用传参的方法
   * */
  function getData({ search, servermode, servertype, page, page_size }) {

    JSONSessionStorage.updateItem('history', {[props.match.path]: {search, servermode,servertype,page }});

    setLoading(true);

    XHR.list({
      params: {
        search,
        servermode: servermode === '-1' ? "" : servermode,
        servertype: servertype === '-1' ? "" : servertype,
        page,
        page_size
      }
    }).then((res) => {
      const { results, count } = res;
      const data = results.map(item => {
                item.hostName = '-';
                item.conf = '-';
              if (item.host_configuration) {
                const hostConf = JSON.parse(item.host_configuration.replace(/'([^']*)'/g, '"$1"'));
                item.hostName = hostConf.hostname;
                item.conf = `${hostConf.os_cpu}C${Math.ceil(hostConf.os_mem / 1024)}G`;
              }
              return item; 
      });
      setState({
        ...state,
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
      const { search, servermode, servertype } = formRef.props.form.getFieldsValue();
      setSearchFormData({
        search,
        servermode,
        servertype,
        page: 1
      });
    });
  }

  /**
   * 页码改变之后搜索
   */
  function changePage(page) {
    setSearchFormData({
      ...searchFormData,
      page
    });
  }

  /**
   * 更改新增主机弹框状态
   * @parma { Boolean } isFetch 是否需要重新获取数据
   */
  // function changeModal({ isFetch = false }) {
  //   setVisibleModal(!visibleModal);
  //   if (isFetch) getData({search, servermode, servertype, page, page_size});
  // }
  
  /**
   * 新增
   * 20190715 注释 3个月之后在删除代码
   */
  // function addhandle() {
  //   setIsAdd(true);
  //   changeModal({});
  // }

  /**
   * 修改
   * 20190715 注释 3个月之后在删除代码
   */
  // function onEdit(e, record) {
  //   e.stopPropagation();
  //   const { ip, servertype, servermode, port, admin_user, admin_password } = record;
  //   setState({
  //     ...state,
  //     formData: { 
  //       ip,
  //       servertype: String(servertype),
  //       servermode: String(servermode),
  //       port,
  //       admin_user,
  //       admin_password
  //      },
  //   });
  //   setIsAdd(false);
  //   setHostId(record.id);
  //   changeModal({});
  // }

  /**
   * 同步主机
   */
  function syncHost() {
    setSyncLoading(true);
    XHR.sync().then(() => {
      message.success('同步主机完成');
    }).finally(() => {
      setSyncLoading(false);
    })
  }
  /**
   * 删除主机
   * @param { Number } id 主机id 
   */
  function onDel(e, id) {
    e.stopPropagation();
    XHR.delete(id).then(() => {
      const dataSource = [...tableData];
      setState({ ...state, tableData: dataSource.filter(item => item.id !== id) });
      message.success('删除成功');
    })
  }

  function onReset() {
    setSearchFormData({
      search: '',
      servermode: '-1',
      servertype: '-1',
      page: 1
    });
    formRef.props.form.resetFields();
  }

  return (
      <div className="app-page host-page">
        <PageTitle title="主机列表"></PageTitle>
        <div className="clear-box app-flex app-flex-middle">
          {/* <Button type="primary" onClick={addhandle}>新增主机</Button> */}
          <Button type="primary" loading={syncLoading} disabled={syncLoading} onClick={syncHost}>同步主机</Button>
          <SearchForm wrappedComponentRef={(form) => formRef = form} data={{search, servermode, servertype}} onChange={searchData} />
          <Button type="primary" onClick={onReset}>重置</Button>
        </div>
        <Table className="m-t-24" size="middle" 
               rowKey={(record) => record.id} 
               dataSource={tableData} 
               loading={loading}
               onRow={record => {
                  return {
                    onClick: event => { props.history.push(`/host/detail/${record.id}`)},
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
                    title="主机IP"
                    dataIndex="ip"
                    key="ip"
                    align="center"
                    width="200px"
                  />
                  <Column
                    title="主机类型"
                    dataIndex="servermode"
                    key="servermode"
                    width="130px"
                    align="center"
                    render={(text) => (
                      <span>
                        {text === 0 ? '物理机' : '虚拟机'}
                      </span>
                    )}
                  />
                  <Column
                    title="环境"
                    dataIndex="servertype"
                    key="servertype"
                    align="center"
                    render={(text) => (
                      <span>
                        {text === 0 ? '生产' : '测试'}
                      </span>
                    )}
                  />
                  <Column
                    title="主机名"
                    dataIndex="hostName"
                    align="center"
                    key="hostName"
                  />
                  <Column
                    title="性能配置"
                    dataIndex="conf"
                    key="conf"
                    align="center"
                    width="100px"
                  />
                  <Column
                    title="管理用户"
                    dataIndex="admin_user"
                    key="admin_user"
                    align="center"
                  />
                  <Column
                    title="端口"
                    dataIndex="port"
                    key="port"
                    align="center"
                  />
                 <Column
                    title="操作"
                    key="action"
                    align="center"
                    render={(text, record) => (
                      <span>
                        {/* <a href="javascript:;" onClick={(e) => onEdit(e,record)}>修改</a> */}
                        <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) => onDel(e, record.id)}>
                          <a href="javascript:;" onClick={(e) => e.stopPropagation()}>删除</a>
                        </Popconfirm>
                      </span>
                    )}
                  />
               </Table>
        {/* <AddHost formData={formData} isAdd={isAdd} visible={visibleModal} changeModal={changeModal} hostId={hostId}/> */}
      </div>
  )
}

export default withRouter(Host);
