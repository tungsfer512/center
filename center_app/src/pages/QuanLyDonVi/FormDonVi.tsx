/* eslint-disable no-underscore-dangle */
import { IDonViRecord } from '@/models/donvi';
import rules from '@/utils/rules';
import { Form, Input, Button, Card, Spin, DatePicker, InputNumber, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormDonVi = () => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState<boolean>(false);
  const donviModel = useModel('donvi');
  
  const handleFinish = async (values: IDonViRecord) => {
    if (donviModel.edit) {
      if (donviModel?.record?.id) {
        const data = document.getElementById('formDonVi') as HTMLFormElement;
        const formData = new FormData(data);
        formData.append('status', status===true?'true':'false');
        await donviModel.upd({id: donviModel?.record?.id, data: formData});
        // await donviModel.upd({
        //   ...donviModel?.record,
        //   ...values,
        //   id: donviModel?.record?.id,
        // });
        donviModel.setVisibleForm(false);
        donviModel.setEdit(false);
        donviModel.getDataById(donviModel?.record?.id);
      } else {
        const data = document.getElementById('formDonVi') as HTMLFormElement;
        const formData = new FormData(data);
        formData.append('status', status===true?'true':'false');
        await donviModel.add(formData);
      }
    } else {
      const data = document.getElementById('formDonVi') as HTMLFormElement;
        const formData = new FormData(data);
        formData.append('status', status===true?'true':'false');
        await donviModel.add(formData);
        donviModel.setVisibleForm(false);
        donviModel.setEdit(false);
    }
  };
  console.log(form.getFieldsValue(), 'form.getFieldValue()');
  return (
    <Spin spinning={donviModel.loading}>
      <Card title={donviModel.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          id='formDonVi'
          {...layout}
          form={form}
          onFinish={handleFinish}
          initialValues={{
            ...(donviModel?.record ?? {}),
          }}
        >
          <Form.Item label="Ip" name="ip" rules={[...rules.required]}>
            <Input placeholder="Ip" name='ip' />
          </Form.Item>
          <Form.Item label="Port" name="port" rules={[...rules.required]}>
            <Input placeholder="Port" type='number' name="port"/>
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[...rules.required]}>
            <Input placeholder="Name" name="name"/>
          </Form.Item>
          <Form.Item label="Domain" name="domain" rules={[...rules.required]}>
            <Input placeholder="Domain" name="domain"/>
          </Form.Item>
          <Form.Item label="Protocol" name="protocol" rules={[...rules.required]}>
            <Input placeholder="Protocol" name="protocol"/>
          </Form.Item>
          <Form.Item label="Username" name="username" rules={[...rules.required]}>
            <Input placeholder="Username" name="username"/>
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[...rules.required]}>
            <Input placeholder="Password" name="password"/>
          </Form.Item>
          <Form.Item label="Mac Address" name="mac_addr" rules={[...rules.required]}>
            <Input placeholder="Mac Address" name="mac_addr"/>
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[...rules.required]}>
            <Input placeholder="Email" name="email"/>
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[...rules.required]}>
            <Input placeholder="Phone" name="phone"/>
          </Form.Item>
          <Form.Item label="Telegram ID" name="telegram_id" rules={[...rules.required]}>
            <Input placeholder="Telegram ID" name="telegram_id"/>
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input placeholder="Address" name="address"/>
          </Form.Item>
          <Form.Item label="Trạng thái" name="status">
            <Select defaultValue={false} onChange={(value) => setStatus(value)}>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Avatar">
            <Input placeholder="Avatar" type='file' name="avatar"/>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {donviModel.edit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default FormDonVi;
