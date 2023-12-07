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
          <Form.Item label="Redis Port" name="redis_port" rules={[...rules.required]}>
            <Input placeholder="Redis Port" type='number' name="redis_port"/>
          </Form.Item>
          <Form.Item label="Tên đơn vị" name="name" rules={[...rules.required]}>
            <Input placeholder="Tên đơn vị" name="name"/>
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[...rules.required]}>
            <Input placeholder="Email" name="email"/>
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[...rules.required]}>
            <Input placeholder="Số điện thoại" name="phone"/>
          </Form.Item>
          <Form.Item label="Telegram ID" name="telegram_id" rules={[...rules.required]}>
            <Input placeholder="Telegram ID" name="telegram_id"/>
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Địa chỉ" name="address"/>
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
