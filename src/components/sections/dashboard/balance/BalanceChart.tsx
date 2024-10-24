import { useMemo } from 'react';
import { SxProps} from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

interface BalanceChartProps {
  data: { min: number[]; max: number[] };
  sx?: SxProps;
}

const BalanceChart = ({ data, ...rest }: BalanceChartProps) => {
  const option = useMemo(() => {
    // Ensure min and max arrays have the same length
    const length = Math.max(data.min.length, data.max.length);
    const minData = Array(length).fill(0);
    const maxData = Array(length).fill(0);

    // Populate minData and maxData
    for (let i = 0; i < length; i++) {
      minData[i] = data.min[i] || 0; // Default to 0 if undefined
      maxData[i] = data.max[i] || 0; // Default to 0 if undefined
    }

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: { name: string; data: number }[]) => {
          return `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
              <strong>${params[0].name}</strong><br />
              <span>Max Price:</span> 
              <span style="font-weight: bold;">₹${params[0].data.toFixed(2)}</span><br />
              <span>Min Price:</span> 
              <span style="font-weight: bold;">₹${params[1].data.toFixed(2)}</span><br />
            </div>
          `;
        },
      },
      grid: {
        top: 40,
        bottom: 20,
        left: 8,
        right: 10,
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          show: true,
        },
        boundaryGap: 0,
      },
      yAxis: {
        type: 'value',
        min: Math.min(...minData) - 10,
        max: Math.max(...maxData) + 10,
        axisLabel: {
          show: true,
        },
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          name: 'Max Price',
          data: maxData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: 'rgba(84, 112, 198, 1)',
            width: 3,
          },
          areaStyle: {
            color: 'rgba(84, 112, 198, 0.5)',
          },
        },
        {
          name: 'Min Price',
          data: minData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: 'rgba(255, 99, 132, 1)',
            width: 3,
          },
          areaStyle: {
            color: 'rgba(255, 99, 132, 0.5)',
          },
        },
      ],
    };
  }, [data]);

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default BalanceChart;
