import React from 'react'
import _ from 'lodash'
import { Modal, Input, Select, Form, Icon } from 'antd'
import './App.css'
const FormItem = Form.Item

export const CreateProjectBaselineForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, baselines, optionalBaselines, handleChangeRequiredBaselineOnCreate, handleChangeAdditionalBaselineOnCreate } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title='Create New Project Baseline'
        okText='Save'
        onOk={onCreate}
        onCancel={onCancel}
      >
        <Form className='login-form'>
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
                onChange={handleChangeRequiredBaselineOnCreate}
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
                onChange={handleChangeAdditionalBaselineOnCreate}
              > 
                {optionalBaselines}
              </Select>
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);