import { Form, Modal, Select } from 'antd'
import React, { } from 'react'
import _ from 'lodash'
const FormItem = Form.Item


const CustomCompetenciesForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, onChangeOption, optionalCompetency } = props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        title="Create a new custom competency"
        okText="Save"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Custom competency:">
            {getFieldDecorator('customCompetency', {
              rules: [{ required: true, message: 'Please select your option!' }]
            })(
              <Select placeholder="Select competency" onChange={onChangeOption}>
               {optionalCompetency}
              </Select>
              )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
)

export default CustomCompetenciesForm