import React, { Component } from 'react'
import _ from 'lodash'
import { Button, Modal, Input, Table, Select, Popconfirm, message, Form, Checkbox, Icon } from 'antd'
import Loading from './Loading'
import './App.css'
import { getData, update, getLastIndex } from './firebase'
const FormItem = Form.Item

class TestForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCreateNewPopup: false
        }
    }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
        showCreateNewPopup:newProps.showCreateNewPopup
    })
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

  onCancel = () => {
      this.setState({
          showCreateNewPopup: false
      })
  }

  onSave = () => {
    this.props.form.validateFields(
      (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      },
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    let baselines = []
    _.forEach(this.state.baselines, (item, index) => (
        baselines.push(<Option key={index}>{item.name}</Option>)
    ))

    let optionalBaselines = []
    _.forEach(this.state.optionalBaselines, (item) => (
        optionalBaselines.push(<Option key={item.name + ':' + item.proficiency}>{item.name} : {item.proficiency}</Option>)
    ))

    return (
        <Modal
                visible={this.state.showCreateNewPopup}
                title='Create New Project Baseline'
                onOk={this.handleCreateOk}
                onCancel={this.handleCreateCancel}
                footer={[
                    <Button key='back' size='large' onClick={this.onCancel}>Return</Button>,
                    <Button type='primary' onClick={this.onSave} className='login-form-button'>
                        Save
                    </Button>
                ]}
                >
      <Form onSubmit={this.handleSubmit} className='login-form'>
        <FormItem>
          {getFieldDecorator('baselineName', {
            rules: [{ required: true, message: 'Please input Baseline Name!' }],
          })(
            <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='Baseline Name' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('requiredBaseline', {
            rules: [{ required: true, message: 'Please input Requiried Baselines!' }],
          })(
             <Select
                    mode='combobox'
                    style={{ width: '100%' }}
                    placeholder='Please select'
                    allowClear='true'
                    onChange={this.handleChangeRequiredBaselineOnCreate}
                >
                    {baselines}
             </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('additionalBaseline', {
            rules: [{ required: true, message: 'Please input Additional Baselines!' }],
          })(
             <Select
                    mode='multiple'
                    style={{ width: '100%' }}
                    placeholder='Please select'
                    allowClear='true'
                    onChange={this.handleChangeAdditionalBaselineOnCreate}
                >
                    {optionalBaselines}
                </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className='login-form-forgot' href=''>Forgot password</a>
         
          Or <a href=''>register now!</a>
        </FormItem>
      </Form>
      </Modal>
    );
  }
}

const WrappedTestForm = Form.create()(TestForm);

export default WrappedTestForm