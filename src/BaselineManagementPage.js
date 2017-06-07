import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Icon, Row, Col, Card, Tabs, Popconfirm } from 'antd'
import Loading from './Loading'
import CoreBaseline from './CoreBaseline'
import OptionalBaseline from './OptionalBaseline'
import ProjectBaseline from './ProjectBaseline'
import './App.css'
import logo from './logo.png'
import { getData} from './firebase'
const { Header, Content } = Layout
const TabPane = Tabs.TabPane

class BaselineManagementPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline',
      loading: true,

      filterDropdownVisible: false,
     
      selectedBaseline : 0,
    
      coreBaselineListColumns : this.prepareColumns()
    }
  }

  prepareColumns = () => {
    return [{
        title: 'No',
        dataIndex: 'no',
        key: 'no',
      }, {
        title: 'Competency',
        dataIndex: 'competency',
        key: 'competency',
      }, {
        title: 'Proficiency',
        dataIndex: 'proficiency',
        key: 'proficiency',
      }, { 
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.onSelectBaseline(record.no)} key={record.name}>Edit 一 {record.name}</a>
            <span className="ant-divider" />
            <Popconfirm title="Are you sure delete this item?" onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText="Yes" cancelText="No">
            <a>Delete</a>
            </Popconfirm>
            <span className="ant-divider" />
            <a className="ant-dropdown-link">
              More actions <Icon type="down" />
            </a>
          </span>
        ),
      }]
  }
  
  componentDidMount() {
    Promise.all([getData('baseline')]).then(([baselineList]) =>
      this.setState({
        baselineList,
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

  onSelectBaseline = (e) => {
    this.setState({
      baselineList : [],
      selectedBaseline : e,
      loading : false
    })
  }

  callback = (key) => {
      this.setState({
          selectedBaseline : key
      }, () => console.log("Selected " + this.state.selectedBaseline))
  }

  render() {
    if (this.state.loading) return <Loading />

    let baselineTabName = []
    _.forEach(this.state.baselineList, (item, index) => {
      baselineTabName.push(
      <TabPane tab={item.name} key={index}>
          <Col span={12}>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <Card title='KMS Core Baselines' style={{ width: '100%' }}>
                <CoreBaseline selectedBaseline={this.state.selectedBaseline}/>
              </Card>
            </Content>
          </Layout>
          </Col>
          <Col span={12}>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <Card title='KMS Optional Baselines' style={{ width: '100%' }}>
                <OptionalBaseline selectedBaseline={this.state.selectedBaseline}/>
              </Card>
            </Content>
          </Layout>
          </Col> 
      </TabPane>
      )
    })

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
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>

          <Col span={16}>
          <Card title='KMS Baselines:' style={{ width: '100%' }}>
            <Tabs defaultActiveKey="0" onChange={this.callback}>
                {baselineTabName}
            </Tabs>
          </Card>
          </Col>

          <Col span={8}>
          <Card title='Project Baselines:' style={{ width: '100%' }}>
            <ProjectBaseline />
          </Card>
          </Col>

        </Row>
        </Layout>
      </Layout>
    )
  }
}
export default BaselineManagementPage
