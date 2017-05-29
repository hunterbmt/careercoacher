
import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Menu, Icon, Row, Col } from 'antd'
import Loading from './Loading'
import './App.css'
import logo from './logo.png'
import { getData } from './firebase'
import PersonalInformation from './PersonalInformation'
import { Link } from 'react-router-component'

const { Header, Content, Sider } = Layout


class PersonalProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true
    }
  }

  componentDidMount() {
    Promise.all([getData('baseline'), getData('BU_projects')]).then(([baseline, projectList]) =>
      this.setState({
        baseline,
        projectList,
        selectedProject: _.first(Object.keys(projectList)),
        loading: false
      })
    )
  }

  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    })
  }

  onSelectProject = (e) => {
    this.setState({
      selectedProject: e.key,
    })
  }

  render() {
    if (this.state.loading) return <Loading />
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
            <Col style={{ paddingRight: 20 }}>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu theme='dark'
              mode={this.state.mode}
              onClick={this.onSelectProject}
              selectedKeys={[this.state.selectedProject]}
            >
              <Menu.Item>
                <Link href='/roleProfile'>
                  <Icon type='user' />
                  <span>Personal Profile</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
            <PersonalInformation id={this.props.id}/>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default PersonalProfile
