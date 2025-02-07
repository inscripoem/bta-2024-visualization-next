"use client"

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Map } from "lucide-react";

// 修改接口定义，添加 location 字段
interface SchoolData {
  name: string;
  location: string;
  vote_count: number;
}

// 添加 ECharts 的参数类型定义
interface TooltipParams {
  name: string;
  data?: {
    value: number;
    schools: string[];
  };
}

interface SchoolMapProps {
  data: SchoolData[];
}

export function SchoolMap({ data }: SchoolMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isMapView, setIsMapView] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    // 考虑设备像素比
    const chart = echarts.init(chartRef.current, 'dark', {
      renderer: 'svg',
      devicePixelRatio: window.devicePixelRatio
    });
    
    // 确保容器尺寸正确
    setTimeout(() => {
      chart.resize();
    }, 0);

    // 获取 CSS 变量
    const style = getComputedStyle(document.documentElement);
    const getPrimaryColor = (opacity: number) => {
      const h = style.getPropertyValue('--primary').split(' ')[0];
      const s = style.getPropertyValue('--primary').split(' ')[1];
      const l = style.getPropertyValue('--primary').split(' ')[2];
      return `hsla(${h}, ${s}, ${l}, ${opacity})`;
    };
    const getMutedColor = () => {
      const h = style.getPropertyValue('--muted').split(' ')[0];
      const s = style.getPropertyValue('--muted').split(' ')[1];
      const l = style.getPropertyValue('--muted').split(' ')[2];
      return `hsl(${h}, ${s}, ${l})`;
    };
    const getMutedForegroundColor = () => {
      const h = style.getPropertyValue('--muted-foreground').split(' ')[0];
      const s = style.getPropertyValue('--muted-foreground').split(' ')[1];
      const l = style.getPropertyValue('--muted-foreground').split(' ')[2];
      return `hsl(${h}, ${s}, ${l})`;
    };
    
    // 按省份分组学校数据
    const provinceData = data.reduce((acc, school) => {
      const location = school.name === "其它高校" ? "未明确" : school.location;
      if (!acc[location]) {
        acc[location] = {
          value: 0,
          schools: []
        };
      }
      acc[location].value += school.vote_count;
      acc[location].schools.push(`${school.name}(${school.vote_count}人)`);
      return acc;
    }, {} as Record<string, { value: number, schools: string[] }>);

    // 转换为 ECharts 数据格式
    const chartData = Object.entries(provinceData).map(([province, data]) => ({
      name: province,
      value: data.value,
      schools: data.schools
    }));

    // 动态加载省份地图数据
    fetch('/data/china.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('无法加载地图数据');
        }
        return res.json();
      })
      .then(geoJson => {
        try {
          echarts.registerMap('china', geoJson);
          
          const mapOption = {
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'item',
              formatter: (params: TooltipParams) => {
                const data = params.data || { value: 0, schools: [] };
                return `${params.name}: ${data.value || 0}人${data.schools?.length ? `<br/>参与学校：<br/>${data.schools.join('<br/>')}` : '<br/>暂无参与学校'}`;
              },
              className: 'echarts-tooltip-dark'
            },
            visualMap: {
              left: '28px',
              bottom: '24px',
              min: 0,
              max: Math.max(...chartData.map(item => item.value)),
              text: ['高', '低'],
              realtime: false,
              calculable: true,
              inRange: {
                color: [getPrimaryColor(0.1), getPrimaryColor(0.9)]
              },
              textStyle: {
                color: getMutedForegroundColor()
              }
            },
            series: [
              {
                name: '参与人数',
                type: 'map',
                map: 'china',
                roam: true,
                scaleLimit: {
                  min: 0.5,
                  max: 3
                },
                emphasis: {
                  label: {
                    show: true,
                    color: '#fff'
                  },
                  itemStyle: {
                    areaColor: getPrimaryColor(0.8)
                  }
                },
                select: {
                  disabled: true
                },
                itemStyle: {
                  borderColor: getMutedColor(),
                  borderWidth: 1,
                  areaColor: getPrimaryColor(0.1)
                },
                data: chartData
              }
            ]
          };

          // 对数据进行排序，确保条形图按照数值从大到小排列
          const sortedChartData = [...chartData].sort((a, b) => b.value - a.value);

          const barOption = {
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'axis',
              formatter: (params: TooltipParams[]) => {
                const data = params[0].data || { value: 0, schools: [] };
                return `${params[0].name}: ${data.value || 0}人${data.schools?.length ? `<br/>参与学校：<br/>${data.schools.join('<br/>')}` : '<br/>暂无参与学校'}`;
              },
              className: 'echarts-tooltip-dark'
            },
            grid: {
              left: '3%',
              right: '12%',
              top: '3%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              name: '参与人数',
              nameTextStyle: {
                color: getMutedForegroundColor()
              },
              axisLabel: {
                color: getMutedForegroundColor()
              },
              axisLine: {
                lineStyle: {
                  color: getMutedColor()
                }
              },
              splitLine: {
                lineStyle: {
                  color: getMutedColor()
                }
              }
            },
            yAxis: {
              type: 'category',
              data: sortedChartData.map(item => item.name).reverse(),
              axisLabel: {
                interval: 0,
                rotate: 30,
                color: getMutedForegroundColor()
              },
              axisLine: {
                lineStyle: {
                  color: getMutedColor()
                }
              }
            },
            series: [
              {
                type: 'bar',
                data: [...sortedChartData].reverse(),
                itemStyle: {
                  color: getPrimaryColor(0.8),
                  borderRadius: [0, 4, 4, 0]
                },
                barWidth: '60%'
              }
            ]
          };

          // 根据当前视图设置对应的选项
          chart.setOption(isMapView ? mapOption : barOption);
        } catch (error) {
          console.error('加载地图数据时出错:', error);
        }
      });

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, isMapView]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>各省参与情况</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={isMapView ? "default" : "outline"}
            size="icon"
            onClick={() => setIsMapView(true)}
            aria-label="切换到地图视图"
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button
            variant={!isMapView ? "default" : "outline"}
            size="icon"
            onClick={() => setIsMapView(false)}
            aria-label="切换到柱状图视图"
          >
            <BarChart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={chartRef} className="w-full aspect-[4/3] md:h-[500px] md:aspect-auto" />
      </CardContent>
    </Card>
  );
} 