import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { useAddBreadcrumb } from '@/hook';

function Home(props) {
  useAddBreadcrumb(props)
  return (
      <div>
        <Button type="primary">Button</Button>
        <h1>我是首页</h1>
      </div>
  )
}

export default withRouter(Home);
