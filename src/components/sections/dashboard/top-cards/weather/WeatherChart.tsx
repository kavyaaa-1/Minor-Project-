import { useMemo } from 'react';
import { SxProps, useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TooltipComponent, GridComponent, AxisPointerComponent, CanvasRenderer]);

interface WeatherChartProps {
  data: number[]; // Weekly temperature data
  sx?: SxProps;
}

const WeatherChart = ({ data, ...rest }: WeatherChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}°C', // Display temperature with °C suffix
      },
      grid: {
        top: '7%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Days of the week
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
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
          min: Math.min(...data) - 5,
          max: Math.max(...data) + 3,
          axisLabel: {
            show: true,
            formatter: '{value}°C', 
          },
          splitLine: {
            show: true,
          },
        },
      ],
      series: [
        {
          name: 'Temperature',
          type: 'bar',
          barWidth: '35%',
          data,
          itemStyle: {
            color: theme.palette.warning.main,
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
    [theme, data]
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default WeatherChart;
