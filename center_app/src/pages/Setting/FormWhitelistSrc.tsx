/* eslint-disable no-underscore-dangle */
import { ISrc } from '@/models/whitelist_srcs';
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

const FormWhitelistSrc = () => {
  const [form] = Form.useForm();
  const [src, setSrc] = useState<string>('github');
  const whitelist_srcs = useModel('whitelist_srcs');
  
  const handleFinish = async (values: ISrc) => {
    if (whitelist_srcs.edit) {
      if (whitelist_srcs?.record?.id) {
        console.log(whitelist_srcs?.record, 'whitelist_srcs?.record');
        
        const data = {...values, src_type: src}
        await whitelist_srcs.upd({id: whitelist_srcs?.record?.id, data: data});
        // await whitelist_srcs.upd({
        //   ...whitelist_srcs?.record,
        //   ...values,
        //   id: whitelist_srcs?.record?.id,
        // });
        whitelist_srcs.setVisibleForm(false);
        whitelist_srcs.setEdit(false);
        whitelist_srcs.getData();
      } else {
        const data = {...values, src_type: src}
        await whitelist_srcs.add(data);
      }
    } else {
        const data = {...values, src_type: src}
        await whitelist_srcs.add(data);
        whitelist_srcs.setVisibleForm(false);
        whitelist_srcs.setEdit(false);
        whitelist_srcs.getData();
    }
  };
  console.log(form.getFieldsValue(), 'form.getFieldValue()');
  return (
    <Spin spinning={whitelist_srcs.loading}>
      <Card title={whitelist_srcs.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          id='formDonVi'
          {...layout}
          form={form}
          onFinish={handleFinish}
          initialValues={{
            ...(whitelist_srcs?.record ?? {}),
          }}
        >
          <Form.Item label="Đường dẫn" name="url" rules={[...rules.required]}>
            <Input placeholder="Đường dẫn" name='url' />
          </Form.Item>
          <Form.Item label="Định dạng file" name="file_type" rules={[...rules.required]}>
            <Input placeholder="Định dạng file" type='file_type' name="port"/>
          </Form.Item>
          <Form.Item label="Loại nguồn" name="src_type">
            <Select defaultValue={'github'} onChange={(value) => setSrc(value)}>
              <Select.Option value={'github'}>Github</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {whitelist_srcs.edit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default FormWhitelistSrc;
