import React, { useState, useEffect, Fragment } from 'react';
import { Liquid } from '@ant-design/charts';

const DemoLiquid: React.FC = ({value, title}) => {
  // console.log('value', value);
  const config = {
    title: {
      visible: false,
      text: title??'',
    },
    min: 0,
    max: 100,
    value: Number(value??0)*100,
    statistic: { 
      htmlContent: (value: number) => {
        return (
          <Fragment>
            <p style={{ margin: 0, fontSize: 32, lineHeight: 1 }}>{value.toFixed(2)}%</p>
          </Fragment>
        );
      },
    },
    outline: {
      border: 4,
      distance: 8,
    },
    wave: { length: 128 },
  };
  return <Liquid {...config} />;
};

export default DemoLiquid;
