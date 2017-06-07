import { Form, Modal, Input, Switch, Icon } from 'antd'
import Loading from './Loading'
import React, { } from 'react'
const FormItem = Form.Item


const EditCompetencies = Form.create()(
    (props) => {
        const { visibleEdit, onCancelEdit, onEdit, form, handleCheckCompetency, competencyName, activate, loadingActivated } = props
        const { getFieldDecorator } = form
        return (
            <Modal
                visible={visibleEdit}
                title="Edit Competency KMS Core"
                okText="Edit"
                onCancel={onCancelEdit}
                onOk={onEdit}
            >
                {
                    loadingActivated ?
                        <Loading />
                        :
                        <Form layout="vertical">
                            <FormItem label="Competency name">
                                {getFieldDecorator('competencyName', {
                                    rules: [{ required: true, message: 'Please input competency name!' }, { validator: handleCheckCompetency }], initialValue: competencyName
                                }
                                )(
                                    <Input />
                                    )}
                            </FormItem>
                            <FormItem label="activate">
                                {getFieldDecorator('activate', { initialValue: activate })(<Switch defaultChecked={activate} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />)}
                            </FormItem>
                        </Form>
                }
            </Modal>
        )
    }
)

export default EditCompetencies