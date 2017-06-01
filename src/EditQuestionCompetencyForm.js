import { Form, Modal, Input } from 'antd'
import React, { } from 'react'
import _ from 'lodash'
const FormItem = Form.Item


const CompetenciesCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form, option, questionEdit, hintEdit, answer1Edit, answer2Edit, answer3Edit, answer4Edit, answer5Edit } = props
        const { getFieldDecorator } = form
        return (
            <Modal
                visible={visible}
                title="Edit question"
                okText="Save"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="question">
                        {getFieldDecorator('questionEdit', {
                            rules: [{ required: true, message: 'Please input question!' }],
                            initialValue: questionEdit
                        })(
                            <Input type="textarea" />
                            )}
                    </FormItem>
                    <FormItem label="Hint question">
                        {getFieldDecorator('hintQuestionEdit', { initialValue: hintEdit })(
                            <Input type="textarea" />
                        )}
                    </FormItem>
                    {
                        _.isEqual(option, 'option') ?
                            <div>
                                <FormItem label="First answer">
                                    {getFieldDecorator('answer1Edit', {
                                        rules: [{ required: true, message: 'Please input first answer!' }],
                                        initialValue: answer1Edit
                                    })(
                                        <Input type="textarea" />
                                        )}
                                </FormItem>
                                <FormItem label="Second answer">
                                    {getFieldDecorator('answer2Edit', {
                                        rules: [{ required: true, message: 'Please input second answer!' }],
                                        initialValue: answer2Edit
                                    })(
                                        <Input type="textarea" />
                                        )}
                                </FormItem>
                                <FormItem label="Third answer">
                                    {getFieldDecorator('answer3Edit', {
                                        rules: [{ required: true, message: 'Please input third answer!' }],
                                        initialValue: answer3Edit
                                    })(
                                        <Input type="textarea" />
                                        )}
                                </FormItem>
                                <FormItem label="Fourth answer">
                                    {getFieldDecorator('answer4Edit', {
                                        rules: [{ required: true, message: 'Please input fourth answer!' }],
                                        initialValue: answer4Edit
                                    })(
                                        <Input type="textarea" />
                                        )}
                                </FormItem>
                                <FormItem label="Fifth answer">
                                    {getFieldDecorator('answer5Edit', { initialValue: answer5Edit })(<Input type="textarea" />)}
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