import React from 'react'
import _ from 'lodash'
import { Modal, Input, Select, Form, Icon, Checkbox } from 'antd'
import './App.css'
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

export const EditProjectBaselineForm = Form.create()(
    
  (props) => {
    const { visible, onCancel, onEdit, form, projectBaselineCompetencies, selectedProjectBaselineCompetencies, handleChange, selectedBaseline } = props
    const { getFieldDecorator } = form
    return (
        <Modal
            visible={visible}
            title={'Edit '}
            okText='Save'
            onOk={onEdit}
            onCancel={onCancel}
        >
            <Form className='login-form'>
                <FormItem>
                    {getFieldDecorator('requiredBaseline', {
                        rules: [{ required: true, message: 'Please input Required Baseline!' }],
                    })(
                        <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder={selectedBaseline}  disabled='true' />
                        )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('projectBaselineComptencies', {
                        rules: [{ required: true, message: 'Please input Project Competencies!' }], initialValue:selectedProjectBaselineCompetencies
                    })(
                        <Select
                            mode='multiple'
                            style={{ width: '100%' }}
                            placeholder='Please select'
                            allowClear='true'
                            onChange={handleChange}
                        >
                            {projectBaselineCompetencies}
                        </Select>
                        )}
                </FormItem>
            </Form>
        </Modal>
    )
  }
)