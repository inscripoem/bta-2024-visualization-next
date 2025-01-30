"use client"

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartsMapProps {
  data: { name: string; value: number }[];
}

export function EChartsMap({ data }: EChartsMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    // 动态加载省份地图数据
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(res => res.json())
      .then(geoJson => {
        echarts.registerMap('china', geoJson);
        
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}人'
          },
          visualMap: {
            left: 'left',
            min: 0,
            max: Math.max(...data.map(item => item.value)),
            text: ['高', '低'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['#e0f2fe', '#0369a1']
            }
          },
          series: [
            {
              name: '参与人数',
              type: 'map',
              map: 'china',
              emphasis: {
                label: {
                  show: true
                }
              },
              select: {
                disabled: true
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
              },
              data: data
            }
          ]
        };

        chart.setOption(option);
      });

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div ref={chartRef} className="w-full h-full" />;
} 