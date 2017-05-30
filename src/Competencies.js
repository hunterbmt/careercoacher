import React, { Component } from 'react';
import { Layout, Modal, Switch, Icon, Button, Row, Col, Table, Card, message } from 'antd';
import { getData, update, getLastIndex } from './firebase';
import _ from 'lodash';
import Loading from './Loading';
import CompetenciesCreateForm from './CompetenciesCreateForm'
import { Link } from 'react-router-component';
const { Header } = Layout;
import logo from './logo.png';

class Competencies extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showEditPopup: false,
      optionActivated: false,
      showEditPopupKmsOptional: false,
      optionActivatedKmsOptional: false,
      loading: true,
      loadingActivated: true,
    };
  }

  handleSaveActivated = (e) => {
    let dataUpdate = {
      "activated": this.state.optionActivated,
      "name": this.state.competencyName
    }

    if (_.isEqual(this.state.selectOption, 'Kms_core')) {
      _.update(this.state.competenciesKMSCore[this.state.keyUpdate], 'activated', () => { return this.state.optionActivated })
    } else {
      _.update(this.state.competenciesKmsOptional[this.state.keyUpdate], 'activated', () => { return this.state.optionActivated })
    }
    message.success("Update Competency successfully", 3)

    update(`competencies1/${this.state.selectOption}/${this.state.keyUpdate}`, dataUpdate);
    this.setState({
      competenciesKMSCore: this.state.competenciesKMSCore,
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

  handleChangeOptionActivated = () => {
    let optionChange = !this.state.optionActivated
    this.setState({
      optionActivated: optionChange
    })
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
    message.success("Create Competency successfully", 3)

    update(`competencies1/${option}/${lastId}`, newCompetency)
  }

  addNewCompetency(competencyName, option) {
    getLastIndex(`competencies1/${option}`).then((lastIndex) => this.addNew(lastIndex, competencyName, option))
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

  onSelectCompetency(name) {
    getData(`competencies1/Kms_core`)
      .then((dataKmsCore) => _.map(dataKmsCore, (competency, key) => {
        if (competency.name === name) {
          getData(`competencies1/Kms_core/${key}`).then((selectedCompetency) => this.setState({
            optionActivated: selectedCompetency.activated,
            keyUpdate: key,
            competencyName: selectedCompetency.name,
            showEditPopup: true,
            selectOption: 'Kms_core',
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

  onSelectKmsOptionalCompetency(name) {
    getData(`competencies1/Kms_optional`)
      .then((dataKmsOptional) => _.map(dataKmsOptional, (competency, key) => {
        if (competency.name === name) {
          getData(`competencies1/Kms_optional/${key}`).then((selectedCompetency) => this.setState({
            optionActivated: selectedCompetency.activated,
            keyUpdate: key,
            competencyName: selectedCompetency.name,
            showEditPopup: true,
            selectOption: 'Kms_optional',
            loadingActivated: false
          }))
        }
      }))
  }


  saveFormRef = (form) => {
    this.form = form;
  }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.addNewCompetency(values.competencyName, values.competencyOption)
      form.resetFields();
      this.setState({ visible: false });
    });
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

  handleCheckUniqueCompetency = (rule, value, callback) =>{
    if(value && _.some(this.state.competenciesKMSCore,['name',value])){
      callback('competency has already existed in KMS Core')
    }
    if(value && _.some(this.state.competenciesKmsOptional,['name',value])){
       callback('competency has already existed in KMS Optional')
    }
    callback()
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
              <CompetenciesCreateForm
                ref={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                handleCheckUniqueCompetency={this.handleCheckUniqueCompetency}
              />
            </Col>
          </Row>
          <Modal title="Edit activate KMS Core compentency" visible={this.state.showEditPopup}
            onOk={this.handleSaveActivated} onCancel={this.handleCancelActivated}>
            <h3>Activate compentency: </h3>
            {
              this.state.loadingActivated ?
                <Loading />
                :
                <Switch defaultChecked={this.state.optionActivated} onChange={this.handleChangeOptionActivated} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
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
