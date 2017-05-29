import React, {Component} from 'react'
import _ from 'lodash'
import { Layout, Row, Col, Card, Tag} from 'antd'
import logo from './logo.png'
import Loading from './Loading'
import {getData, update} from './firebase'
import ProfilePage from './ProfilePage'

const { Content } = Layout

export default class GroupManagement extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading : true
    }
  }

  componentDidMount() {
    this.getGroupDataToState(this.props.project)

    Promise.all([getData('baseline'), getData('profileList')]).then(([baseline, profileList]) =>
      this.setState({
        baseline,
        profileList,
        selectedProfile: _.first(profileList)
      })
    )
  }

  componentWillReceiveProps(props) {
    if(props.project !== this.props.project) {
      this.getGroupDataToState(props.project)
    }
  }

  onSelectProfile = (e) => {
    this.setState({
      selectedProfile: e
    })
  }

  getGroupDataToState = (projectName) =>  {
    console.log('pj name is ' + projectName)
    this.setState({
      loading: true
    })
    getData(`BU_projects/0`)
    .then(({members, manager}) => this.setState({
      projectName: projectName,
      members: members,
      manager: manager,
      loading: false
    }))
  }

  render() {
    if (this.state.loading) return <div style={{height: 600}}><Loading /> </div>
    return (
      <div>
        <Layout>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Content style={{ margin: '0 16px' }}>
              <Col span={6}>
                <Card title={this.state.projectName} style={{ width: '34%' }}>
                  <h3>Manager : <Tag color='#108ee9'>{this.state.manager}</Tag></h3>
                  <h3>Members :</h3>
                  {_.map(this.state.members, (member, index) =>
                    <div>
                      <Tag onClick={() => this.onSelectProfile(member)} key={member}>{member}</Tag>
                    </div>
                  )}
                </Card>
              </Col>
              <Col span={18}>
                <Card>
                  <ProfilePage
                    baseline={this.state.baseline}
                    profile={this.state.selectedProfile}
                  />
                </Card>
              </Col>
            </Content>
          </Row>
        </Layout>
      </div>
    )
  }
}
