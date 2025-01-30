"use client"

import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

import {
  Confetti,
  type ConfettiRef,
} from "@/components/ui/confetti";
import { SchoolBarChart } from "@/components/school-bar-chart"

import { schoolData } from "./data";

// 模拟数据，实际使用时替换为真实数据
const stats = [
  { label: "参与学校", value: 37 },
  { label: "总问卷数", value: 1234 },
  { label: "总浏览量", value: 5678 },
  { label: "总浏览用户", value: 3456 },
];

export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef.current?.fire({});

    // 添加平滑滚动处理
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentScroll = window.scrollY;

      if (e.deltaY > 0) {
        // 向下滚动
        if (currentScroll < window.innerHeight) {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        } else if (currentScroll < window.innerHeight * 2) {
          window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' });
        }
      } else {
        // 向上滚动
        if (currentScroll > window.innerHeight) {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        } else if (currentScroll > 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    // 在整个页面添加事件监听
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* 第一屏 */}
      <div className="min-h-screen relative flex flex-col">
        <div className="flex-1 p-8 flex flex-col items-center justify-center gap-16">
          <main className="flex items-center gap-16">
            <Image
              src="/logo.png"
              alt="大二杯 Logo"
              width={100}
              height={100}
              className="object-contain"
            />

            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full z-[-1]"
            />
            
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold mb-2">
                2024 <span className="text-primary font-noto-serif font-black">大二杯</span>
              </h1>
              <h2 className="text-3xl font-bold">
                现已结束！
              </h2>
            </div>
            
            <Button asChild size="lg">
              <a href="/data" className="flex items-center gap-2">
                查看奖项数据
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </main>

          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border px-10 py-6 flex flex-col items-left">
                <div className="text-sm font-bold text-primary mb-2">{stat.label}</div>
                <NumberTicker
                  value={stat.value}
                  delay={0}
                  className="text-3xl font-bold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 下一屏指示器 */}
        <div className="absolute bottom-8 inset-x-0 mx-auto flex flex-col items-center gap-2 animate-bounce w-fit">
          <span className="text-sm text-muted-foreground">
            滚动查看各校参与人数
          </span>
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>

      {/* 第二屏 */}
      <div className="min-h-screen p-8">
        <h2 className="text-3xl font-bold mb-8 pt-2 pl-2">各学校参与人数</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <SchoolBarChart data={schoolData} />
          </div>
          <div className="col-span-1 h-full">
            <Card className="h-full">
              <CardContent className="h-full">
                <ScrollArea className="h-[500px] my-5" onWheel={(e) => e.stopPropagation()}>
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">学校</th>
                        <th className="p-2 text-left">参与人数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolData.sort((a, b) => b.value - a.value).map((school) => (
                        <tr key={school.name}>
                          <td className="border-t border-gray-600 p-2">{school.name}</td>
                          <td className="border-t border-gray-600 p-2">{school.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 第三屏 */}
{/*       <div className="min-h-screen p-8">
        <h2 className="text-3xl font-bold mb-8 pt-2 pl-2">学校参与人数地图</h2>
        <EChartsMap data={schoolData} />
      </div> */}
    </div>
  );
}
