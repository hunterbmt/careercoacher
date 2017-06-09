import { Form, Modal, Input } from 'antd'
import React, { } from 'react'
const FormItem = Form.Item


const CreateCompetenciesKmsCore = Form.create()(
  (props) => {
    const { visibleKmsCore, onCancelKmsCore, onCreateKmsCore, form, handleCheckUniqueCompetency } = props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visibleKmsCore}
        title="Create a new competency"
        okText="Create"
        onCancel={onCancelKmsCore}
        onOk={onCreateKmsCore}
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

export default CreateCompetenciesKmsCore