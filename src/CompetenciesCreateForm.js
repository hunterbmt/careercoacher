import { Form, Modal, Select, Input, Button } from 'antd';
import React, { Component } from 'react';
const FormItem = Form.Item;
const Option = Select.Option;

class CompetenciesCreateForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    handleSelectChange = (value) => {
        console.log(value);
        this.props.form.setFieldsValue({
            note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
                <Modal title="Create new compentency" visible={false}
                    onOk={this.handleSave} onCancel={this.handleCancel}>
                 <Form onSubmit={this.handleSubmit}>
                    <FormItem
                    label="Note"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                    label="Gender"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    >
                    {getFieldDecorator('gender', {
                        rules: [{ required: true, message: 'Please select your gender!' }],
                        onChange: this.handleSelectChange,
                    })(
                        <Select placeholder="Select a option and change input text above">
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        </Select>
                    )}
                    </FormItem>
                    <FormItem
                    wrapperCol={{ span: 8, offset: 4 }}
                    >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </FormItem>
                </Form>
                </Modal>
        );
    }
}

const WrappedCompetenciesCreateForm = Form.create()(CompetenciesCreateForm);

export default WrappedCompetenciesCreateForm