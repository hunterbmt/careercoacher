import React, { Component } from 'react'
import { Layout, Modal, Switch, Icon, Button, Row, Col, Table, Card, message } from 'antd'
import { getData, update, getLastIndex } from './firebase'
import _ from 'lodash'
import Loading from './Loading'
import { Link } from 'react-router-component'
const { Header } = Layout
import logo from './logo.png'
import CreateCompetenciesKmsCore from './CreateCompetenciesKmsCore'
import CreateCompetenciesKmsOptional from './CreateCompetenciesKmsOptional'
import EditCompetencies from './EditCompetencies'

class Competencies extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visibleCreateKMSCore: false,
      showEditPopup: false,
      optionActivated: false,
      showEditPopupKmsOptional: false,
      optionActivatedKmsOptional: false,
      loading: true,
      loadingActivatedKmsCore: true,
      visibleCreateKmsOptional: false,
      visibleEdit: false,
    }
  }

  updateCompetencies = (name, activate) => {

    let dataUpdate
    if (_.isUndefined(this.state.competencyQuestions) && (_.isUndefined(this.state.competencyContraints))) {
      dataUpdate = {
        "activated": activate,
        "name": name,
        "id": this.state.keyUpdate
      }

    } else if ((_.isUndefined(this.state.competencyContraints))) {
      dataUpdate = {
        "activated": activate,
        "name": name,
        "id": this.state.keyUpdate,
        "questions": this.state.competencyQuestions,
      }
    } else if ((_.isUndefined(this.state.competencyQuestions))) {
      dataUpdate = {
        "activated": activate,
        "name": name,
        "id": this.state.keyUpdate,
        "constraints": this.state.competencyContraints
      }
    } else {
      dataUpdate = {
        "activated": activate,
        "name": name,
        "id": this.state.keyUpdate,
        "questions": this.state.competencyQuestions,
        "constraints": this.state.competencyContraints
      }
    }

    if (_.isEqual(this.state.selectOption, 'Kms_core')) {
      _.merge((_.find(this.state.competenciesKmsCore, this.state.competenciesKmsCore[this.state.keyUpdate])), dataUpdate)
      this.setState({
        competenciesKmsCore: this.state.competenciesKmsCore,
        visibleEdit: false,
        loadingActivated: true
      })

    } else {
      _.merge((_.find(this.state.competenciesKmsOptional, this.state.competenciesKmsOptional[this.state.keyUpdate])), dataUpdate)
      this.setState({
        competenciesKmsOptional: this.state.competenciesKmsOptional,
        visibleEdit: false,
        loadingActivated: true
      })

    }

    message.success("Update Competency successfully", 3)

    update(`competencies/${this.state.selectOption}/${this.state.keyUpdate}`, dataUpdate)


  }

  handleEdit = () => {
    const form = this.state.editFormRef
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.updateCompetencies(values.competencyName, values.activate)
      form.resetFields()
      this.setState({ visibleEditKmsCore: false })
    })
  }


  handleCancelEdit = (e) => {
    this.setState({
      visibleEdit: false,
      loadingActivated: true
    })
  }



  showModalKmsCore = () => {
    this.setState({
      visibleCreateKMSCore: true
    })
  }

  showModalKmsOptional = () => {
    this.setState({
      visibleCreateKmsOptional: true
    })
  }

  addNewKmsCore(lastIndex, competencyName) {
    let lastId = parseInt(lastIndex, 10) + 1
    let newCompetency = {
      "activated": false,
      "id": lastId,
      "name": competencyName
    }

    let newDataCompeteciesKMSCore = this.state.competenciesKmsCore
    newDataCompeteciesKMSCore.push(newCompetency)
    this.setState({
      competenciesKmsCore: newDataCompeteciesKMSCore
    })

    message.success("Create Competency successfully", 3)

    update(`competencies/Kms_core/${lastId}`, newCompetency)
  }

  addNewKMSCoreCompetency(competencyName) {
    getLastIndex(`competencies/Kms_core`).then((lastIndex) => this.addNewKmsCore(lastIndex, competencyName))
  }

  addNewKMSOptionalCompetency(competencyName) {

    getLastIndex(`competencies/Kms_optional`).then((lastIndex) => this.addNewKmsOptional(lastIndex, competencyName))
  }

  addNewKmsOptional(lastIndex, competencyName) {
    let lastId = parseInt(lastIndex, 10) + 1
    let newCompetency = {
      "activated": false,
      "id": lastId,
      "name": competencyName
    }

    let newDataCompeteciesKMSOptional = this.state.competenciesKmsOptional
    newDataCompeteciesKMSOptional.push(newCompetency)
    this.setState({
      competenciesKmsOptional: newDataCompeteciesKMSOptional
    })

    message.success("Create Competency successfully", 3)

    update(`competencies/Kms_optional/${lastId}`, newCompetency)
  }

  handleCancelKMSCore = (e) => {
    this.setState({
      visibleCreateKMSCore: false,
    })
  }

  handleCancelKmsOptional = (e) => {
    this.setState({
      visibleCreateKmsOptional: false,
    })
  }

  getColumnKMSCore() {
    const columnsKMSCore = [{
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
          <Button icon="edit" shape="circle" onClick={() => this.onSelectCompetency(record.no)}></Button>
          <span className="ant-divider" />
          <Button icon="right" shape="circle" onClick={() => this.moveCompetencyOptional(record.no)}></Button>
          <span className="ant-divider" />
          <Link href={`#competencies/core/${record.no}`}>Add question</Link>
        </span>
      ),
    }]
    return columnsKMSCore
  }

  getDataSourceKMSCore = () => {
    let dataSourceKMSCore = []
    _.forEach(this.state.competenciesKmsCore, (item, index) => {
      let activate
      if (item.activated === true) {
        activate = "On"
      } else {
        activate = "Off"
      }
      const kmsCoreDataPushTable = {
        no: item.id,
        kmscore: item.name,
        activatedKmscore: activate,
      }
      dataSourceKMSCore.push(kmsCoreDataPushTable)

    })
    return dataSourceKMSCore
  }

  onSelectCompetency(id) {
    getData(`competencies/Kms_core/${id}`).then((selectedCompetency) => this.setState({
      activateCompetency: selectedCompetency.activated,
      keyUpdate: id,
      competencyName: selectedCompetency.name,
      competencyQuestions: selectedCompetency.questions,
      competencyContraints: selectedCompetency.constraints,
      visibleEdit: true,
      selectOption: 'Kms_core',
      loadingActivated: false
    }))
  }

  moveOptional = (lastIndex, competency) => {
    let lastId = parseInt(lastIndex, 10) + 1
    let newDataCompeteciesKMSOptional = this.state.competenciesKmsOptional
    let newDataCompeteciesKMSCore = this.state.competenciesKmsCore
    _.remove(newDataCompeteciesKMSCore, newDataCompeteciesKMSCore[competency.id])
    update(`competencies/Kms_core/${competency.id}`, null)
    competency.id = lastId
    newDataCompeteciesKMSOptional.push(competency)
    this.setState({
      competenciesKmsOptional: newDataCompeteciesKMSOptional,
      competenciesKmsCore: newDataCompeteciesKMSCore
    })

    update(`competencies/Kms_optional/${lastId}`, competency)

    message.success("Move Competency successfully", 3)
  }

  moveKmsOptional(competency) {
    getLastIndex(`competencies/Kms_optional`).then((lastIndex) => this.moveOptional(lastIndex, competency))
  }


  moveCompetencyOptional = (id) => {
    getData(`competencies/Kms_core/${id}`).then((selectedCompetency) => this.moveKmsOptional(selectedCompetency))
  }

  getColumnKMSOptional() {
    const columnsKMSOptional = [{
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
          <Button icon="edit" shape="circle" onClick={() => this.onSelectKmsOptionalCompetency(record.no)}></Button>
          <span className="ant-divider" />
          <Button icon="left" shape="circle" onClick={() => this.moveCompetencyCore(record.no)}></Button>
          <span className="ant-divider" />
          <Link href={`#competencies/optional/${record.no}`}>Add question</Link>
        </span>
      ),
    }]
    return columnsKMSOptional
  }

  getDataSourceKMSOptional = () => {
    let dataSourceKMSOptional = []
    _.forEach(this.state.competenciesKmsOptional, (item, index) => {
      let activate
      if (item.activated === true) {
        activate = "On"
      } else {
        activate = "Off"
      }
      const kmsOptionalDataPushTable = {
        no: item.id,
        kmsoptional: item.name,
        activatedKmsOptional: activate,
      }
      dataSourceKMSOptional.push(kmsOptionalDataPushTable)
    })
    return dataSourceKMSOptional
  }

  onSelectKmsOptionalCompetency(id) {
    getData(`competencies/Kms_optional/${id}`).then((selectedCompetency) => this.setState({
      activateCompetency: selectedCompetency.activated,
      keyUpdate: id,
      competencyName: selectedCompetency.name,
      competencyQuestions: selectedCompetency.questions,
      competencyContraints: selectedCompetency.constraints,
      visibleEdit: true,
      selectOption: 'Kms_optional',
      loadingActivated: false
    }))
  }


  moveCore = (lastIndex, competency) => {
    let lastId = parseInt(lastIndex, 10) + 1
    let newDataCompeteciesKMSOptional = this.state.competenciesKmsOptional
    let newDataCompeteciesKMSCore = this.state.competenciesKmsCore
    _.remove(newDataCompeteciesKMSOptional, newDataCompeteciesKMSOptional[competency.id])
    update(`competencies/Kms_optional/${competency.id}`, null)
    competency.id = lastId
    newDataCompeteciesKMSCore.push(competency)
    this.setState({
      competenciesKmsCore: newDataCompeteciesKMSCore,
      competenciesKmsOptional: newDataCompeteciesKMSOptional
    })

    update(`competencies/Kms_core/${lastId}`, competency)
    message.success("Move Competency successfully", 3)
  }

  moveKmsCore(competency) {
    getLastIndex(`competencies/Kms_core`).then((lastIndex) => this.moveCore(lastIndex, competency))
  }


  moveCompetencyCore = (id) => {
    getData(`competencies/Kms_optional/${id}`).then((selectedCompetency) => this.moveKmsCore(selectedCompetency))
  }


  createKmsCoreFormRef = (form) => {
    this.setState({
      createKmsCoreFormRef: form
    })
  }

  createKmsOptionalFormRef = (form) => {
    this.setState({
      createKmsOptionalFormRef: form
    })
  }

  editFormRef = (form) => {
    this.setState({
      editFormRef: form
    })
  }

  handleCreateKMSCore = () => {
    const form = this.state.createKmsCoreFormRef
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.addNewKMSCoreCompetency(values.competencyName)
      form.resetFields()
      this.setState({ visibleCreateKMSCore: false })
    })
  }

  handleCreateKmsOptional = () => {
    const form = this.state.createKmsOptionalFormRef
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.addNewKMSOptionalCompetency(values.competencyName)
      form.resetFields()
      this.setState({ visibleCreateKmsOptional: false })
    })
  }


  getCompetencyKMSCore() {
    getData(`competencies/Kms_core`)
      .then((kmsCoreData) => this.setState({
        competenciesKmsCore: _.filter(kmsCoreData, (o) => _.isObject(o))
      }))
  }

  getCompetencyOptional() {
    getData(`competencies/Kms_optional`)
      .then((kmsOptionalData) => this.setState({
        competenciesKmsOptional: _.filter(kmsOptionalData, (o) => _.isObject(o)),
        loading: false
      }))
  }

  componentWillMount() {
    this.getCompetencyKMSCore()
    this.getCompetencyOptional()
  }

  handleCheckUniqueCompetency = (rule, value, callback) => {
    if (value && _.some(this.state.competenciesKmsCore, ['name', value])) {
      callback('competency has already existed in KMS Core')
    }
    if (value && _.some(this.state.competenciesKmsOptional, ['name', value])) {
      callback('competency has already existed in KMS Optional')
    }
    callback()
  }

  handleCheckCompetency = (rule, value, callback) => {
    if (value && _.some(_.difference(this.state.competenciesKmsCore, _.filter(this.state.competenciesKmsCore, ['name', this.state.competencyName])), ['name', value])) {
      callback('competency has already existed in KMS Core')
    }
    if (value && _.some(_.difference(this.state.competenciesKmsOptional, _.filter(this.state.competenciesKmsOptional, ['name', this.state.competencyName])), ['name', value])) {
      callback('competency has already existed in KMS Optional')
    }
    callback()
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
          <EditCompetencies
            loadingActivated={this.state.loadingActivated}
            visibleEdit={this.state.visibleEdit}
            onCancelEdit={this.handleCancelEdit}
            onEdit={this.handleEdit}
            ref={this.editFormRef}
            handleCheckCompetency={this.handleCheckCompetency}
            competencyName={this.state.competencyName}
            activate={this.state.activateCompetency}
          />
          <Row style={{ margin: 100 }}>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Card title="KMS Core" bordered={false} style={{ width: 600 }}>
                <Button icon="plus" shape="circle" style={{ width: 40, height: 40, fontSize: 20, marginLeft: 500 }} onClick={this.showModalKmsCore}></Button>
                <CreateCompetenciesKmsCore
                  ref={this.createKmsCoreFormRef}
                  visibleKmsCore={this.state.visibleCreateKMSCore}
                  onCancelKmsCore={this.handleCancelKMSCore}
                  onCreateKmsCore={this.handleCreateKMSCore}
                  handleCheckUniqueCompetency={this.handleCheckUniqueCompetency}
                />
                <Table columns={this.getColumnKMSCore()} dataSource={this.getDataSourceKMSCore()} />
              </Card>
            </Col>
            <Col xs={20} sm={16} md={12} lg={8} xl={4}></Col>
            <Col xs={2} sm={4} md={6} lg={8} xl={10}>
              <Card title="KMS Optional" bordered={false} style={{ width: 600 }} >
                <Button icon="plus" shape="circle" style={{ width: 40, height: 40, fontSize: 20, marginLeft: 500 }} onClick={this.showModalKmsOptional}></Button>
                <CreateCompetenciesKmsOptional
                  ref={this.createKmsOptionalFormRef}
                  visibleKmsOptional={this.state.visibleCreateKmsOptional}
                  onCancelKmsOptional={this.handleCancelKmsOptional}
                  onCreateKMSOptional={this.handleCreateKmsOptional}
                  handleCheckUniqueCompetency={this.handleCheckUniqueCompetency}
                />
                <Table columns={this.getColumnKMSOptional()} dataSource={this.getDataSourceKMSOptional()} />
              </Card>
            </Col>
          </Row>
        </Header>
      </Layout>
    )
  }
}

export default Competencies
