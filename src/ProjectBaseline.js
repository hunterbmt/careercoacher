import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Modal, Input, Table, Select, Popconfirm } from 'antd'
import './App.css'
import { getData, update } from './firebase'


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
                        <Popconfirm title='Are you sure delete this item?' onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText='Yes' cancelText='No'>
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

    saveNewProjectBaselineCompetencies = (baselineKey, projectBaselineCompetencies) => {
        update(`project_baseline/3/Kms_optional/competencies`, projectBaselineCompetencies)
            .then(() => this.setState({
                loading : false, showEditProfilePopup : false
            }))
    }

    saveNewProjectBaselineName = (baselineKey, newProjectBaselineName) => {
        update(`project_baseline/${baselineKey}/name`, newProjectBaselineName)
            .then(() => this.setState({
                loading : false, showEditProfilePopup : false
            }))
    }

    handleEditCancel = () => {
        this.setState({ showEditPopup: false })
    }

    handleCreateCancel = () => {
        this.setState({ showCreateNewPopup: false })
    }

    handleBaselineChange = (e) => {
        this.setState({
            newBaseline: e.target.value
        })
    }

    handleCreateOk = (e) => {
        this.saveNewProjectBaselineCompetencies(0, this.state.competenciesToBeSaved)
        //this.saveNewProjectBaselineName(this.state.newProjectBaselineName)
    }

    handleAddNewProfile = () => {
        this.setState({
            showCreateNewPopup : true
        })
    }

    handleChangeRequiredBaselineOnCreate = (no) => {
        this.setState({
            selectedbaselineKey : no
        }, () => Promise.all([getData(`project_baseline`), getData(`project_baseline/${no}/Kms_optional/competencies`), getData(`project_baseline/${no}/Kms_optional/competencies`)]).then(([projectBaselines, projectBaselineCompetencies, optionalBaselines]) =>
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
       }, () => console.log(this.state.competenciesToBeSaved))
    }

    render() {
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

        let a = []
        _.forEach(this.state.projectBaselineCompetencies, (item) => (
            a.push(item.name + ' : ' + item.proficiency)
        ))

        let dataSource = []
        _.forEach(this.state.projectBaselines, (item, index) => {    
            let row = {
                key : index,
                no: index,
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