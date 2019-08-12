import React, { useReducer, useState } from 'react';
import { message, Radio } from 'antd';
import { API } from '@/api';
import { InitState, InitInstalledFormState, InitInstallFormState } from './state';
import { submitReducer } from './submitReducer';
import { Modal } from 'antd';
import InstalledServerForm from './installedForm';
import InstallServerForm from './installForm';

function AddHost(props) {

    const bodyStyle = {
        maxHeight: `${document.body.clientHeight * 0.6}px`,
        overflow: 'auto'
    };
    const { server:XHR } = API;
    const [state, dispatch] = useReducer(submitReducer, InitState);
    const { loading } = state;

    const [installedFormState, setInstalledFormState] = useState(InitInstalledFormState); // 添加已安装服务表单
    const [installFormState, setInstallFormState] = useState(InitInstallFormState); // 安装服务表单
    const [serverModel, setServerModel] = useState('1'); // 当前选中添加的服务类型

    let formRef;

    function submit() {
       if (serverModel === '1') {
            submitInstalledForm();
       } else {
            submitInstallForm();
       }
    }
    /**
     * 已安装服务表单提交
     */
    function submitInstalledForm() {
        formRef.props.form.validateFields((errors, values) => {
            if (!errors) {
                let params = { ...values };
                params.mode = 1;

                // 根据后台所需参数格式重新组装
                if (installedFormState.dbtype === '0') {
                    // oracle类型
                    params.schemas = params.schemas ? params.schemas.reduce(function (a,b,index) {
                        const { hostname, port, SID } = b;
                        return a + `${index > 0 ? ',' : ''}${hostname}:${port}:${SID}`;
                    }, '') : '';
                } else if(installedFormState.dbtype === '1') {
                    params.schemas = params.schemas ? params.schemas.reduce(function (a,b,index) {
                        // Mysql类型
                        const { hostname, port } = b;
                        return a + `${index > 0 ? ',' : ''}${hostname}:${port}`;
                    }, '') : '';
                };

                dispatch({type: 'submit'});
                params.dbtype = Number(params.dbtype);
                XHR.create(params).then((res) => {
                    message.success('新增成功！');
                    props.changeModal({ isFetch: true });
                }).finally(() => {
                    dispatch({type: 'success'});
                });
            };
        });
    }
    /**
     * 安装服务表单提交
     */
    function submitInstallForm() {
        formRef.props.form.validateFields((errors, values) => {
            if (!errors) {
                let params = { ...values };
                params.mode = 0;
                // 根据后台所需参数格式重新组装
                if (params.dbtype === '0') {
                    // oracle类型

                    // 主
                    const keys = Object.keys(params.hostList[0]);
                    params.master_info = keys.reduce(function (a,b,index) {
                        return a + `${index > 0 ? ':' : ''}${ params.hostList[0][b]}`;
                    }, '');
                    if (params.hostList[1]) {
                        // 从
                        const keys = Object.keys(params.hostList[1]);
                        params.slave_info = keys.reduce(function (a,b,index) {
                            return a + `${index > 0 ? ':' : ''}${ params.hostList[1][b]}`;
                        }, '');
                    }
                } else if (params.dbtype === '1') {
                    // mysql 

                    // 主
                    const keys = Object.keys(params.hostList[0]);
                    params.master_info = keys.reduce(function (a,b,index) {
                        return a + `${index > 0 ? ':' : ''}${ params.hostList[0][b]}`;
                    }, '');
                    if (params.hostList[1]) {
                        // 从
                        const keys = Object.keys(params.hostList[1]);
                        params.slave_info = keys.reduce(function (a,b,index) {
                            return a + `${index > 0 ? ':' : ''}${ params.hostList[1][b]}`;
                        }, '');
                    }
                };

                dispatch({type: 'submit'});
                params.dbtype = Number(params.dbtype);
                console.log(params)
                XHR.create(params).then((res) => {
                    message.success('新增成功！');
                    props.changeModal({ isFetch: true });
                }).finally(() => {
                    dispatch({type: 'success'});
                });
            };
        });
    }

    function handleCancel() {
        dispatch({type: 'reset'});
        props.changeModal({});
    }

    /**
     * model改变时初始化form表单
     */
    function changeServerModel(model) {
        setServerModel(model);
        formRef.props.form.resetFields();
        if (model === '0') {
            setInstallFormState(InitInstallFormState);
        } else if (model === '1') {
            setInstalledFormState(InitInstalledFormState)
        }
    }
    /**
     * 修改InstalledForm数据
     * @param { object } data 要修改的数据
     */
    function changeInstalledForm(data) {
        setInstalledFormState({...installedFormState, ...data })
    }
    /**
     * 修改InstallForm数据
     * @param { object } obj 要修改的数据
     */
    function changeInstallForm(data) {
        setInstallFormState({...installFormState, ...data })
    }

    return (
        <Modal
        title={(
            <Radio.Group value={serverModel} buttonStyle="solid" onChange={(e) => changeServerModel(e.target.value)}>
                <Radio.Button value="0">安装服务</Radio.Button>
                <Radio.Button value="1">已安装服务</Radio.Button>
            </Radio.Group>
        )}
        cancelText="取消"
        okText="确定"
        width={600}
        maskClosable={false}
        visible={props.visible}
        onOk={submit}
        confirmLoading={loading}
        onCancel={handleCancel}
        afterClose={() => formRef.props.form.resetFields()}
        bodyStyle={bodyStyle}
      >
        {serverModel === '1' && (
            <InstalledServerForm 
                wrappedComponentRef={(form) => formRef = form} 
                formData={installedFormState} 
                changeForm={(val) => changeInstalledForm(val)} />
        )}
        {serverModel === '0' && (
            <InstallServerForm 
                wrappedComponentRef={(form) => formRef = form} 
                formData={installFormState} 
                changeForm={(val) => changeInstallForm(val)} />
        )}
      </Modal>
    )
}

export default React.memo(AddHost);
