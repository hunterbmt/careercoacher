import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Row, Col } from 'antd'
import Loading from './Loading'
import { getData } from './firebase'
import ProfilePersonalPage from './ProfilePersonalPage'
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
      return _.some(project.members, (value) => _.isEqual(value, _.toNumber(id)))
    })
    this.setState({
      managerInformation: manager
    })

  }

  getPersonalInformation = () => {
    getData(`profiles/${this.props.id}`).then((personalInformation) => this.setState({
      personalName: personalInformation.name,
      personalTitle: personalInformation.title,
    }))
  }


  componentWillMount() {
    getData(`BU_projects`).then((data) => this.findManagerInformation(data, this.props.id))
    this.getPersonalInformation()
    Promise.all([getData(`profiles/${this.props.id}/preCompetencies`), getData(`profiles/${this.props.id}/competencies`)])
      .then(([previousCompetenciesData, currentCompetenciesData]) => this.setState({
        previousCompetencies: _.concat(previousCompetenciesData.required, previousCompetenciesData.custom),
        currentCompetencies: _.concat(currentCompetenciesData.required, currentCompetenciesData.custom),
        loading: false
      }))
  }

  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>
    return (
      <div>
        <Layout>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Content style={{ margin: '0 40px' }}>
              <Row type="flex" justify="center">
                {<Col span={4}>  <Avatar size="100" round="true" src="http://careers.kms-technology.com/wp-content/uploads/2015/09/kms-next-avatar.png" /></Col>}
                <Col span={4} style={{ marginTop: 40 }}><h3>Name : {this.state.personalName}</h3></Col>
                <Col span={4} style={{ marginTop: 40 }}><h3>Title: {this.state.personalTitle}</h3></Col>
                <Col span={4} style={{ marginTop: 40 }}><h3>Manager : {this.state.managerInformation.manager}</h3></Col>
                <Col span={4} style={{ marginTop: 40 }}> <h3>Project name :  {this.state.managerInformation.name}</h3></Col>
              </Row>
              <Row>
                {
                  (_.isEmpty(this.state.previousCompetencies) && _.isEmpty(this.state.currentCompetencies)) ? 'you have not completed any self - assessment' : <ProfilePersonalPage
                    id={this.props.id}
                    previousCompetencies={this.state.previousCompetencies}
                    currentCompetencies={this.state.currentCompetencies}
                  />
                }
              </Row>

            </Content>
          </Row>
        </Layout>
      </div>
    )
  }
}