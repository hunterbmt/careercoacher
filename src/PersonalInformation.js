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

  findManagerInformation = (allProjects, id) => {
    const manager = _.find(allProjects, (project) => {
      return _.some(project.members,(value) => _.isEqual(value,_.toNumber(id)))
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
    this.getPersonalInformation()
    Promise.all([getData(`profiles/${this.props.id}/preCompetencies`),getData(`profiles/${this.props.id}/competencies`)])
    .then(([previousCompetenciesData,currentCompetenciesData]) => this.setState({
      previousCompetencies : _.concat(previousCompetenciesData.required,previousCompetenciesData.custom),
      currentCompetencies : _.concat(currentCompetenciesData.required,currentCompetenciesData.custom),
      loading : false
    }))
  }

  render() {
   if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>
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