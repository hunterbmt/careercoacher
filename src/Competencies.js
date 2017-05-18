import React, { Component } from 'react';
import { Layout, Modal, Switch, Icon, Button, Input, Row, Col, Select, Table } from 'antd';
import { getData, update, database } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import { Router, Link } from 'react-router-component';
const { Header, Content } = Layout;
import logo from './logo.png';

const Option = Select.Option;


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
      showEditPopup: false,
      optionActivated: false,
      keyUpdate: '',
      showEditPopupKmsOptional: false,
      optionActivatedKmsOptional: false

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOption = this.handleChangeOption.bind(this);
    this.handleChangeOptionActivated = this.handleChangeOptionActivated.bind(this);
    this.handleChangeOptionActivatedKmsOptional = this.handleChangeOptionActivatedKmsOptional.bind(this);
  }


  handleSaveActivatedKmsOptional = (e) =>{
     let dataUpdate = {
      "activated": this.state.optionActivatedKmsOptional,
      "name": this.state.competencyName
    }
    console.log(dataUpdate);
    update(`competencies1/Kms_optional/${this.state.keyUpdate}`, dataUpdate);
    this.setState({
      showEditPopupKmsOptional: false
    })
  } 

  handleCancelActivatedKmsOptional = (e) =>{
      this.setState({
      showEditPopupKmsOptional: false
    });
  }

  handleChangeOptionActivatedKmsOptional(){
      this.setState({
      optionActivatedKmsOptional: !this.state.optionActivatedKmsOptional
    })
  }

  handleChangeOptionActivated() {
    this.setState({
      optionActivated: !this.state.optionActivated
    })
  }


  handleChangeOption(value) {
    this.setState({
      option: `${value}`
    })
  }


  handleSaveActivated = (e) => {
    let dataUpdate = {
      "activated": this.state.optionActivated,
      "name": this.state.competencyName
    }
    update(`competencies1/Kms_core/${this.state.keyUpdate}`, dataUpdate);
    this.setState({
      showEditPopup: false
    })
  }

  handleCancelActivated = (e) => {

    this.setState({
      showEditPopup: false
    });
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
        <a onClick={() => this.onSelectCompetency(record.kmscore)}>Edit</a>
      </span>
    ),
  }];

  onSelectCompetency(name) {
    getData(`competencies1/Kms_core`)
      .then((dataKmsCore) => _.map(dataKmsCore, (competency, key) => {
        if (competency.name === name) {
          getData(`competencies1/Kms_core/${key}`).then((selectedCompetency) => this.setState({
            optionActivated: selectedCompetency.activated,
            keyUpdate: key,
            competencyName: selectedCompetency.name,
            showEditPopup: true
          }))
        }
      }))

  }

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
        <a onClick={() => this.onSelectKmsOptionalCompetency(record.kmsoptional)}>Edit</a>
      </span>
    ),
  }];

  onSelectKmsOptionalCompetency(name){
     getData(`competencies1/Kms_optional`)
      .then((dataKmsOptional) => _.map(dataKmsOptional, (competency, key) => {
        if (competency.name === name) {
          getData(`competencies1/Kms_optional/${key}`).then((selectedCompetency) => this.setState({
            optionActivatedKmsOptional: selectedCompetency.activated,
            keyUpdate: key,
            competencyName: selectedCompetency.name,
            showEditPopupKmsOptional: true
          }))
        }
      }))
  }

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

  componentWillMount() {
    this.getCompetencyKMSCore();
    this.getCompetencyOptional();


  }

  componentDidMount() {


  }

  getDataSoureKMSCore() {
    _.map(this.state.competenciesKMSCore, (item, index) => {
      let activate;
      if (item.activated === true) {
        activate = "On"
      } else {
        activate = "Off"
      }
      const object = {
        kmscore: item.name,
        activatedKmscore: activate,
      }
      this.state.dataSourceKMSCore.push(object);
    })
  }

  getDataSourceKMSOptional() {
    _.map(this.state.competenciesKmsOptional, (item, index) => {
       let activate;
      if (item.activated === true) {
        activate = "On"
      } else {
        activate = "Off"
      }
      const objectKmsOptional = {
        kmsoptional: item.name,
        activatedKmsOptional: activate,
      }
      this.state.dataSourceKMSOptional.push(objectKmsOptional);
    })
  }

  componentWillUpdate() {
    this.getDataSoureKMSCore();
    this.getDataSourceKMSOptional();



  }




  render() {

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
          <Modal title="Edit activate KMS Core compentency" visible={this.state.showEditPopup}
            onOk={this.handleSaveActivated} onCancel={this.handleCancelActivated}>
            <h3>Activate compentency: </h3>
            <Switch defaultChecked={this.state.optionActivated} onChange={this.handleChangeOptionActivated} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
          </Modal>
          <Modal title="Edit activate KMS Optional compentency" visible={this.state.showEditPopupKmsOptional}
            onOk={this.handleSaveActivatedKmsOptional} onCancel={this.handleCancelActivatedKmsOptional}>
            <h3>Activate compentency: </h3>
            <Switch defaultChecked={this.state.optionActivatedKmsOptional} onChange={this.handleChangeOptionActivatedKmsOptional} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
          </Modal>
          <Row style={{ margin: 100 }}>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Table columns={this.columnsKMSCore} dataSource={this.state.dataSourceKMSCore} />
            </Col>
            <Col xs={20} sm={16} md={12} lg={8} xl={4}></Col>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Table columns={this.columnsKMSOptional} dataSource={this.state.dataSourceKMSOptional} />
            </Col>
          </Row>
        </Header>
      </Layout>
    );
  }
}


export default Competencies;
