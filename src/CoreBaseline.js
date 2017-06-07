import React, { Component } from 'react'
import _ from 'lodash'
import { Popconfirm, Table, message } from 'antd'
import './App.css'
import { getData } from './firebase'

class CoreBaseline extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource : [],
            selectedBaseline : 0,
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
                    <a onClick={() => this.onSelectBaseline(record.no)} key={record.no}>Edit 一 {record.competency}</a>
                    <span className='ant-divider' />
                    <Popconfirm title='Are you sure delete this item?' onConfirm={this.onConfirmDelete} onCancel={this.onConfirmCancelDelete} okText='Yes' cancelText='No'>
                    <a>Delete</a>
                    </Popconfirm>
                </span>
                ),
            }]    
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selectedBaseline : newProps.selectedBaseline
        }, () => Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_core/competencies`)]).then(([coreBaselineCompetencyList]) =>
            this.setState({
                coreBaselineCompetencyList,
                loading: false
            })
        ))
    }

    componentDidMount() {
     Promise.all([getData(`baseline/${this.state.selectedBaseline}/Kms_core/competencies`)]).then(([coreBaselineCompetencyList]) =>
            this.setState({
                coreBaselineCompetencyList,
                loading: false
            })
        )
    }

    render() {
        let dataSource = []
        _.forEach(this.state.coreBaselineCompetencyList, (item, index) => {
            
            let object = {
                key : index,
                no: index,
                competency : Object.values(item.name),
                proficiency: item.proficiency
            }
            dataSource.push(object)
            
        })
        return <Table dataSource={dataSource} columns={this.state.columns} />
    }

    onConfirmDelete = () => {
        message.success('Click on Yes')
    }

    onConfirmCancelDelete = () => {
        message.error('Click on No')
    }
}

export default CoreBaseline