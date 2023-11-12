/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from "@/components/Table";
import { IMenuRecord } from "@/models/menus";
import { IColumn } from "@/utils/interfaces";
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Divider, Popconfirm, Typography } from "antd";
import moment from 'moment';
import React, { useRef } from "react";
import { useModel } from "umi";
import FormMenu from "./FormMenu";

const Index = () => {
  const menusModel = useModel('menus');

  const handleEdit = (record: IMenuRecord) => {
    menusModel.setVisibleForm(true);
    menusModel.setEdit(true);
    menusModel.setRecord(record);
  }

  const handleDel = async (record: IMenuRecord) => {
    await menusModel.del(record?.id ?? '');
  }

  const renderLast = (value: any, record: IMenuRecord) => (
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
        <Button
          type="danger"
          shape="circle"
          icon={<DeleteOutlined />}
          title="Xóa"
        />
      </Popconfirm>
    </React.Fragment>
  )
  const columns: IColumn<IMenuRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên menu',
      dataIndex: 'name',
      width: 300,
      align: 'center',
    },
    {
      title: 'Mã menu',
      dataIndex: 'code',
      width: 300,
      align: 'center',
    },
    {
      title: 'Mã menu cha',
      dataIndex: 'code_parent',
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (value: any, record: IMenuRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ]

  return (
    <>
      <TableBase
        modelName={'menus'}
        title="Quản lý danh sách người dùng"
        columns={columns}
        hascreate={true}
        formType={'Drawer'}
        dependencies={[menusModel.page, menusModel.limit, menusModel.condition]}
        widthDrawer={800}
        getData={menusModel.getData}
        Form={FormMenu}
        noCleanUp={true}
        params={{
          page: menusModel.page,
          limit: menusModel.limit,
          condition: menusModel.condition,
        }}
        maskCloseableForm={true}
        otherProps={{
          scroll: {
            x: 1200,
          }
        }}
      />
    </>
  );
};

export default Index;
