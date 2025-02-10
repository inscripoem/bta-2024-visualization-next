import { cn } from "@/lib/utils"

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-row items-center justify-center gap-3 min-h-[200px]", className)}>
      <div className="w-6 h-6 border-2 border-primary/20 rounded-full animate-spin relative">
        <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
      <div className="text-lg font-bold">加载中...</div>
    </div>
  )
} 