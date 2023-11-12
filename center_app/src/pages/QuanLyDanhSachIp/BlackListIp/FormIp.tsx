/* eslint-disable no-underscore-dangle */
import { IBlackListIpRecord } from '@/models/blacklistip';
import { Form, Input, Button, Card, Select, Spin, InputNumber, Col, Row, Tabs, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import rules from '@/utils/rules';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const FormIp = () => {
  const [form] = Form.useForm();
  const blacklistip = useModel('blacklistip');
  const [dataDevice, setDataDevice] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [listBlackDevice, setListBlackDevice] = useState<any[]>([])
  const pathname = window.location.pathname;
  const arrPath = pathname.split('/');
  
  useEffect(() => {
    blacklistip.getData();
  }, []);
  const handleFinish = async (values: IBlackListIpRecord) => {
    if (blacklistip?.edit) {
      const response = await blacklistip.upd({
        ...(blacklistip?.record ?? {}),
        ...values,
      });
    } else {
      const response = await blacklistip.addBlackDevice(values);
    }
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setListBlackDevice(selectedRows)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'url',
    },
  ];
  const handleAdd = async () => {
    const listId: string[] = [];
    const listBlacklistip: string[] = [];
    console.log(arrPath);
    listBlackDevice?.map((val: any) => {
      listId.push(arrPath?.[2]);
      listBlacklistip.push(val.id)
      console.log("val", val);
    })
    console.log(listBlacklistip);
    const res = blacklistip.addBlackDevice({ id: listId, blacklistip: listBlacklistip })
    if (res) {
      message.success('Thêm thành công!')
      blacklistip.getData()
    }
  }
  return (
    <Spin spinning={blacklistip.loading}>
      <Tabs defaultActiveKey="1">
        {(!blacklistip.edit && arrPath[1] == 'device' ) && <Tabs.TabPane tab="Thêm từ thiết bị có sẵn" key="1">
          <>
            <Table rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }} dataSource={dataDevice?.map((val: any, i: any) => { return { ...val, key: i + 1 } })} columns={columns} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" onClick={() => handleAdd()}>Thêm mới</Button>
            </div>
            </>
        </Tabs.TabPane>}

        <Tabs.TabPane tab={blacklistip.edit ? 'Chỉnh sửa' : 'Thêm mới'} key={arrPath[1] == 'device' ? 2 : 1}>
          {/* <Card title={blacklistip.edit ? 'Chỉnh sửa' : 'Thêm mới'}> */}
          <Form
            {...layout}
            form={form}
            onFinish={handleFinish}
            initialValues={{
              ...(blacklistip?.record ?? {}),
            }}
          >
            <Form.Item label="IP" name="ip" rules={[...rules.required, ...rules.dinhDangIP]}>
              <Input placeholder="IP..." />
            </Form.Item>
            <Form.Item label="Url" name="url">
              <Input placeholder="Url..." />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                {blacklistip.edit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Form.Item>
          </Form>
          {/* </Card> */}
        </Tabs.TabPane>

      </Tabs>

    </Spin>
  );
};

export default FormIp;
