import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Divider, Drawer, Form, Input, Popconfirm, Spin, Table } from 'antd';
import { useModel, history } from 'umi';
import styles from './index.less';
import Title from 'antd/lib/typography/Title';
import Typography from 'antd/lib/typography/Typography';
import TableBase from '@/components/Table';
import FormWhitelistSrc from './FormWhitelistSrc';
import { ISrc } from '@/models/whitelist_srcs';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

const SettingWhiteList = () => {
  const setting = useModel('setting');
  const whitelist_srcs = useModel('whitelist_srcs');
  const [visible, setVisible] = React.useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setting.getAutoWhitelist();
    setting.getSrcsWhitelist();
  }, []);


  const handleEdit = () => {
    if (setting.timeWhitelist == -1) {
      form.setFieldsValue({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
    setVisible(true);
  };

  const handleUpdate = () => {
    setting.getAutoWhitelistClick();
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    const { days, hours, minutes, seconds } = values;
    console.log(Number(days) * 24 * 60 * 60 + Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds));
    setting
      .updateAutoWhitelist(Number(days) * 24 * 60 * 60 + Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds))
      .then(() => {
        setting.getAutoWhitelist();
        setting.getAutoWhitelist();
        setVisible(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleStopWhitelist = () => {
    setting.stopWhitelist().then(() => {
      setting.getAutoWhitelist();
      setting.getAutoWhitelist();
      setVisible(false);
    });
  };

  // const handleEditSrc = (record: ISrc) => {
  //   whitelist_srcs.setRecord(record);
  //   whitelist_srcs.setVisibleForm(true);
  //   whitelist_srcs.setEdit(true);
  // };

  // const handleDelSrc = async (record: ISrc) => {
  //   await whitelist_srcs.del(record?.id ?? '').then(() => {
  //     whitelist_srcs.getData();
  //   });
  // };

  return (
    <>
      <Card>
        <Title level={3}>Cài đặt phân tải</Title>
        <Typography className={styles.itemForm}>
          {' '}
          {setting.timeWhitelist !== -1 ? 'Đang chạy' : 'Đang tạm dừng'}
        </Typography>

        <Button
          type="primary"
          htmlType="button"
          className={styles.itemFormButton}
          onClick={handleEdit}
        >
          Thiết lập thuật toán phân tải
        </Button>
      </Card>

      <Card>
        <TableBase
          columns={[
            {
              title: 'STT',
              dataIndex: 'index',
              width: 80,
              align: 'center',
            },
            {
              title: 'Đường dẫn',
              dataIndex: 'url',
              width: 200,
              align: 'center',
            },
            {
              title: 'Định dạng file',
              dataIndex: 'file_type',
              width: 150,
              align: 'center',
            },
            {
              title: 'Loại nguồn',
              dataIndex: 'src_type',
              width: 150,
              align: 'center',
            }
          ]}
          modelName={'whitelist_srcs'}
          title="Danh sách đơn vị và trọng số phân tải"
          hascreate={false}
          formType={'Drawer'}
          dependencies={[whitelist_srcs.page, whitelist_srcs.limit, whitelist_srcs.condition]}
          widthDrawer={800}
          getData={whitelist_srcs.getData}
          Form={FormWhitelistSrc}
          noCleanUp={true}
          params={{
            page: whitelist_srcs.page,
            limit: whitelist_srcs.limit,
            condition: whitelist_srcs.condition,
          }}
          maskCloseableForm={true}
          otherProps={{
            scroll: {
              x: 1000,
            },
          }}
        />
      </Card>

      <Drawer title="Cập nhập" width={720} onClose={onClose} open={visible}>
        <Form
          name="basic"
          form={form}
          className={styles.formNmap}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={
            setting.dataAutoWhitelist
          }
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Ngày"
            name="days"
            rules={[{ required: false, message: 'Nhập số ngày!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giờ"
            name="hours"
            rules={[{ required: false, message: 'Nhập số giờ!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phút"
            name="minutes"
            rules={[{ required: false, message: 'Nhập số phút!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giây"
            name="seconds"
            rules={[{ required: false, message: 'Nhập số giây!' }]}
            className={styles.itemForm}
          >
            <Input />
          </Form.Item>

          <Form.Item className={styles.itemForm}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.itemFormButton}
              loading={setting.loading[1]}
            >
              Cập nhập
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SettingWhiteList;
