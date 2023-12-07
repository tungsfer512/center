import {
  ArrowLeftOutlined, CloseOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Drawer,
  Image,
  Tag,
} from 'antd';
import moment from 'moment';
import Animate from 'rc-animate';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import AlertSelection from './AlertSelection';
// import DashboardDonVi from './DashBoardDonVi';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import TableBase from '@/components/Table';
import FormDonVi from './FormDonVi';

const { TabPane } = Tabs;
moment.locale('vi');

const Device = ({ }) => {
  // const { socket, initSocket } = useModel('socket');
  const donviModel = useModel('donvi');
  const name = donviModel?.record?.name ?? '';
  const recordDevice = donviModel?.record ?? {};
  const pathname = window.location.pathname;
  const recordId = pathname.split('/')[2];

  const onClose = () => {
    donviModel.setVisibleForm(false);
  };

  const handleEdit = () => {
    donviModel.setEdit(true);
    donviModel.setVisibleForm(true)
  };

  useEffect(() => {
    if (!donviModel?.record?.id)
      donviModel.getDataById(recordId);
  }), [];

  // console.log(donviModel?.listTrackIp, 'socket');
  return (
    <div>
      <Card>
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => {
              history.back();
            }}
          >
            <b style={{ cursor: 'pointer' }}>
              <ArrowLeftOutlined />
              Quay lại
            </b>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>Đơn vị: {name}</b>
          </Breadcrumb.Item>
        </Breadcrumb>
        <br />
        <div>
          <Button
            type="primary"
            htmlType="button"
            onClick={handleEdit}
          >
            Chỉnh sửa thông tin
          </Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <Image src={recordDevice?.avatar ?? ''} style={{ width: '100%', maxWidth: 400, margin: '16px auto' }} />
            <br />
            <Descriptions bordered style={{ flexGrow: 1, marginTop: 16 }} column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Ip">
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.ip ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Redis Port" span={2}>
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.redis_port ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Tên đơn vị">
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.name ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" >
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.address ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Email" >
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.email ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={2}>
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.phone ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Telegram ID">
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.telegram_id ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                <Animate showProp="show" transitionName="fade">
                  <div className="code-box-shape">
                    {recordDevice?.created ?? ''}
                  </div>
                </Animate>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div style={{ marginTop: '24px' }}>
            {/* <DashboardDonVi /> */}
          </div>
          <Drawer title="Cập nhập" width={720} onClose={onClose} open={donviModel.visibleForm} >
            <FormDonVi />
            <CloseOutlined
              onClick={() => {
                donviModel.setVisibleForm(false);
              }}
              style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }}
            />
          </Drawer>
        </div>
      </Card>
    </div>
  );
};

export default Device;
