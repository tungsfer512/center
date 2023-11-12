/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
import TableBase from "@/components/Table";
import type { IBlackListIpRecord } from "@/models/blacklistip";
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Divider, Popconfirm, Checkbox, message } from "antd";
import React, { useRef, useEffect, useState } from "react";
import { useModel } from "umi";
import FormIp from "./FormIp";

const Index = (props) => {
  const blacklistip = useModel('blacklistip');
  const pathname = window.location.pathname;
  const arrPath = pathname.split('/');
  const handleEdit = (record: IBlackListIpRecord) => {
    blacklistip.setVisibleForm(true);
    blacklistip.setRecord(record);
    blacklistip.setEdit(true);
  }

  const handleDel = async (record: IBlackListIpRecord) => {
    await blacklistip.del(record?.id ?? '');
    blacklistip.getData();
  }

  const handleDelAll = async () => {
    await blacklistip.del_all();
  }

  const renderLast = (value: any, record: IBlackListIpRecord) => (
    <React.Fragment>
      {/* <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        disabled={arrPath?.[2] !== '1'}
        title="Chỉnh sửa"
        onClick={() => handleEdit(record)}
      />  */}
      <Divider type="vertical" />
      <Popconfirm
        title="Bạn có muốn xóa?"
        okText="Có"
        cancelText="Không"
        onConfirm={async () => {
          handleDel(record);
        }}
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
  const columns: ProColumns<IBlackListIpRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      hideInSearch: false,
      width: 200,
      align: 'center',
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'url',
      hideInSearch: false,
      width: 300,
      align: 'center',
    },
    // arrPath?.[1] !== 'device' && {
    //   title: 'Thao tác',
    //   hideInSearch: true,
    //   align: 'center',
    //   render: (value: any, record: IBlackListIpRecord) => renderLast(value, record),
    //   fixed: 'right',
    //   width: 200,
    // },
    {
      title: 'Thao tác',
      hideInSearch: true,
      align: 'center',
      render: (value: any, record: IBlackListIpRecord) => renderLast(value, record),
      fixed: 'right',
      width: 200,
    },
  ]

  const rowSelection = {
    onChange: (selected: React.Key[], selectedRows: DataType[]) => {
      if (selectedRows.length === 0) {
        props.selectedRowKeys([]);
      }
    },
    selectedRowKeys: props.listIP,
    renderCell: (checked, record, index, _) => {
      return <Checkbox onChange={e => {
        console.log(record);
        let tmp = props.listIP;
        if (!e.target.checked) {
          tmp = tmp.filter(item => item !== record?.key);
          props.selectedRowKeys(tmp);
        } else {
          tmp = tmp.concat(record?.key);
          props.selectedRowKeys(tmp);
        }
      }} checked={checked} />
    }
  };

  return (
    <>
      <TableBase
        modelName={'blacklistip'}
        title="Quản lý danh sách ip bị chặn"
        columns={columns}
        hascreate={true}
        formType={'Drawer'}
        dependencies={[blacklistip.page, blacklistip.limit, blacklistip.condition]}
        widthDrawer={800}
        getData={blacklistip.getData}
        Form={FormIp}
        noCleanUp={true}
        params={{
          page: blacklistip.page,
          limit: blacklistip.limit,
          condition: blacklistip.condition,
        }}
        maskCloseableForm={true}
        otherProps={{
          scroll: {
            x: 1000,
          }
        }}
      >
        <Button type="primary" onClick={handleDelAll} style={{ marginBottom: 10}}>Xóa tất cả</Button>
        <Divider type="vertical" style={{ marginLeft: 15, marginRight:15 }}/>
      </TableBase>
    </>
  );
};

export default Index;
