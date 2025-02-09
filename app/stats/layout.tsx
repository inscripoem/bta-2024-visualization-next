"use client"

import { useEffect, useState, useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { VoteProvider, useVoteContext } from "./vote-context";

const loadingStates = [
  {
    text: "正在计票",
  },
  {
    text: "少女祈祷中",
  },
]

const itemDuration = 1000;
const loadingDuration = itemDuration * loadingStates.length;

function StatsLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, error } = useVoteContext();
  const [showLoader, setShowLoader] = useState(true);
  const loadStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      loadStartTimeRef.current = Date.now();
      setShowLoader(true);
    } else if (loadStartTimeRef.current) {
      const loadTime = Date.now() - loadStartTimeRef.current;
      const remainingTime = loadingDuration - (loadTime % loadingDuration);
      
      const timer = setTimeout(() => {
        setShowLoader(false);
        loadStartTimeRef.current = null;
      }, remainingTime);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (showLoader) {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader loadingStates={loadingStates} loading={showLoader} duration={itemDuration} />
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-2xl font-bold">
        加载失败: {error}
      </div>
    </div>;
  }

  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
}

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <VoteProvider>
      <StatsLayoutContent>{children}</StatsLayoutContent>
    </VoteProvider>
  );
} 