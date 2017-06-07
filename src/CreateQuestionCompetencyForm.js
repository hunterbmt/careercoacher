import { Form, Modal, Select, Input } from 'antd'
import React, { } from 'react'
import _ from 'lodash'
const FormItem = Form.Item
const Option = Select.Option

const CompetenciesCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, onChangeOption, option } = props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        title="Create a new question"
        okText="Save"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Question type:">
            {getFieldDecorator('questionOption', {
              rules: [{ required: true, message: 'Please select your option!' }]
            })(
              <Select placeholder="Select a option" onChange={onChangeOption}>
                <Option value="scale">Scale</Option>
                <Option value="option">Option</Option>
                <Option value="freetext">freetext</Option>
                <Option value="switch">Switch</Option>
              </Select>
              )}
          </FormItem>
          <FormItem label="question">
            {getFieldDecorator('question', {
              rules: [{ required: true, message: 'Please input question!' }],
            })(
              <Input type="textarea" />
              )}
          </FormItem>
          <FormItem label="Hint question">
            {getFieldDecorator('hintQuestion')(
              <Input type="textarea" />
              )}
          </FormItem>
          {
           _.isEqual(option,'option')?
           <div>
           <FormItem label="First answer">
            {getFieldDecorator('answer1', {
              rules: [{ required: true, message: 'Please input first answer!' }],
            })(
              <Input type="textarea" />
              )}
          </FormItem>
          <FormItem label="Second answer">
            {getFieldDecorator('answer2', {
              rules: [{ required: true, message: 'Please input second answer!' }],
            })(
              <Input type="textarea" />
              )}
          </FormItem>
          <FormItem label="Third answer">
            {getFieldDecorator('answer3', {
              rules: [{ required: true, message: 'Please input third answer!' }],
            })(
              <Input type="textarea" />
              )}
          </FormItem>
          <FormItem label="Fourth answer">
            {getFieldDecorator('answer4', {
              rules: [{ required: true, message: 'Please input fourth answer!' }],
            })(
              <Input type="textarea" />
              )}
          </FormItem>
          <FormItem label="Fifth answer">
            {getFieldDecorator('answer5')(<Input type="textarea" />)}
          </FormItem>
          </div>
          :
          null
           
          }
          
        </Form>
      </Modal>
    )
  }
)

export default CompetenciesCreateForm