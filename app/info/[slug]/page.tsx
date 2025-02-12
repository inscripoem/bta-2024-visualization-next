import { SiteHeader } from '@/components/site-header'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

async function getMarkdownContent(slug: string) {
  const filePath = path.join(process.cwd(), 'content/info', `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  
  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(fileContents)
    
  return processedContent.toString()
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const content = await getMarkdownContent(slug)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-fade-up">
            <CardContent className="p-0">
              <article 
                className="prose prose-slate dark:prose-invert max-w-none p-8"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'content/info'))
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace(/\.md$/, '')
    }))
}