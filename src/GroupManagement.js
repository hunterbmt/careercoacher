import React, {Component} from 'react'
import _ from 'lodash'
import { Layout, Row, Col, Card, Tag, Table} from 'antd'
import logo from './logo.png'
import Loading from './Loading'
import {getData, update} from './firebase'
import ProfilePage from './ProfilePage'

const { Content } = Layout

export default class GroupManagement extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading : true,
      selectedProfile : 3,
      columns : this.prepareColumns()
    }
  }

  prepareColumns = () => {
        return [{
                title: 'No',
                dataIndex: 'no',
                key: 'no',
            }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: 'Alias Name',
                dataIndex: 'aliasName',
                key: 'aliasName',
            }, {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            }, {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={() => this.onSelectProfile(record.no)} key={record.no}>View</a>  
                    </span>
                ),
            }]
    }

  componentDidMount() {
    this.getGroupDataToState(this.props.project)

    Promise.all([getData(`profiles/${this.state.selectedProfile}/preCompetencies`), getData('profileList'), getData(`profiles/${this.state.selectedProfile}/preCompetencies`), getData(`profiles/${this.state.selectedProfile}/competencies`), getData(`profiles`)])
    .then(([baseline, profileList, previousCompetencies, currentCompetencies, profiles]) =>
      this.setState({
        loading: true,
        baseline,
        profileList,
        previousCompetencies,
        currentCompetencies,
        profiles,
        selectedProfile: 3
      }, () => this.flattenData())
    )
  }

  flattenData = () => {
    const x = _.concat(this.state.previousCompetencies.required, this.state.previousCompetencies.custom)
    const y = _.concat(this.state.currentCompetencies.required, this.state.currentCompetencies.custom)

    this.setState({
      previousCompetencies: x,
      currentCompetencies: y,
      loading : false
    })
  }

  getMembersNames = (id) => this.state.profileList[id]

  componentWillReceiveProps(props) {
    if(props.project !== this.props.project) {
      this.getGroupDataToState(props.project)
    }
  }

  onSelectProfile = (e) => {
    this.setState({
      selectedProfile: e
    })
    Promise.all([getData(`profiles/${this.state.selectedProfile}/preCompetencies`), getData('profileList'), getData(`profiles/${this.state.selectedProfile}/preCompetencies`), getData(`profiles/${this.state.selectedProfile}/competencies`), getData(`profiles`)])
    .then(([baseline, profileList, previousCompetencies, currentCompetencies, profiles]) =>
      this.setState({
        loading: true,
        baseline,
        profileList,
        previousCompetencies,
        currentCompetencies,
        profiles
      }, () => this.flattenData())
    )
  }

  getGroupDataToState = (selectedProject) =>  {
    this.setState({
      loading: true
    })
    getData(`BU_projects/${selectedProject}`)
    .then(({name, members, manager}) => this.setState({
      selectedProject: name,
      members: members,
      manager: manager,
      loading: false
    }))
  }

  render() {
    if (this.state.loading) return <div style={{height: 600}}><Loading /> </div>
  
    let dataSource = []
        _.forEach(_.filter(this.state.profiles, (profile) =>  {    
            let row = {
                key : _.findKey(this.state.profiles, ['aliasName', profile.aliasName]),
                no: _.findKey(this.state.profiles, ['aliasName', profile.aliasName]),
                name: profile.name,
                title: profile.title,
                aliasName: profile.aliasName
            }
            dataSource.push(row)
        }))
        console.log(this.state.members)
    return (
      <div>
        <Layout>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Content style={{ margin: '0 16px' }}>
              <Col span={6}>
                <Card title={this.state.selectedProject} style={{ width: '100%' }}>
                  <h3>Manager : <Tag color='#108ee9'>{this.state.manager}</Tag></h3>
                  <h3>Members :</h3>
                  <Table dataSource={dataSource} columns={this.state.columns} />
                  
                </Card>
              </Col>
              <Col span={18}>
                <Card>
                  <ProfilePage
                   id={this.state.selectedProfile}
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
