"use client"

import { SiteHeader } from "@/components/site-header";
import { VoteProvider, useVoteContext } from "./vote-context";
import { Loading } from "@/components/loading";

function StatsLayoutContent({ children }: { children: React.ReactNode }) {
  const { error, loading } = useVoteContext();

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="flex-1">
          <Loading className="h-full min-h-[500px]" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="flex-1">
          <div className="h-full min-h-[500px] flex items-center justify-center">
            <div className="text-red-500 text-2xl font-bold">
              加载失败: {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
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