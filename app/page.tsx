"use client"

import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

import {
  Confetti,
  type ConfettiRef,
} from "@/components/ui/confetti";

import { useVoteData } from "@/lib/data";
import { SchoolMap } from "@/components/school-map";

{/* TODO: 首先，让stats完全脱离加载的数据，我们将在代码中用常量硬编码这个结构。
其次，把包括学校数据页面的和加载的数据有关的部分全部移动到/stats路由下，其中，学校的参与情况放在/stats/schools下。
请把loader也挪到stats下，我们将在第一次访问/stats时加载数据。
在/stats下使用app router做单页面*/}

const loadingStates = [
  {
    text: "正在计票",
  },
  {
    text: "正在偷吃铜锣烧",
  },
  {
    text: "少女祈祷中",
  },
]


const itemDuration = 1500;

const loadingDuration = itemDuration * loadingStates.length;


export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);
  const { schoolData, stats, error, loading } = useVoteData();
  const [showLoader, setShowLoader] = useState(true);
  const loadStartTimeRef = useRef<number | null>(null);

  // 监听数据加载状态的变化
  useEffect(() => {
    if (loading) {
      // 记录加载开始时间
      loadStartTimeRef.current = Date.now();
      setShowLoader(true);
    } else if (loadStartTimeRef.current) {
      // 计算已经过去的加载时间
      const loadTime = Date.now() - loadStartTimeRef.current;
      // 计算需要补足的时间
      const remainingTime = loadingDuration - (loadTime % loadingDuration);
      
      // 设置延时
      const timer = setTimeout(() => {
        setShowLoader(false);
        loadStartTimeRef.current = null;
      }, remainingTime);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    confettiRef.current?.fire({});
  }, []);

  if (showLoader) {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader loadingStates={loadingStates} loading={showLoader} duration={itemDuration} />
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl font-bold text-red-500">加载失败: {error}</div>
    </div>;
  }

  return (
    <div className="flex flex-col">
      {/* 第一屏 */}
      <div className="min-h-screen relative flex flex-col">
        <div className="flex-1 pt-8 md:pt-16 pb-24 md:pb-32 px-4 md:px-8 flex flex-col items-center justify-center gap-8 md:gap-16">
          <main className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
            <Image
              src="/logo.webp"
              alt="大二杯 Logo"
              width={100}
              height={100}
              className="object-contain"
            />

            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-[-1] size-full"
            />
            
            <div className="flex flex-col text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">
                2024 <span className="text-primary font-bold">大二杯</span>
              </h1>
              <h2 className="text-3xl font-bold">
                现已结束！
              </h2>
            </div>
            
            <Button asChild size="lg" className="w-full md:w-auto">
              <a href="/stats" className="flex items-center gap-2 justify-center">
                查看奖项数据
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </main>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 w-full md:max-w-[800px] ">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border px-4 md:px-10 py-4 md:py-6 flex flex-col items-left">
                <div className="text-sm font-bold text-primary mb-1 md:mb-2">{stat.label}</div>
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
            向下滚动查看各校参与人数
          </span>
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>

      {/* 第二屏 */}
      <div className="p-3 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 pt-2 pl-2">各学校参与人数</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2">
            <SchoolMap data={schoolData} />
          </div>
          <div className="lg:col-span-1 h-auto">
            <Card className="h-auto">
              <CardHeader className="pb-2 my-2">
                <CardTitle>学校参与情况</CardTitle>
              </CardHeader>
              <CardContent className="h-auto">
                <ScrollArea className="h-[500px]">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">学校</th>
                        <th className="p-2 text-left">参与人数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolData.sort((a, b) => b.vote_count - a.vote_count).map((school) => (
                        <tr key={school.name}>
                          <td className="border-t border-gray-600 p-2">{school.name}</td>
                          <td className="border-t border-gray-600 p-2">{school.vote_count}</td>
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
    </div>
  );
}
