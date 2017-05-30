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

    Promise.all([getData('profiles/3/preCompetencies'), getData('profileList'), getData(`profiles/3/preCompetencies`), getData(`profiles/3/competencies`)])
    .then(([baseline, profileList, previousCompetencies, currentCompetencies]) =>
      this.setState({
        baseline,
        profileList,
        previousCompetencies,
        currentCompetencies,
        selectedProfile: _.first(profileList)
      }, () => this.flattenData())
    )
  }

  flattenData = () => {
    const x = _.concat(this.state.previousCompetencies.required, this.state.previousCompetencies.custom)
    const y = _.concat(this.state.currentCompetencies.required, this.state.currentCompetencies.custom)

    this.setState({
      previousCompetencies: x,
      currentCompetencies: y
    })
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

  getGroupDataToState = (selectedProject) =>  {
    console.log('pj name is ' + selectedProject)
    this.setState({
      loading: true
    })
    getData(`BU_projects/${selectedProject}`)
    .then(({members, manager}) => this.setState({
      selectedProject: selectedProject,
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
                <Card title={this.state.selectedProject} style={{ width: '34%' }}>
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
                   id={3}
                   previousCompetencies={this.state.previousCompetencies}
                   currentCompetencies={this.state.currentCompetencies}
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
