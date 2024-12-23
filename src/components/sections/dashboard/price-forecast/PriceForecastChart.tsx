// PriceForecastChart.tsx
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { SxProps, useTheme } from '@mui/material';
import { useMemo } from 'react';

echarts.use([BarChart, TooltipComponent, GridComponent, AxisPointerComponent, CanvasRenderer]);

interface PriceForecastChartProps {
  data: number[];
  labels: string[]; // Add labels as a prop
  sx?: SxProps;
}

const PriceForecastChart = ({ data, labels, ...rest }: PriceForecastChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: 'Modal Price: ₹{c}',
        axisPointer: {
          show: false,
        },
      },
      grid: {
        top: '10%',
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: labels, // Use labels from props
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            margin: 15,
            fontWeight: 500,
            color: theme.palette.text.disabled,
            fontSize: theme.typography.caption.fontSize,
            fontFamily: theme.typography.fontFamily,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 100,
          minInterval: 1,
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Spent',
          type: 'bar',
          barWidth: '60%',
          data,
          itemStyle: {
            color: theme.palette.info.dark,
            borderRadius: [10, 10, 10, 10],
          },
          emphasis: {
            itemStyle: {
              color: theme.palette.warning.main,
            },
          },
        },
      ],
    }),
    [theme, data, labels]
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default PriceForecastChart;
