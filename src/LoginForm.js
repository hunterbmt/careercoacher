import { Form, Icon, Checkbox, Button, Input } from 'antd'
import React, { } from 'react'
import _ from 'lodash'
const FormItem = Form.Item

const LoginForm = Form.create()(
  (props) => {
    const { form, handleSubmit, handleCheckUSerName } = props
    const { getFieldDecorator } = form
    return (
      <Form onSubmit={handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' },{ validator : handleCheckUSerName }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
    )
  }
)

export default LoginForm