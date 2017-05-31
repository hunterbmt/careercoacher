import React, { Component } from 'react';
import { Layout, Button, Row, Col, Form, Icon, Input, Checkbox, Card } from 'antd';
import { getData, update, getLastIndex } from './firebase';
import _ from 'lodash';
import logo from './logo.png';
import LoginForm from './LoginForm'
const { Header } = Layout;

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Row type='flex' justify='space-between' style={{ height: '100%' }}>
                        <Col span={4}>
                            <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
                        </Col>
                        <Col></Col>
                    </Row>
                </Header>
                <Row>
                    <Card style={{ margin: 200, marginLeft: 700, width: 500, height: 300 }}>
                        <Col span={12} offset={6}><h3 style={{ color: '#108ee9' }}>KMS Competency Framework</h3></Col>
                        <Col span={12} offset={6} style={{marginTop : 50 }}><LoginForm /></Col>
                    </Card>
                </Row>
            </Layout>

        );
    }
}

export default Login;
