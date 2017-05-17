import React, { Component } from 'react';
import { Layout, Modal, Switch, Icon, Button, Input, Row, Col, Select, Table } from 'antd';
import { getData, insert, database } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import { Router, Link } from 'react-router-component';
const { Header, Content } = Layout;
import logo from './logo.png';



class Competencies extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      option: 'Kms_core',
      competencyName: '',
      competenciesKMSCore: [],
      competenciesKmsOptional: [],
      dataSourceKMSCore: [],
      dataSourceKMSOptional: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOption = this.handleChangeOption.bind(this);
  }


  handleChangeOption(value) {
    this.setState({
      option: `${value}`
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  addNewCompetency(competencyName, option) {
    const optionalCompetency = database.ref(`competencies1`).child(`${option}`);

    optionalCompetency.push().set({
      "activated": false,
      "name": competencyName
    });

  }

  handleChange(e) {
    this.setState({ competencyName: e.target.value });
  }

  handleSave = (e) => {
    this.setState({
      visible: false
    });

    this.addNewCompetency(this.state.competencyName, this.state.option);
  }

  handleCancel = (e) => {

    this.setState({
      visible: false,
    });
  }

  columnsKMSCore = [{
    title: 'KMS Core',
    dataIndex: 'kmscore',
    key: 'kmscore',
  }, {
    title: 'Activated',
    dataIndex: 'activatedKmscore',
    key: 'activatedKmscore',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={() => this.onSelectCompetency()}>Edit</a>
      </span>
    ),
  }];

  columnsKMSOptional = [{
    title: 'KMS Optional',
    dataIndex: 'kmsoptional',
    key: 'kmsoptional',
  }, {
    title: 'Activated',
    dataIndex: 'activatedKmsOptional',
    key: 'activatedKmsOptional',
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={() => this.onSelectCompetency()}>Edit</a>
      </span>
    ),
  }];

  getCompetencyKMSCore() {
    getData(`competencies1/Kms_core`)
      .then((kmsCoreData) => this.setState({
        competenciesKMSCore: kmsCoreData
      }));
  }

  getCompetencyOptional() {
    getData(`competencies1/Kms_optional`)
      .then((kmsOptionalData) => this.setState({
        competenciesKmsOptional: kmsOptionalData
      }));
  }

  componentDidMount() {
    this.getCompetencyKMSCore();
    this.getCompetencyOptional();
  
  }

  getDataSoureKMSCore(){
    _.map(this.state.competenciesKMSCore,(item,index)=> {
      const object = {
        kmscore : item.name,
        activatedKmscore : String(item.activated),
      }
      
       this.state.dataSourceKMSCore.push(object);
    })
  }

  getDataSourceKMSOptional(){
     _.map(this.state.competenciesKmsOptional,(item,index)=> {
      const object = {
        kmsoptional : item.name,
        activatedKmsOptional : String(item.activated),
      }
      
       this.state.dataSourceKMSOptional.push(object);
    })
  }




  render() {
    this.getDataSoureKMSCore()
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Row type='flex' justify='space-between' style={{ height: '100%' }}>
            <Col span={4}>
              <img alt='logo' src={logo} style={{ height: 64, padding: 10 }} />
            </Col>
            <Col>
              <Button type="primary" onClick={this.showModal}>Add new compentency</Button>
              <Modal title="Create new compentency" visible={this.state.visible}
                onOk={this.handleSave} onCancel={this.handleCancel}>
                <Input type='text' value={this.state.competencyName} onChange={this.handleChange} />
                <h3>Please choose option: </h3>
                <Select defaultValue={this.state.option} style={{ width: 120 }} onChange={this.handleChangeOption}>
                  <Option value="Kms_core">KMS Core</Option>
                  <Option value="Kms_optional">KMS Optional</Option>
                </Select>
              </Modal>
            </Col>
          </Row>
          <Row style={{ margin: 100 }}>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Table columns={this.columnsKMSCore} dataSource={this.state.dataSourceKMSCore} />
            </Col>
            <Col xs={20} sm={16} md={12} lg={8} xl={4}></Col>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Table columns={this.columnsKMSOptional} dataSource={this.state.dataSource} />
            </Col>
          </Row>
        </Header>
      </Layout>
    );
  }
}


export default Competencies;
