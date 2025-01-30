import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-bold">404 页面未找到</h2>
      <p className="text-muted-foreground">抱歉，您访问的页面不存在。</p>
      <Button asChild>
        <Link href="/" className="flex items-center gap-2">
          <HomeIcon className="h-4 w-4" />
          返回主页
        </Link>
      </Button>
    </div>
  )
} 