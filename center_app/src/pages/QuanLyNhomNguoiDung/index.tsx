/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { IGroupRecord } from '@/models/groups';
import { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import FormGroup from './FormGroup';

const Index = () => {
  const groupModel = useModel('groups');

  const handleEdit = (record: IGroupRecord) => {
    groupModel.setVisibleForm(true);
    groupModel.setEdit(true);
    groupModel.setRecord(record);
  };

  const handleDel = async (record: IGroupRecord) => {
    await groupModel.del(record?.id ?? '');
  };

  const renderLast = (value: any, record: IGroupRecord) => (
    <React.Fragment>
      <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        title="Chỉnh sửa"
        onClick={() => handleEdit(record)}
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
  const columns: IColumn<IGroupRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên nhóm người dùng',
      dataIndex: 'name',
      search: 'search',
      notRegex: true,
      width: 200,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (value: any, record: IGroupRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ];

  return (
    <>
      <TableBase
        modelName={'groups'}
        title="Quản lý danh sách người dùng"
        columns={columns}
        hascreate={true}
        formType={'Drawer'}
        dependencies={[groupModel.page, groupModel.limit, groupModel.condition]}
        widthDrawer={800}
        getData={groupModel.getData}
        Form={FormGroup}
        noCleanUp={true}
        params={{
          page: groupModel.page,
          limit: groupModel.limit,
          condition: groupModel.condition,
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
