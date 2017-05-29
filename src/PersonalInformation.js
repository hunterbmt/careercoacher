import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Row, Col, Card, Tag } from 'antd'
import logo from './logo.png'
import Loading from './Loading'
import { getData, update } from './firebase'
import ProfilePage from './ProfilePage'
import Avatar from 'react-avatar'

const { Content } = Layout

export default class PersionalInformation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      managerInformation: []
    }
  }

  findManagerAndTeam = (members, id) => {
    let result = false
    _.forEach(members, (value) => {
      if (_.isEqual(_.toNumber(id), value)) {
        result = true
      }
    })
    return result
  }

  findManagerInformation = (allProjects, id) => {
    let manager = _.find(allProjects, (project) => {
      return this.findManagerAndTeam(project.members, id)
    })

    this.setState({
      managerInformation: manager
    })

  }

  getPersonalInformation = () => {
    getData(`profiles/${this.props.id}`).then((personalInformation) => this.setState({
      personalName: personalInformation.name,
      personalTitle : personalInformation.title,
    }))
  }

  componentWillMount() {
    getData(`BU_projects`).then((data) => this.findManagerInformation(data, this.props.id))
    this.getPersonalInformation();
    getData(`profiles/${this.props.id}/preCompetencies`).then((preCompetencies) => this.setState({
      previousCompetencies : preCompetencies
    }))
    getData(`profiles/${this.props.id}/competencies`).then((competencies) => this.setState({
      presentCompetencies : competencies
    }))
  }

  render() {
    return (
      <div>
        <Layout>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Content style={{ margin: '0 40px' }}>
              <Col span={8}>
                <Card title={'Personal Information'} style={{ width: '60%' }}>
                 <Avatar size="200" round="true" src="http://careers.kms-technology.com/wp-content/uploads/2015/09/kms-next-avatar.png" />
                  <h3>Name : {this.state.personalName}</h3>
                  <p>Title: {this.state.personalTitle}</p>
                  <p>Manager : {this.state.managerInformation.manager}</p>
                  <p>Project name :  {this.state.managerInformation.name}</p>
                </Card>
              </Col>
              <Col span={16}>
                <Card>
                  <ProfilePage
                   id={this.props.id}
                   previousCompetencies={this.state.previousCompetencies}
                   presentCompetencies={this.state.presentCompetencies}
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