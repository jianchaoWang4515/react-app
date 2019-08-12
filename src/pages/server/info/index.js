import React, { useState, useEffect, useRef, useReducer } from 'react';
import './index.less';
import { Descriptions, Icon, Input, message, Tag, Button, Empty, Modal, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { PageTitle } from '@/components';
import { parse } from '@/utils';
import { InitServerInfoState, InitAddFormState, InitModalState } from './state';
import { modalReducer } from './reducer';
import InstanceForm from './components/instanceForm';
import { API } from '@/api';
import { Dbtype } from '../state';
/**
 * mysql与oracle基本信息公用此组件
 */


function ServerInfo(props) {
  useAddBreadcrumb(props);
  let addFormRef;
  const servicenameEl = useRef(null);
  const linkaddressEl = useRef(null);
  const portEl = useRef(null);
  const sidEl = useRef(null);
  // console.log(props.location)
  // const [serviceName, setServiceName] = useState(props.location.state.servicename);
  const { serverDetail:XHR } = API;
  const serverid = parse(props.location.search, 'serviceid');
  const [instanceState, setInstanceState] = useState([]);
  const [serverInfoState, setServerInfoState] = useState(InitServerInfoState);
  const [servicenameEdit, setServicenameEdit] = useState(false);
  const [linkaddressEdit, setLinkaddressEdit] = useState(false);
  const [portEdit, setPortEdit] = useState(false);
  const [sidEdit, setSidEdit] = useState(false);
  const [currentDbtype, setCurrentDbtype] = useState(null);
  const [addFormState] = useState(InitAddFormState);
  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);

  const { serviceid,
          servicename, 
          dbtype, 
          framework = {}, 
          service_version, 
          linkaddress, 
          port, 
          sid } = serverInfoState;

  useEffect(() => {
    getInfo(serverid);
    getSchema(serverid);
    return () => {
      XHR.info.cancel();
      XHR.schema.cancel();
    }
  }, []);
  /**
   * 获取数据库信息
   * @param {number|string} serverid 服务id
   */
  function getInfo(id) {
    XHR.info.send(id).then((res) => {
      setServerInfoState({
        ...serverInfoState,
        ...res
      });
      // 针对手动修改路由serviceid情况下需要重新匹配state.model类型
      if (!props.location.state || (props.location.state && String(res.dbtype) !== props.location.state.model) || !props.location.state.servicename) {
        props.history.replace({
          ...props.location,
          state: {
            ...props.location.state,
            model: String(res.dbtype),
            servicename: res.servicename
          }
        });
      };
    });
  };
  /**
   * 获取数据库实例
   */
  function getSchema(id) {
    const params ={ 
      params: {
        serviceid: id,
        page_size: 9999
      }
    }
    XHR.schema.send(params).then((res) => {
      const dbtype = (res.results && res.results.length) ? res.results[0].dbtype : null;
      setCurrentDbtype(dbtype);
      let data = [];
      switch (dbtype) {
        case 1:
          // mysql
          data = res.results ? res.results.map(item => {
            const { schematype, schemastate, id, port = '' } = item;
            const { ip = '', id: hostId } = item.hosts || {};
            const schema_config = item.schema_config ? JSON.parse(item.schema_config.replace(/'([^']*)'/g, '"$1"')) : {};
            return {
              ...schema_config,
              ip,
              port,
              schematype,
              schemastate,
              id,
              hostId,
              refreshLoading: false,
              delLoading: false
            }
          }) : [];
          break;
        case 0:
          // oracle
          data = res.results ? res.results.map(item => {
            const { schematype, schemastate, port = '', id } = item;
            const { ip = '', id: hostId } = item.hosts || {};
            const schema_config = item.schema_config ? JSON.parse(item.schema_config.replace(/'([^']*)'/g, '"$1"')) : {};
            let newSchemaConfig = [];
            for (const key in schema_config) {
              let obj = {};
              if (key !== 'VERSION') {
                obj.MYLABEL = key;
                obj.VAL = schema_config[key];
                newSchemaConfig.push(obj);
              };
            };
            return {
              schema_config: [ ...newSchemaConfig ],
              version: schema_config.VERSION,
              schematype,
              schemastate,
              port,
              ip,
              id,
              hostId,
              refreshLoading: false,
              delLoading: false
            }
          }) : [];
            break;
        default:
          break;
      }
      setInstanceState([
        ...data
      ]);
    });
  }

  /**
   * 点击修改自动聚焦
   */
  function focus(e) {
    const { name } = e.currentTarget;
    changeEditState(name);
    // 利用setTimeout 在dom更新之后拿到input
    setTimeout(() => {
      switch (name) {
        case 'servicename':
          servicenameEl.current.focus();
          break;
        case 'linkaddress':
          linkaddressEl.current.focus();
            break;
        case 'port':
            portEl.current.focus();
            break;
        case 'sid':
            sidEl.current.focus();
            break;
        default:
          break;
      }
      
    })
  }
  /**
   * 修改某一项
   */
  function onEdit(e) {
    const { name, value } = e.target;
    const params = {
      ...serverInfoState,
      [name]: e.target.value
    }
    XHR.edit(serverid, params).then(res => {
        setServerInfoState({
          ...serverInfoState,
          [name]: value
        })
        changeEditState(name)
        message.success('修改成功');
    });
  }

  function changeEditState(name) {
    switch (name) {
      case 'servicename':
        setServicenameEdit(!servicenameEdit);
        break;
      case 'linkaddress':
          setLinkaddressEdit(!linkaddressEdit);
          break;
      case 'port':
          setPortEdit(!portEdit);
          break;
      case 'sid':
          setSidEdit(!sidEdit);
          break;
      default:
        break;
    }
  }
  /**
   * 改变某一行loading状态
   * @param {Object} id 
   * @param {string} type del 修改删除loading  refresh 修改刷新loading
   */
  function setRowLoading(id, type) {
    let newData = instanceState.map(item => {
      if (item.id === id) {
        if (type === 'del') item.delLoading = !item.delLoading;
        else item.refreshLoading = !item.refreshLoading;
      }
      return item;
    });
    setInstanceState([
      ...newData
    ]);
  }

  function onRefresh(id) {
    setRowLoading(id, 'refresh');
    XHR.schemaDetail(id).then(() => {
      setRowLoading(id, 'refresh');
      message.success('刷新成功');
    });
  }

  function addInstanceSubmit(id) {
    addFormRef.props.form.validateFields((errors, values) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            const params = {
              ...values,
              serviceid: id,
              schematype: 1,
              dbtype: currentDbtype
            };
            XHR.addSchema(params).then(() => {
                getSchema(serverid)
                message.success('新增成功！');
                dispathModal({type: 'success'});
            }).finally(() => {
              dispathModal({type: 'error'});
            });
        };
    });
  }
  
  function delInstance(id) {
    setRowLoading(id, 'del');
    XHR.delSchema(id).then(() => {
        setInstanceState([...instanceState.filter((item) => item.id !== id)]);
        message.success('删除成功！');
    });
  }

  return (
      <div className="app-page server-info-page">
        <PageTitle title={`DB服务详情-${Dbtype[String(dbtype)]}-${props.location.state ? props.location.state.servicename : ''}`}>
          </PageTitle>
        <Descriptions className="host-detail p-16" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="ServiceID">{serviceid || '-'}</Descriptions.Item>
            <Descriptions.Item label="服务名称">
              {!servicenameEdit && (
                <span>
                  {servicename || '-'}
                  <a href="javascript:;" name="servicename" className="m-l-16" onClick={focus}>
                    <Icon type="edit" />
                  </a>
                </span>
              )}
              {servicenameEdit && (
                <Input name="servicename" ref={servicenameEl} defaultValue={servicename} onBlur={() => setServicenameEdit(false)} onPressEnter={(e) => onEdit(e, 'servicename')}/>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="数据库类型">
                {Dbtype[String(dbtype)]}
              </Descriptions.Item>
            <Descriptions.Item label="架构类型">{framework.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="链接地址">
                {!linkaddressEdit && (
                  <span>
                    {linkaddress || '-'}
                    <a href="javascript:;" name="linkaddress" className="m-l-16" onClick={focus}>
                      <Icon type="edit" />
                    </a>
                  </span>
                )}
                {linkaddressEdit && (
                  <Input name="linkaddress" ref={linkaddressEl} defaultValue={linkaddress} onBlur={() => setLinkaddressEdit(false)} onPressEnter={(e) => onEdit(e, 'servicename')}/>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="链接端口">
                {!portEdit && (
                  <span>
                    {port || '-'}
                    <a href="javascript:;" name="port" className="m-l-16" onClick={focus}>
                      <Icon type="edit" />
                    </a>
                  </span>
                )}
                {portEdit && (
                  <Input name="port" ref={portEl} defaultValue={port} onBlur={() => setPortEdit(false)} onPressEnter={(e) => onEdit(e, 'servicename')}/>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="SID">
                {!sidEdit && (
                  <span>
                    {sid || '-'}
                    <a href="javascript:;" name="sid" className="m-l-16" onClick={focus}>
                      <Icon type="edit" />
                    </a>
                  </span>
                )}
                {sidEdit && (
                  <Input name="sid" ref={sidEl} defaultValue={sid} onBlur={() => setSidEdit(false)} onPressEnter={(e) => onEdit(e, 'servicename')}/>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="服务版本">{service_version || '-'}</Descriptions.Item>
        </Descriptions>
        <PageTitle title="数据库实例" isIcon={false}>
          <Button type="primary" size="small" style={{float: 'right', padding: '0 18px'}} onClick={() => {dispathModal({type: 'change'})} }>新增实例</Button>
        </PageTitle>
        {currentDbtype === 0 && (
          instanceState.map((item, index) => (
            <div className="db-instance m-b-16 p-16" key={index}>
                <header className="db-instance_header">
                  <Descriptions>
                    <Descriptions.Item label="IP">
                      <Link to={`/host/detail/${item.hostId}`}>{item.ip || '-'}</Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="端口">{item.port || '-'}</Descriptions.Item>
                    <Descriptions.Item label="版本">{item.version || '-'}</Descriptions.Item>
                  </Descriptions>
                  <div className="db-instance_header-tag">
                    {item.schematype === 0 ? <Tag color="blue">主</Tag> : <Tag color="geekblue">从</Tag>}
                    {item.schemastate === -2 && <Tag color="red">创建失败</Tag>}
                    {item.schemastate === -1 && <Tag>下线</Tag>}
                    {item.schemastate === 0 && <Tag color="green">正常</Tag>}
                    {item.schemastate === 1 && <Tag color="magenta">连接失败</Tag>}
                    {item.schemastate === 2 && <Tag color="lime">创建中</Tag>}
                    <Button type="primary" size="small" 
                             loading={item.refreshLoading}
                            style={{fontSize: '12px', height: '22px'}}
                            className="m-r-8"
                            onClick={() => onRefresh(item.id)}>
                      刷新
                    </Button>
                    <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) =>delInstance(item.id)}>
                      <Button type="danger" size="small" loading={item.delLoading}
                              style={{fontSize: '12px', height: '22px'}}>
                          删除
                      </Button>
                    </Popconfirm>
                  </div>
                </header>
                <Descriptions column={{ xxl: 4, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                  {item.schema_config.map((el,index) => (
                    <Descriptions.Item key={index} label={el.MYLABEL}>{el.VAL || '-'}</Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
          ))
        )}
        {currentDbtype === 1 && (
          instanceState.map((item,index) => (
            <div className="db-instance m-b-16 p-16" key={index}>
              <header className="db-instance_header">
              <Descriptions>
                <Descriptions.Item label="IP">
                  <Link to={`/host/detail/${item.hostId}`}>{item.ip || '-'}</Link>
                </Descriptions.Item>
                <Descriptions.Item label="端口">{item.port || '-'}</Descriptions.Item>
                <Descriptions.Item label="版本">{item.version || '-'}</Descriptions.Item>
              </Descriptions>
              <div className="db-instance_header-tag">
                {item.schematype === 0 ? <Tag color="blue">主</Tag> : <Tag color="geekblue">从</Tag>}
                {item.schemastate === -2 && <Tag color="red">创建失败</Tag>}
                {item.schemastate === -1 && <Tag>下线</Tag>}
                {item.schemastate === 0 && <Tag color="green">正常</Tag>}
                {item.schemastate === 1 && <Tag color="magenta">连接失败</Tag>}
                {item.schemastate === 2 && <Tag color="lime">创建中</Tag>}
                <Button type="primary" size="small" 
                        style={{fontSize: '12px', height: '22px'}}
                        className="m-r-8"
                        loading={item.refreshLoading}
                        onClick={() => onRefresh(item.id)}>
                  刷新
                </Button>
                <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e) => e.stopPropagation()} onConfirm={(e) =>delInstance(item.id)}>
                  <Button type="danger" size="small"  loading={item.delLoading}
                          style={{fontSize: '12px', height: '22px'}}>
                      删除
                  </Button>
                </Popconfirm>
              </div>
            </header>
            <Descriptions column={{ xxl: 4, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="character_set_server">{item.character_set_server || '-'}</Descriptions.Item>
              <Descriptions.Item label="BASEDIR">{item.basedir || '-'}</Descriptions.Item>
              <Descriptions.Item label="DATADIR">{item.datadir || '-'}</Descriptions.Item>
              <Descriptions.Item label="ERROR">{item.log_error || '-'}</Descriptions.Item>
              <Descriptions.Item label="bin_log">{item.log_bin || '-'}</Descriptions.Item>
              <Descriptions.Item label="binlog_Format">{item.binlog_format || '-'}</Descriptions.Item>
              <Descriptions.Item label="binlog_row_image">{item.binlog_row_image || '-'}</Descriptions.Item>
              <Descriptions.Item label="log_bin_basename">{item.log_bin_basename || '-'}</Descriptions.Item>
              <Descriptions.Item label="slow_query_log">{item.slow_query_log || '-'}</Descriptions.Item>
              <Descriptions.Item label="long_query_time">{item.long_query_time || '-'}</Descriptions.Item>
              <Descriptions.Item label="slow_query_log_file">{item.slow_query_log_file || '-'}</Descriptions.Item>
            </Descriptions>
            </div>
          ))
        )}
        {currentDbtype === null && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <Modal
          title='创建数据库'
          cancelText="取消"
          okText="确定"
          maskClosable={false}
          visible={modalState.visible}
          onOk={() => addInstanceSubmit(serverid)}
          confirmLoading={modalState.loading}
          onCancel={() => dispathModal({type: 'change'})}
          afterClose={() => {addFormRef.props.form.resetFields()}}
        >
          <InstanceForm wrappedComponentRef={(form) => addFormRef = form} formData={addFormState} dbtype={currentDbtype}/>
        </Modal>
      </div>
  )
}

export default ServerInfo;
