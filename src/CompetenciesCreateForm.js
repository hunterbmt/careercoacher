import { Form, Modal, Select, Input } from 'antd';
import React, { Component } from 'react';
const FormItem = Form.Item;
const Option = Select.Option;

const CompetenciesCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new competency"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Competency name">
            {getFieldDecorator('competencyName', {
              rules: [{ required: true, message: 'Please input competency name!' }]}
            )(
              <Input />
            )}
          </FormItem>
         <FormItem label="Option">
          {getFieldDecorator('competencyOption', {
            rules: [{ required: true, message: 'Please select your option!' }],
          })(
            <Select placeholder="Select a option">
              <Option value="Kms_core">KMS Core</Option>
              <Option value="Kms_optional">KMS Optional</Option>
            </Select>
          )}
        </FormItem>
        </Form>
      </Modal>
    );
  }
);

export default CompetenciesCreateForm