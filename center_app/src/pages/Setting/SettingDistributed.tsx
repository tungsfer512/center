import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Spin,
} from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import Typography from 'antd/lib/typography/Typography';

const SettingAgent = () => {
  const setting_distributed = useModel('setting_distributed');
  const [visible, setVisible] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setting_distributed.getData();
  }, []);

  const handleEdit = () => {
    setVisible(true);
    console.log(setting_distributed.data);
    form.setFieldsValue(setting_distributed.data);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setting_distributed.updateData(values).then(() => {
      setting_distributed.getData();
      setVisible(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Card>
        <Title level={3}>Thông tin cấu hình</Title>
        <Button
          type="primary"
          htmlType="button"
          className={styles.itemFormButton}
          onClick={handleEdit}
        >
          Cập nhập thông tin
        </Button>
        <Descriptions bordered column={1} style={{ marginTop: 16 }}>
          <Descriptions.Item label="Email gửi thông tin">
            {setting_distributed?.data?.sender_email}
          </Descriptions.Item>
          <Descriptions.Item label="Password của email gửi thông tin">
            {setting_distributed?.data?.sender_app_password}
          </Descriptions.Item>
          <Descriptions.Item label="Mã vùng số điện thoại gửi thông tin">
            {setting_distributed?.data?.sender_phone_prefix}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại gửi thông tin">
            {setting_distributed?.data?.sender_phone}
          </Descriptions.Item>
          <Descriptions.Item label="Mã vùng số điện thoại nhận thông tin">
            {setting_distributed?.data?.receiver_phone_prefix}
          </Descriptions.Item>
          <Descriptions.Item label="Mã tài khoản SMS">
            {setting_distributed?.data?.twilio_account_sid}
          </Descriptions.Item>
          <Descriptions.Item label="Mã xác thực SMS">
            {setting_distributed?.data?.twilio_auth_token}
          </Descriptions.Item>
          <Descriptions.Item label="Telegram Bot API Token">
            {setting_distributed?.data?.tele_bot_api_token}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian chờ gửi email">
            {setting_distributed?.data?.time_mail}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian chờ gửi sms">
            {setting_distributed?.data?.time_sms}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian chờ gửi tin nhắn Telegram">
            {setting_distributed?.data?.time_tele}
          </Descriptions.Item>

        </Descriptions>
      </Card>

      <Drawer title="Cập nhập" width={800} onClose={onClose} open={visible}>
        <Title level={3}>Chỉnh sửa thông tin</Title>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={setting_distributed.data}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Email" name="sender_email">
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="sender_app_password">
            <Input />
          </Form.Item>

          <Form.Item label="Mã vùng số điện thoại gửi thông tin" name="sender_phone_prefix">
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại gửi thông tin" name="sender_phone">
            <Input />
          </Form.Item>
          <Form.Item label="Mã vùng số điện thoại nhận thông tin" name="receiver_phone_prefix">
          <Input />
          </Form.Item>
          <Form.Item label="Mã tài khoản" name="twilio_account_sid">
          <Input />
          </Form.Item>
          <Form.Item label="Mã xác thực" name="twilio_auth_token">
          <Input />
          </Form.Item>
          <Form.Item label="Thời gian chờ gửi email" name="time_mail">
          <Input />
          </Form.Item>
          <Form.Item label="Thời gian chờ gửi sms" name="time_sms">
          <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={setting_distributed.loading[0]}>
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SettingAgent;
