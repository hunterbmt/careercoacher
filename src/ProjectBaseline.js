import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Modal, Input, Table, Select, Popconfirm, message, Form, Icon, Checkbox, Tag } from 'antd'
import Loading from './Loading'
import {CreateProjectBaselineForm} from './CreateProjectBaselineForm'
import {EditProjectBaselineForm} from './EditProjectBaselineForm'
import {CloneProjectBaselineForm} from './CloneProjectBaselineForm'
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
                title: 'Project',
                dataIndex: 'project',
                key: 'project',
                render: (text, record) => <Tag color='#108ee9'>{record.project}</Tag>
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
                        <span className='ant-divider' />
                        <a onClick={() => this.onSelectBaseline(record.no, record.baseline)} >Clone</a>
                    </span>
                ),
            }]
    }

    onSelectBaseline = (no, baseline) => {     
        this.setState({
            showEditPopup : true,
            selectedBaseline : baseline,
            selectedbaselineKey : no
        }, () => Promise.all([getData(`project_baseline`), getData(`project_baseline/${no}/competencies`), getData(`baseline/${no}/Kms_optional/competencies`)]).then(([projectBaselines, projectBaselineCompetencies, optionalBaselines]) =>
            this.setState({
                projectBaselines,
                projectBaselineCompetencies,
                optionalBaselines,
                loading: false
            })
        ))
    }

    componentDidMount() {
        Promise.all([getData(`project_baseline`), getData(`project_baseline/0/competencies`),
                getData('baseline'),
                getData(`baseline/0/Kms_optional/competencies`), getData(`BU_projects`)
            ])
            .then(([projectBaselines, projectBaselineCompetencies, baselines, optionalBaselines, projects]) =>
                this.setState({
                    projectBaselines,
                    projectBaselineCompetencies,
                    optionalBaselines,
                    baselines,
                    projects,
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

        this.setState({
            projectBaselineToBeSaved: {
                projectName: this.state.projectName,
                coreId: this.state.selectedbaselineKey,
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
                        showEditPopup: false
                    }))
            })
    }

    handleBaselineChange = (e) => {
        this.setState({
            newBaseline: e
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
        const data = _.map(selectedItem, (item) =>
            ({
                name: item.split(':')[0],
                proficiency: item.split(':')[1]
            })
        )
        
        this.setState({
            competenciesToBeSaved: data
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

    handleCreateCancel = () => {
        this.setState({ showCreateNewPopup: false })
    }

    handleCreate = () => {
        const form = this.state.createFormRef
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.saveNewProjectBaseline(values.baselineName, this.state.competenciesToBeSaved)
            
            this.setState({
                showCreateNewPopup: false
            })
            form.resetFields()
        })
    }

    createFormRef = (form) => {
       this.setState({
           createFormRef : form
       })
    }

    handleEditCancel = () => {
        this.setState({ showEditPopup: false })
    }

    handleEdit = () => {
        const form = this.state.editFormRef
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            
            this.setState({
                showEditPopup: false
            })
            form.resetFields()
        })
    }

     editFormRef = (form) => {
         this.setState({
           editFormRef : form
       })
    }

    handleChangeProjectName = (e) => {
        this.setState({
            projectName : e
        })
    }

    render() {
        if (this.state.loading) return <Loading />

        const baselines = _.map(this.state.baselines, (item, index) => (
            <Option key={index}>{item.name} : {item.proficiency}</Option>
        ))

        const optionalBaselines = _.map(this.state.optionalBaselines, (item) => (
            <Option key={item.name}>{item.name} : {item.proficiency}</Option>
        ))

         const selectedProjectBaselineCompetencies =  _.map(this.state.projectBaselineCompetencies, (item, index) => (
           <Option key={item.name + ':' + item.proficiency}>{`${item.name} : ${item.proficiency}`}</Option>
        ))
        
        const defaultOptionalBaselines = _.map(this.state.projectBaselineCompetencies, (item) => item.name)

        const projectBaselineCompetencies = _.map(this.state.projectBaselineCompetencies, (item, index) => (
            <Option key={index}>{item.name} : {item.proficiency}</Option>
        ))

        const projectNames = _.map(this.state.projects, (project) => (
            <Option key={project.name}>{project.name}</Option>
        ))

        let dataSource = []
        _.forEach(_.filter(this.state.projectBaselines, (baseline) => !_.isNil(baseline)), (item, index) => {    
            let row = {
                key : index,
                no: item.id,
                baseline: item.name,
                project: item.projectName
            }
            dataSource.push(row)
        })

        return (
            <div>
                <Button icon='user-add' onClick={this.handleAddNewProfile}>Add New Profile</Button>
                <Table dataSource={dataSource} columns={this.state.columns} />

                <CloneProjectBaselineForm 
                    visible={this.state.showEditPopup}
                    ref={this.editFormRef}
                    onCancel={this.handleEditCancel}
                    onEdit={this.handleEdit}
                    projectBaselineCompetencies={projectBaselineCompetencies}
                    handleChange={this.handleChange}
                    selectedBaseline={this.state.selectedBaseline}
                />

                <EditProjectBaselineForm 
                    visible={this.state.showEditPopup}
                    ref={this.editFormRef}
                    onCancel={this.handleEditCancel}
                    onEdit={this.handleEdit}
                    projectBaselineCompetencies={optionalBaselines}
                    optionalBaselines={defaultOptionalBaselines}
                    handleChange={this.handleChange}
                    selectedBaseline={this.state.selectedBaseline}
                />
                
                <CreateProjectBaselineForm 
                    visible={this.state.showCreateNewPopup}
                    ref={this.createFormRef}
                    onCancel={this.handleCreateCancel}
                    onCreate={this.handleCreate}
                    baselines={baselines}
                    projectNames={projectNames}
                    optionalBaselines={selectedProjectBaselineCompetencies}
                    handleChangeRequiredBaselineOnCreate={this.handleChangeRequiredBaselineOnCreate}
                    handleChangeAdditionalBaselineOnCreate={this.handleChangeAdditionalBaselineOnCreate}
                    handleChangeProjectName={this.handleChangeProjectName}
                />
                
            </div>
        )
    }
}

export default ProjectBaseline