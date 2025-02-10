import { SiteHeader } from '@/components/site-header'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const { default: Content } = await import(`@/content/info/${slug}.mdx`)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-fade-up">
            <CardContent className="p-0">
              <article className="prose prose-slate dark:prose-invert max-w-none p-8">
                <Content />
              </article>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return [
    { slug: 'about' },
    { slug: 'rules' },
  ]
}