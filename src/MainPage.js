import React, {Component} from 'react'
import _ from 'lodash'
import { Layout, Menu, Icon, Row, Col, Button, Modal, Input } from 'antd'
import Loading from './Loading'
import AddNewProfilePopup from './AddNewProfilePopup'
import './App.css'
import logo from './logo.png'
import {getData} from './firebase'
import GroupManagement from './GroupManagement'
import {Link} from 'react-router-component'

const { Header, Content, Sider } = Layout
const SubMenu = Menu.SubMenu

class MainPage extends Component {
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
        baseline: _.map(baseline, (base) =>({name: base.name, competencies: _.flatten([base.Kms_core.competencies, base.Kms_optional.competencies])})),
        profileList,
        test:baseline,
        selectedProfile: _.first(profileList),
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
      <Layout style={{height: '100%'}}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{height: '100%'}}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{height: 64, padding: 10}}/>
            </Col>
            <Col style={{paddingRight: 20}}>
              <AddNewProfilePopup />
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
              <SubMenu
                key='sub1'
                title={<span><Icon type='database' /><span className='nav-text'>BU - Projects</span></span>}
              >
                {
                  _.map(Object.keys(this.state.projectList), (project) => <Menu.Item key={project}>{project}</Menu.Item>)
                }
              </SubMenu>
              <Menu.Item key='Report'>
                <span>
                  <Icon type='area-chart' />
                  <span className='nav-text'>Report</span>
                </span>
              </Menu.Item>
              <Menu.Item>
                <Link href='/roleProfile'>
                <Icon type='user' />
                <span>Baselines</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <GroupManagement
                project={this.state.selectedProject}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default MainPage
