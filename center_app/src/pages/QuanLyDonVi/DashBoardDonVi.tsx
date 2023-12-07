import { useModel } from 'umi';
import { IDashboard } from '@/models/donvi';
import { Badge, Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ChartCard from './components/ChartCard';
import DemoLiquid from './components/DemoLiquid';
import DemoWordCloud from './components/DemoWordCount';
import GlobalChart from './components/GlobalChart';
import DemoPie from './components/PieChart';

const DashboardDonVi = () => {
  const [visibleThongKe, setVisibleThongKe] = useState(false);
  const dashboard = useModel('donvi');
  const dataDashboard: IDashboard = dashboard?.dataDashboard ?? null;
  // console.log(dataDashboard, 'dataDashboard');
  const dataIPS = dashboard?.dataIPS??[];
  const pathname = window.location.pathname;
  const recordId = pathname.split('/')[2];
  // useEffect(() => {
  //   // dashboard.getAllDeviceDonVi({id: recordId})
  //   dashboard.getDataDashboard({id: recordId});
  //   // dashboard.getIPSData({id: recordId});
  // }, []);

  return (
    <Spin spinning={dashboard?.loading || false}>
      <Row>
         <Col xs={24} md={12}>
          <Card title="Tài nguyên RAM máy chủ">
            <DemoLiquid value={dataDashboard?.RAM} title="RAM" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tài nguyên CPU máy chủ">
            <DemoLiquid value={dataDashboard?.CPU} title="CPU" />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default DashboardDonVi;
