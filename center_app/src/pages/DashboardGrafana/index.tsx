
import { Badge, Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { ip, DashboardBlank } from '../../utils/ip';

const Dashboard = () => {
  

  return (
    <div>
      <span Style="width: 335px;height: 40px;position: absolute;background-color: #181B1F;"></span>
      <span Style="width: 77px;height: 40px;position: absolute;background-color: #181B1F;right:0"></span>
      <iframe src={`${DashboardBlank}d/0000000295/demo-kc-center?orgId=1&refresh=5s&kiosk=tv`} width="100%" height="950" frameborder="0" ></iframe>
      {/* <iframe src={`http://192.168.10.162:7771/d/0000000295/demo-kc-center?orgId=1&refresh=5s&kiosk=tv`} width="100%" height="800" frameborder="0" ></iframe> */}
    </div>
    )
};

export default Dashboard;
