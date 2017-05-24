import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Modal, Input, Table, Select, Popconfirm, message } from 'antd'
import Loading from './Loading'
import './App.css'
import { getData, update, getLastIndex } from './firebase'


class ProjectBaseline extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEditPopup: false,
            showCreateNewPopup : false,
            columns: this.prepareColumns()
        }
    }

    prepareColumns = () => {
        return [{
                title: 'No',
                dataIndex: 'no',
                key: 'no',
            }, {
                title: 'Baseline',
                dataIndex: 'baseline',
                key: 'baseline',
            }, {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={() => this.onSelectBaseline(record.no, record.baseline)} key={record.no}>Edit 一 {record.baseline}</a>
                        <span className='ant-divider' />
                        <Popconfirm title='Are you sure delete this item?' onConfirm={() => this.onConfirmDelete(record.no)} onCancel={this.onConfirmCancelDelete} okText='Yes' cancelText='No'>
                            <a>Delete</a>
                        </Popconfirm>
                    </span>
                ),
            }]
    }

    onSelectBaseline = (no, baseline) => {      
        this.setState({
            showEditPopup : true,
            selectedBaseline : baseline,
            selectedbaselineKey : no
        }, () => Promise.all([getData(`project_baseline`), getData(`project_baseline/${no}/Kms_optional/competencies`)]).then(([projectBaselines, projectBaselineCompetencies]) =>
            this.setState({
                projectBaselines,
                projectBaselineCompetencies,
                loading: false
            })
        ))
    }

    componentDidMount() {
     Promise.all([getData(`project_baseline`), getData(`project_baseline/0/Kms_optional/competencies`), getData('baseline'), getData(`baseline/0/Kms_optional/competencies`)]).then(([projectBaselines, projectBaselineCompetencies, baselines, optionalBaselines]) =>
            this.setState({
                projectBaselines,
                projectBaselineCompetencies,
                optionalBaselines,
                baselines,
                loading: false
            })
        )
    }

    saveNewProjectBaseline = (newProjectBaselineName, projectBaselineCompetencies) => {
        getLastIndex(`project_baseline`).then((lastIndex) => 
            this.saveNewProjectBaselineData(lastIndex, newProjectBaselineName, projectBaselineCompetencies)) 
    }

    saveNewProjectBaselineData = (lastIndex, newProjectBaselineName, projectBaselineCompetencies) => {
        lastIndex = _.toNumber(lastIndex) + 1
        console.log('prepare to save ' + lastIndex)

        this.setState({
            projectBaselineToBeSaved: {
                competencies: projectBaselineCompetencies,
                name: newProjectBaselineName,
                id: lastIndex
            },
            loading: true
        })

        update(`project_baseline/${lastIndex}`, this.state.projectBaselineToBeSaved)
            .then(() => {
                getData(`project_baseline`).then((projectBaselines) =>
                    this.setState({
                        projectBaselines,
                        loading: false,
                        showEditProfilePopup: false
                    }))
            })
    }

    handleEditCancel = () => {
        this.setState({ showEditPopup: false })
    }

    handleCreateCancel = () => {
        this.setState({ showCreateNewPopup: false })
    }

    handleBaselineChange = (e) => {
        this.setState({
            newBaseline: e
        })
    }

    handleCreateOk = () => {
        this.saveNewProjectBaseline(this.state.newProjectBaselineName, this.state.projectBaselineCompetencies)
        this.updateDataSource()
        this.setState({
            showCreateNewPopup : false
        })
    }

    updateDataSource = () => {
        this.setState({
            loading : true
        })
        getData(`project_baseline`).then((projectBaselines) =>
            this.setState({
                projectBaselines,
                loading: false
            }))
    }

    handleAddNewProfile = () => {
        this.setState({
            showCreateNewPopup : true
        })
    }

    handleChangeRequiredBaselineOnCreate = (no) => {
        this.setState({
            selectedbaselineKey : no
        }, () => Promise.all([getData(`project_baseline`), getData(`baseline/${no}/Kms_optional/competencies`), getData(`baseline/${no}/Kms_optional/competencies`)]).then(([projectBaselines, projectBaselineCompetencies, optionalBaselines]) =>
            this.setState({
                projectBaselines,
                projectBaselineCompetencies,
                optionalBaselines,
                loading: false
            })
        ))
    }

    handleChangeAdditionalBaselineOnCreate = (selectedItem) => {
        let data = []
        _.forEach(selectedItem, (item) => {
            data.push({
                name : item.split(':')[0],
                proficiency : item.split(':')[1]
            })
        }) 
       this.setState({
           competenciesToBeSaved : data
       })
    }

    handleProjectBaselineNameChange = (e) => {
        this.setState({
            newProjectBaselineName : e.target.value
        })        
    }

    onConfirmDelete = (no) => {
        this.deleteProjectBaseline(no)
        this.updateDataSource()
        message.success('Successfully Deleted')
    }

    onConfirmCancelDelete = () => {
        message.error('Delete Canceled')
    }

    deleteProjectBaseline = (baselineKey) => {
        update(`project_baseline/${baselineKey}`, null)
    }

    render() {
        if (this.state.loading) return <Loading />

        let baselines = []
        _.forEach(this.state.baselines, (item, index) => (
            baselines.push(<Option key={index}>{item.name}</Option>)
        ))

        let optionalBaselines = []
        _.forEach(this.state.optionalBaselines, (item) => (
            optionalBaselines.push(<Option key={item.name + ':' + item.proficiency}>{item.name} : {item.proficiency}</Option>)
        ))

        let projectBaselineCompetencies = []
        _.forEach(this.state.projectBaselineCompetencies, (item, index) => (
            projectBaselineCompetencies.push(<Option key={item.name}>{item.name} : {item.proficiency}</Option>)
        ))

        let dataSource = []
        _.forEach(_.filter(this.state.projectBaselines, (baseline) => !_.isNil(baseline)), (item, index) => {    
            let row = {
                key : index,
                no: item.id,
                baseline : item.name
            }
            dataSource.push(row)
        })

        return (
            <div>
                <Button icon='user-add' onClick={this.handleAddNewProfile}>Add New Profile</Button>
                <Table dataSource={dataSource} columns={this.state.columns} />

                <Modal
                visible={this.state.showEditPopup}
                title={'Edit ' + this.state.selectedBaseline}
                onOk={this.handleEditOk}
                onCancel={this.handleEditCancel}
                footer={[
                    <Button key='back' size='large' onClick={this.handleEditCancel}>Return</Button>,
                    <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleEditOk}>
                    Save
                    </Button>
                ]}
                >
                <p>Requiried Baselines: </p>
                <Input value='KMS Baseline' onChange={this.handleBaselineChange.bind(this)} disabled='true'/>
                <p>Additional Baselines: </p>
                <Select
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder='Please select'
                    allowClear='true'
                    onChange={this.handleChange}
                >
                    {projectBaselineCompetencies}
                </Select>
                </Modal>

                <Modal
                visible={this.state.showCreateNewPopup}
                title='Create New Project Baseline'
                onOk={this.handleCreateOk}
                onCancel={this.handleCreateCancel}
                footer={[
                    <Button key='back' size='large' onClick={this.handleCreateCancel}>Return</Button>,
                    <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleCreateOk}>
                    Save
                    </Button>
                ]}
                >
                <p>Baseline Name: </p>
                <Input value={this.state.newProjectBaselineName} onChange={this.handleProjectBaselineNameChange} />
                <p>Requiried Baselines: </p>
                <Select
                    mode='combobox'
                    style={{ width: '100%' }}
                    placeholder='Please select'
                    allowClear='true'
                    onChange={this.handleChangeRequiredBaselineOnCreate}
                >
                    {baselines}
                </Select>
                <p>Additional Baselines: </p>
                <Select
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder='Please select'
                    allowClear='true'
                    onChange={this.handleChangeAdditionalBaselineOnCreate}
                >
                    {optionalBaselines}
                </Select>
                </Modal>
            </div>
        )
    }
}

export default ProjectBaseline