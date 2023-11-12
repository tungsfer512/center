/* eslint-disable no-underscore-dangle */
import { ISrc } from '@/models/blacklist_srcs';
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

const FormBlacklistSrc = () => {
  const [form] = Form.useForm();
  const [src, setSrc] = useState<string>('github');
  const blacklist_srcs = useModel('blacklist_srcs');
  
  const handleFinish = async (values: ISrc) => {
    if (blacklist_srcs.edit) {
      if (blacklist_srcs?.record?.id) {
        console.log(blacklist_srcs?.record, 'blacklist_srcs?.record');
        
        const data = {...values, src_type: src}
        await blacklist_srcs.upd({id: blacklist_srcs?.record?.id, data: data});
        // await blacklist_srcs.upd({
        //   ...blacklist_srcs?.record,
        //   ...values,
        //   id: blacklist_srcs?.record?.id,
        // });
        blacklist_srcs.setVisibleForm(false);
        blacklist_srcs.setEdit(false);
        blacklist_srcs.getData();
      } else {
        const data = {...values, src_type: src}
        await blacklist_srcs.add(data);
      }
    } else {
        const data = {...values, src_type: src}
        await blacklist_srcs.add(data);
        blacklist_srcs.setVisibleForm(false);
        blacklist_srcs.setEdit(false);
        blacklist_srcs.getData();
    }
  };
  console.log(form.getFieldsValue(), 'form.getFieldValue()');
  return (
    <Spin spinning={blacklist_srcs.loading}>
      <Card title={blacklist_srcs.edit ? 'Chỉnh sửa' : 'Thêm mới'}>
        <Form
          id='formDonVi'
          {...layout}
          form={form}
          onFinish={handleFinish}
          initialValues={{
            ...(blacklist_srcs?.record ?? {}),
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
              {blacklist_srcs.edit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default FormBlacklistSrc;
