import React, { Component } from 'react'
import _ from 'lodash'
import { Layout, Row, Col, Card, Tag, Select } from 'antd'
import logo from './logo.png'
import Loading from './Loading'
import { getData, update, getLastIndex } from './firebase'
import ApproveCustomCompetency from './ApproveCustomCompetency'
const { Header } = Layout
const Option = Select.Option;


export default class GroupManagementForManager extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentWillMount() {
    getData(`BU_projects/${this.props.id}`).then((data) => this.setState({ groupInformation: data, loading: false }))
  }

  onSelectProfile = (member) => {
    Promise.all([getData(`profiles/${member}/pendding`),getData(`profiles/${member}/customCompetencies`)]).then(([penddingCompetency,customCompetencies]) => this.setState({
      pedding: _.difference(penddingCompetency,customCompetencies),
      id : member,
      modeApprove : "on",
    }))
  }

  getChildren = () => {
    const children = []
     _.forEach(this.state.pedding, (item, index) => {
      children.push(<Option key={item}>{item}</Option>)
    })
    return children
  }

   approveForm = (form) => {
    this.form = form;
  }

  handleSubmit = () => {
      const form = this.form
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.saveCustom(values.competencyName)
            form.resetFields()
            this.setState({ visible: false })
        })
  }

  saveCustom = (competencyNames) =>{
    getLastIndex(`profiles/${this.state.id}/customCompetencies`).then((lastId)=> this.saveCustomCompetency(lastId, competencyNames))
  }

  saveCustomCompetency(lastId, competencyNames){
    let id = parseInt(lastId, 10)
    _.forEach(competencyNames, item => {
      id ++
      update(`profiles/${this.state.id}/customCompetencies/${id}`,item)
    })  
  }  

  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
          </Row>

          <Row style={{ margin: 100 }}>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Card title="Group Information" bordered={false} style={{ width: 600 }}>
                <h3>Project name : {this.state.groupInformation.name}</h3>
                <h3>Manager: {this.state.groupInformation.manager}</h3>
                <h3>Members: </h3>
                {_.map(this.state.groupInformation.members, (member, index) =>
                  <div>
                    <Tag onClick={() => this.onSelectProfile(member)} key={member}>{member}</Tag>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={20} sm={16} md={12} lg={8} xl={4}></Col>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
            {
              _.isUndefined(this.state.modeApprove) ? 
               null
              :
              <Card title="Approve competency " bordered={false} style={{ width: 600 }} >
                <ApproveCustomCompetency
                  ref={this.approveForm}
                  children={this.getChildren()}
                  handleSubmit={this.handleSubmit}
                />
              </Card> 
            } 
            </Col>
          </Row>
        </Header>
      </Layout>
    )
  }
}