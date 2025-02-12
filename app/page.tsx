"use client"

import Image from "next/image";
import Link from "next/link";
import { ArrowRight} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import {
  Confetti,
  type ConfettiRef,
} from "@/components/ui/confetti";

const stats = [
  { label: "参与学校", value: 36 },
  { label: "总问卷数", value: 1293 },
  { label: "总浏览量", value: 5504 },
  { label: "总浏览用户", value: 4103 },
]

export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef.current?.fire({});
  }, []);

  return (
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
          
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                  <span className="flex items-center gap-2 justify-center">
                    查看所有数据
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>敬请期待</AlertDialogTitle>
                <AlertDialogDescription>数据将在后续直播中公布</AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>关闭</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/info/about" className="hover:text-foreground transition-colors">
                关于大二杯
              </Link>
            </div>
          </div>
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
    </div>
  );
}
