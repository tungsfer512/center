/* eslint-disable no-underscore-dangle */
import { IMenuRecord } from '@/models/menus';
import rules from '@/utils/rules';
import { Form, Input, Button, Card, Select, DatePicker, InputNumber, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormMenu = () => {
  const [form] = Form.useForm();
  const menusModel = useModel('menus');
  const handleFinish = async (values: IMenuRecord) => {
    if (menusModel.edit) {
      if (menusModel?.record?.id) {
        await menusModel.upd({
          ...menusModel?.record,
          ...values,
          id: menusModel?.record?.id,
        });
      } else {
        await menusModel.add(values);
      }
    } else {
      await menusModel.add(values);
    }
  };
  console.log(form.getFieldsValue(), 'form.getFieldValue()');
  return (
    <Card title={menusModel.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        {...layout}
        form={form}
        onFinish={handleFinish}
        initialValues={{
          ...(menusModel?.record ?? {}),
        }}
      >
        <Form.Item label="Tên menu" name="name" rules={[...rules.required]}>
          <Input placeholder="Tên menu" />
        </Form.Item>
        <Form.Item label="Mã menu" name="code" rules={[...rules.required]}>
          <Input placeholder="Mã menu" />
        </Form.Item>
        <Form.Item label="Mã menu cha" name="code_parent" rules={[...rules.required]}>
          <Input placeholder="Mã menu cha" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {menusModel.edit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormMenu;
