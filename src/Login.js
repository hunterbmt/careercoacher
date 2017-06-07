import React, { Component } from 'react'
import { Layout, Row, Col, Card, message } from 'antd'
import { getData } from './firebase'
import _ from 'lodash'
import logo from './logo.png'
import LoginForm from './LoginForm'
import background from './background.JPG'
const { Header } = Layout

class Login extends Component {


    componentDidMount() {
        getData(`users`).then((userData) => this.setState({
            users: userData
        }))
    }

    loginFormRef = (form) => {
        this.form = form
    }

    handleCheckUSerName = (rule, value, callback) => {
        console.log(this.state.users)
        if (value && _.some(this.state.users, ['username', value])) {
            callback()
        }
        callback('User name has not existed in system')
    }

    getLoginInfor = (name, password) => {
        if(_.some(this.state.users, { 'username': name, 'password': password }))
        {
            let id = _.find(this.state.users,{'username': name, 'password': password}).id
            console.log(id)
            message.success("login successfully", 3)
            window.location.replace(`/#personal/${id}`)
        }else{
             message.error("login fail ! Please check your user name or password")
        }
    }

    handleSubmit = () => {
        const form = this.form
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.getLoginInfor(values.userName, values.password)
            form.resetFields()
            this.setState({ visible: false })
        })
    }

    render() {
        return (
            <Layout style={{ height: '100%', background: '#fff' ,backgroundImage: "url(" + background + ")"}}>
                <Row>
                    <Card style={{ margin: 300, marginLeft: 700, width: 500, height: '100%', backgroundColor: '#e9e9e9' }}>
                        <Col span={12} offset={6}><img alt='logo' src={logo} style={{ height: 64, padding: 10 }} /></Col>
                        <Col span={12} offset={6} style={{ marginTop: 50 }}>
                        <LoginForm
                            ref={this.loginFormRef}
                            handleSubmit={this.handleSubmit}
                            handleCheckUSerName={this.handleCheckUSerName} />
                        </Col>
                    </Card>
                </Row>
            </Layout>

        )
    }
}

export default Login
