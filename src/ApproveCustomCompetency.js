import { Form, Select, Button } from 'antd'
import React, { } from 'react'
const FormItem = Form.Item

const ApproveCustomCompetency = Form.create()(
    (props) => {
        const { form, children, handleSubmit } = props
        const { getFieldDecorator } = form
        return (
            <Form  onSubmit={handleSubmit} layout="vertical">
                <FormItem label="Competency name">
                    {getFieldDecorator('competencyName', {
                        rules: [{ required: true, message: 'Please choose custom competency name!' }]
                    }
                    )(
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            tokenSeparators={[',']}
                        >
                            {children}
                        </Select>
                        )}
                </FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                   Approve
          </Button>
            </Form>
        )
    }
)

export default ApproveCustomCompetency