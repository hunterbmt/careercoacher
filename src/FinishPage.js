import React from 'react';
import { Layout, Row, Col, Input } from 'antd';
import logo from './logo.png';
const { Header, Content } = Layout;

const FinishPage = () =>
<Layout style={{height: '100%'}}>
  <Header style={{ background: '#fff', padding: 0 }}>
    <Row type='flex' justify='space-between' style={{height: '100%'}}>
      <Col span={4}>
        <img alt='logo' src={logo} style={{height: 64, padding: 10}}/>
      </Col>
    </Row>
  </Header>
  <Layout>
    <Content style={{ margin: 16, background: '#fff', padding: '0 20px'}}>
      <Row type='flex' justify='center' style={{paddingTop: '10%', flexDirection: 'column', alignItems: 'center'}}>
        <h2>Thanks for your time and support</h2>
        <h2>The result has already been submited to our system</h2>
        <h2 style={{paddingTop: 15}}>If you have any feedback regarding the assessment or system, please let us know</h2>
        <Row type='flex' justify='center' style={{fontSize: 14}}>
          <a href='skype:duongvoth?chat'>Skype:  duongvoth</a>
          <a href='mailto:duongtvo@kms-technology.com?Subject=Compentency%20feedback' style={{marginLeft: 20}}>Email: 	duongtvo@kms-technology.com</a>
        </Row>
      </Row>
    </Content>
  </Layout>
</Layout>

export default FinishPage;
