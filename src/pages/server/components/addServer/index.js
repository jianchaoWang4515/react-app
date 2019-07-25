import React, { useReducer } from 'react';
import { message } from 'antd';
import { API } from '@/api';
import { InitState } from './state';
import { submitReducer } from './submitReducer';
import { Modal } from 'antd';
import AddServerForm from './addForm';

function AddHost(props) {

    const bodyStyle = {
        maxHeight: `${document.body.clientHeight * 0.6}px`,
        overflow: 'auto'
    };
    const { server:XHR } = API;
    const [state, dispatch] = useReducer(submitReducer, InitState);
    const { loading } = state;
    let formRef;

    function submit() {
        formRef.props.form.validateFields((errors, values) => {
            if (!errors) {
                let params = { ...values };
                params.mode = 1;
                if (props.formData.dbtype === '0') {
                    params.schemas = params.schemas ? params.schemas.reduce(function (a,b,index) {
                        const { hostname, port, SID } = b;
                        return a + `${index > 0 ? ',' : ''}${hostname}:${port}:${SID}`;
                    }, '') : '';
                } else if(props.formData.dbtype === '1') {
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

    function handleCancel() {
        dispatch({type: 'reset'});
        props.changeModal({});
    }
    return (
        <Modal
        title="新增主机"
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
        <AddServerForm wrappedComponentRef={(form) => formRef = form} formData={props.formData} changeDbtype={props.changeDbtype} />
      </Modal>
    )
}

export default React.memo(AddHost);
