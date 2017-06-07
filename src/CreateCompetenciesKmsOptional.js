import { Form, Modal, Input } from 'antd'
import React, { } from 'react'
const FormItem = Form.Item


const CreateCompetenciesKmsOptional = Form.create()(
  (props) => {
    const { visibleKmsOptional, onCancelKmsOptional, onCreateKMSOptional, form, handleCheckUniqueCompetency } = props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visibleKmsOptional}
        title="Create a new competency"
        okText="Create"
        onCancel={onCancelKmsOptional}
        onOk={onCreateKMSOptional}
      >
        <Form layout="vertical">
          <FormItem label="Competency name">
            {getFieldDecorator('competencyName', {
              rules: [{ required: true, message: 'Please input competency name!' },{ validator : handleCheckUniqueCompetency }]}
            )(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
)

export default CreateCompetenciesKmsOptional