import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Modal, Input, Popconfirm, message, InputNumber, Table } from 'antd'
import './App.css'
import { getData, update } from './firebase'

class OptionalBaseline extends Component {
     constructor(props) {
        super(props)
        this.state = {
            selectedBaseline : 0,
            showEditProfilePopup : false,
            columns : this.prepareColumns()
        }
    }

    prepareColumns = () => {
        return [{
                title: 'No',
                dataIndex: 'no',
                key: 'no',
            }, {
                title: 'Competency',
                dataIndex: 'competency',
                key: 'competency',
            }, {
                title: 'Proficiency',
                dataIndex: 'proficiency',
                key: 'proficiency',
            }, { 
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                <span>
                    <a onClick={() => this.onSelectBaseline(record.competency, record.proficiency, record.no)} key={record.no}>Edit 一 {record.proficiency}</a>
                    <span className='ant-divider' />
                    <Popconfirm title='Are you sure delete this item?' onConfirm={() => this.onConfirmDelete(record.competency, record.no)} onCancel={this.onConfirmCancelDelete} okText='Yes' cancelText='No'>
                    <a>Delete</a>
                    </Popconfirm>
                </span>
                ),
            }]
    }

    onSelectBaseline = (competency, proficiency, no) => {
        this.setState({
        showEditProfilePopup : true,
        selectedCompetency : competency,
        selectedCompetencyProficiency : proficiency,
        selectedCompetencyKey : no,
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selectedBaseline : newProps.selectedBaseline
        }, () => Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_optional/competencies`)]).then(([optionalBaselineCompetencyList]) =>
            this.setState({
                optionalBaselineCompetencyList,
                loading: false
            })
        ))
    }

    componentDidMount() {
     Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_optional/competencies`)]).then(([optionalBaselineCompetencyList]) =>
            this.setState({
                optionalBaselineCompetencyList,
                loading: false
            })
        )
    }

    handleBaselineChange = (e) => {
        this.setState({
            newProficiency: e
        })
        
    }

    handleCompetencyChange = (e) => {
        this.setState({
            newCompetency: e.target.value
        })
    }

    handleOk = () => {
        this.setState({ loading: true })
        this.updateCompetencyProficiency(this.state.selectedBaseline, this.state.selectedCompetencyKey, this.state.newProficiency)
    }

    handleCancel = () => {
        this.setState({ showEditProfilePopup: false })
    }

    updateCompetencyProficiency = (baselineKey, competencyKey, competencyProficiency) => {
        update(`baseline/${baselineKey}/Kms_optional/competencies/${competencyKey}/proficiency`, competencyProficiency).then(() => this.setState({loading : false, showEditProfilePopup : false}))
    }

    deleteCompetencyProficiency = (baselineKey, competencyKey) => {
        update(`baseline/${baselineKey}/Kms_optional/competencies/${competencyKey}`, null)
    }

    render() {
        let dataSource = []
        _.forEach(this.state.optionalBaselineCompetencyList, (item, index) => {
            
            let object = {
                key : index,
                no: index,
                competency : item.name,
                proficiency: item.proficiency
            }
            dataSource.push(object)
           
        })
        return (
            <div>
                <Table dataSource={dataSource} columns={this.state.columns} />
                <Modal
                    visible={this.state.showEditProfilePopup}
                    title='Edit Competency'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key='back' size='large' onClick={this.handleCancel}>Return</Button>,
                        <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={this.handleOk}>
                            Save
                    </Button>
                    ]}
                >
                    <p>{this.props.something}</p>
                    <p>Competencies: </p>
                    <Input placeholder='Coding....' value={this.state.selectedCompetency} onChange={this.handleBaselineChange} disabled='true' />
                    <p>Proficency: </p>
                    <InputNumber min={0} max={4} defaultValue={this.state.selectedCompetencyProficiency} onChange={this.handleBaselineChange} />
                </Modal>
            </div>
        )
    }

    onConfirmDelete = (competency, no) => {
        this.setState({
            selectedCompetency: competency,
            selectedCompetencyKey: no,
        }, () => this.deleteCompetencyProficiency(this.state.selectedBaseline, this.state.selectedCompetencyKey))
        message.success('Deleted')
    }

    onConfirmCancelDelete = () => {
        message.error('Delete Canceled')
    }
}

export default OptionalBaseline