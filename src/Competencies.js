import React, { Component } from 'react';
import { Layout, Modal, Switch, Icon, Button, Input, Row, Col, Select, Table, Card } from 'antd';
import { getData, update, getLastIndex } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import { Link } from 'react-router-component';
const { Header } = Layout;
import logo from './logo.png';

const Option = Select.Option;


class Competencies extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      option: 'Kms_core',
      showEditPopup: false,
      optionActivated: false,
      showEditPopupKmsOptional: false,
      optionActivatedKmsOptional: false,
      loading: true,
      loadingActivated: true
    };
  }


  handleSaveActivatedKmsOptional = (e) => {
    let dataUpdate = {
      "activated": this.state.optionActivatedKmsOptional,
      "name": this.state.competencyName
    }

    _.update(this.state.competenciesKmsOptional[this.state.keyUpdate] ,'activated',()=> {return this.state.optionActivatedKmsOptional})

    update(`competencies1/Kms_optional/${this.state.keyUpdate}`, dataUpdate);
    this.setState({
      competenciesKmsOptional :this.state.competenciesKmsOptional,
      showEditPopupKmsOptional: false,
      loadingActivated: true
    })
  }

  handleCancelActivatedKmsOptional = (e) => {
    this.setState({
      showEditPopupKmsOptional: false,
      loadingActivated: true
    });
  }

  handleChangeOptionActivatedKmsOptional = () => {
    let activatedChangeKmsOptional = !this.state.optionActivatedKmsOptional
    this.setState({
      optionActivatedKmsOptional: activatedChangeKmsOptional
    })
  }

  handleChangeOptionActivated = () => {
    let activatedChangeKmsCore = !this.state.optionActivated
    this.setState({
      optionActivated: activatedChangeKmsCore
    })
  }

  handleChangeOption = (value) => {
    this.setState({
      option: `${value}`
    })
  }

  handleSaveActivated = (e) => {
    let dataUpdate = {
      "activated": this.state.optionActivated,
      "name": this.state.competencyName
    }

    _.update(this.state.competenciesKMSCore[this.state.keyUpdate] ,'activated',()=> {return this.state.optionActivated})
 
    update(`competencies1/Kms_core/${this.state.keyUpdate}`, dataUpdate);
    this.setState({
      competenciesKMSCore : this.state.competenciesKMSCore,
      showEditPopup: false,
      loadingActivated: true
    })
  }

  handleCancelActivated = (e) => {

    this.setState({
      showEditPopup: false,
      loadingActivated: true
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }

  addNew(lastIndex, competencyName, option) {
    let lastId = parseInt(lastIndex, 10) + 1
    let newCompetency = {
      "activated": false,
      "name": competencyName
    }

    if (`${option}` === 'Kms_core') {
      let newDataCompeteciesKMSCore = this.state.competenciesKMSCore
      newDataCompeteciesKMSCore.push(newCompetency)
      this.setState({
        competenciesKMSCore: newDataCompeteciesKMSCore
      })
    } else {
      let newDataCompeteciesKMSOptional = this.state.competenciesKmsOptional
      newDataCompeteciesKMSOptional.push(newCompetency)
      this.setState({
        competenciesKmsOptional: newDataCompeteciesKMSOptional
      })
    }

    update(`competencies1/${option}/${lastId}`, newCompetency)
  }

  addNewCompetency(competencyName, option) {
    getLastIndex(`competencies1/${option}`).then((lastIndex) => this.addNew(lastIndex, competencyName, option))
  }

  handleChange = (e) => {
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

  getColumnKMSCore() {
    let columnsKMSCore = [{
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: 'Competency',
      dataIndex: 'kmscore',
      key: 'kmscore',
    }, {
      title: 'Status',
      dataIndex: 'activatedKmscore',
      key: 'activatedKmscore',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.onSelectCompetency(record.kmscore)}>Edit</a>
          <span className="ant-divider" />
          <Link href={`#competencies/core/${record.no}`}>Add question</Link>
        </span>
      ),
    }];
    return columnsKMSCore
  }


  onSelectCompetency(name) {
    getData(`competencies1/Kms_core`)
      .then((dataKmsCore) => _.map(dataKmsCore, (competency, key) => {
        if (competency.name === name) {
          getData(`competencies1/Kms_core/${key}`).then((selectedCompetency) => this.setState({
            optionActivated: selectedCompetency.activated,
            keyUpdate: key,
            competencyName: selectedCompetency.name,
            showEditPopup: true,
            loadingActivated: false
          }))
        }
      }))
  }

  getColumnKMSOptional() {
    let columnsKMSOptional = [{
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: 'Competency',
      dataIndex: 'kmsoptional',
      key: 'kmsoptional',
    }, {
      title: 'Status',
      dataIndex: 'activatedKmsOptional',
      key: 'activatedKmsOptional',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.onSelectKmsOptionalCompetency(record.kmsoptional)}>Edit</a>
          <span className="ant-divider" />
          <Link href={`#competencies/optional/${record.no}`}>Add question</Link>
        </span>
      ),
    }];
    return columnsKMSOptional
  }

  onSelectKmsOptionalCompetency(name) {
    getData(`competencies1/Kms_optional`)
      .then((dataKmsOptional) => _.map(dataKmsOptional, (competency, key) => {
        if (competency.name === name) {
          getData(`competencies1/Kms_optional/${key}`).then((selectedCompetency) => this.setState({
            optionActivatedKmsOptional: selectedCompetency.activated,
            keyUpdate: key,
            competencyName: selectedCompetency.name,
            showEditPopupKmsOptional: true,
            loadingActivated: false,
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
        competenciesKmsOptional: kmsOptionalData,
        loading: false
      }));
  }

  componentWillMount() {
    this.getCompetencyKMSCore();
    this.getCompetencyOptional();
  }

  getDataSourceKMSCore = () => {
    let dataSourceKMSCore = [];
    _.forEach(this.state.competenciesKMSCore, (item, index) => {
      let activate;
      if (item.activated === true) {
        activate = "On"
      } else {
        activate = "Off"
      }
      const kmsCoreDataPushTable = {
        no: index,
        kmscore: item.name,
        activatedKmscore: activate,
      }
      dataSourceKMSCore.push(kmsCoreDataPushTable);

    })
    return dataSourceKMSCore
  }

  getDataSourceKMSOptional = () => {
    let dataSourceKMSOptional = [];
    _.forEach(this.state.competenciesKmsOptional, (item, index) => {
      let activate;
      if (item.activated === true) {
        activate = "On"
      } else {
        activate = "Off"
      }
      const kmsOptionalDataPushTable = {
        no: index,
        kmsoptional: item.name,
        activatedKmsOptional: activate,
      }
      dataSourceKMSOptional.push(kmsOptionalDataPushTable);
    })
    return dataSourceKMSOptional
  }

  render() {
    if (this.state.loading) return <div style={{ height: 600 }}><Loading /> </div>;
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
            {
              this.state.loadingActivated ?
              <Loading/>
              :
              <Switch defaultChecked={this.state.optionActivated} onChange={this.handleChangeOptionActivated} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
            }                    
          </Modal>
          <Modal title="Edit activate KMS Optional compentency" visible={this.state.showEditPopupKmsOptional}
            onOk={this.handleSaveActivatedKmsOptional} onCancel={this.handleCancelActivatedKmsOptional}>
            <h3>Activate compentency: </h3>
              {
              this.state.loadingActivated ?
              <Loading/>
              :
               <Switch defaultChecked={this.state.optionActivatedKmsOptional} onChange={this.handleChangeOptionActivatedKmsOptional} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
            }         
          </Modal>
          <Row style={{ margin: 100 }}>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Card title="KMS Core" bordered={false} style={{ width: 600 }}>
                <Table columns={this.getColumnKMSCore()} dataSource={this.getDataSourceKMSCore()} />
              </Card>
            </Col>
            <Col xs={20} sm={16} md={12} lg={8} xl={4}></Col>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Card title="KMS Optional" bordered={false} style={{ width: 600 }}>
                <Table columns={this.getColumnKMSOptional()} dataSource={this.getDataSourceKMSOptional()} />
              </Card>
            </Col>
          </Row>
        </Header>
      </Layout>
    );
  }
}

export default Competencies;
