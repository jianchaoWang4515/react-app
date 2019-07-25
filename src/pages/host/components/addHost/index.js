import React, { useReducer } from 'react';
import { message } from 'antd';
import { API } from '@/api';
import { InitState } from './state';
import { submitReducer } from './submitReducer';
import { Modal } from 'antd';
import AddHostForm from './addForm';

function AddHost(props) {
    const { host:XHR } = API;
    const [state, dispatch] = useReducer(submitReducer, InitState);
    const { loading } = state;
    let formRef;

    function submit() {
        formRef.props.form.validateFields((errors, values) => {
            if (!errors) {
                dispatch({type: 'login'});
                const xhrType = props.isAdd ? XHR.create({...values}) : XHR.edit(props.hostId, {...values});
                xhrType.then((res) => {
                    let msg = props.isAdd ? '新增成功！' : '修改成功！';
                    message.success(msg);
                    props.changeModal({ isFetch: true });
                }).finally(() => {
                    dispatch({type: 'success'});
                });
            };
        });
    }

    function handleCancel() {
        props.changeModal({});
    }

    return (
        <Modal
        title="新增主机"
        cancelText="取消"
        okText="确定"
        maskClosable={false}
        visible={props.visible}
        onOk={submit}
        confirmLoading={loading}
        onCancel={handleCancel}
        afterClose={() => formRef.props.form.resetFields()}
      >
        <AddHostForm wrappedComponentRef={(form) => formRef = form} formData={props.formData}/>
      </Modal>
    )
}

export default AddHost;
