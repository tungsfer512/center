/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IDonViRecord } from '@/models/donvi';
import { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popconfirm } from 'antd';
import React from 'react';
import { useModel, history } from 'umi';
import FormDonVi from './FormDonVi';
import DistributionGraph from './components/DistributionGraph';

const Index = () => {
  const donviModel = useModel('donvi');

  const handleEdit = (record: IDonViRecord) => {
    donviModel.setVisibleForm(true);
    donviModel.setEdit(true);
    donviModel.setRecord(record);
  };

  const handleDel = async (record: IDonViRecord) => {
    await donviModel.del(record?.id ?? '').then(() => {
      donviModel.getData();
    });
  };

  const renderLast = (value: any, record: IDonViRecord) => (
    <React.Fragment>
      <Button
        type="primary"
        shape="circle"
        icon={<EyeOutlined />}
        title="Xem chi tiết"
        onClick={() => {
          console.log(record, 'record');
          donviModel.setRecord(record);
          history.push(`/don-vi/${record.id}`);
        }}
      />
      <Divider type="vertical" />
      <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        title="Chỉnh sửa"
        onClick={() => {
          console.log(record, 'record');
          handleEdit(record)
        }}
      />
      <Divider type="vertical" />
      <Popconfirm
        title="Bạn có muốn xóa?"
        okText="Có"
        cancelText="Không"
        onConfirm={() => handleDel(record)}
      >
        <Button type="danger" shape="circle" icon={<DeleteOutlined />} title="Xóa" />
      </Popconfirm>
    </React.Fragment>
  );
  const columns: IColumn<IDonViRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'avatar',
      notRegex: true,
      width: 200,
      align: 'center',
      render: (value: any, record: IDonViRecord) => (
        <img src={record.avatar} alt={record.name} style={{ width: 100, height: 100 }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Telegram ID',
      dataIndex: 'telegram_id',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Protocol',
      dataIndex: 'protocol',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Mac Address',
      dataIndex: 'mac_addr',
      search: 'search',
      render: (value: any, record: IDonViRecord) => <span>{record.mac_addr === null ? '' : record.mac_addr}</span>,
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value: any, record: IDonViRecord) => (
        <span>{record.status === true ? 'Hoạt động' : 'Không hoạt động'}</span>
      ),
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (value: any, record: IDonViRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ];

  return (
    <>
    <Card title="Sơ đồ phân tải hệ thống" style={{ marginBottom: 20 }}>
      <DistributionGraph />
    </Card>
      <TableBase
        modelName={'donvi'}
        title="Quản lý danh sách đơn vị"
        columns={columns}
        hascreate={true}
        formType={'Drawer'}
        dependencies={[donviModel.page, donviModel.limit, donviModel.condition]}
        widthDrawer={800}
        getData={donviModel.getData}
        Form={FormDonVi}
        noCleanUp={true}
        params={{
          page: donviModel.page,
          limit: donviModel.limit,
          condition: donviModel.condition,
        }}
        maskCloseableForm={true}
        otherProps={{
          scroll: {
            x: 1000,
          },
        }}
      />
    </>
  );
};

export default Index;
