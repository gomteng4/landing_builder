import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PublishedPage from '@/components/PublishedPage'

interface PageProps {
  params: { id: string }
}

async function getPage(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function Page({ params }: PageProps) {
  const page = await getPage(params.id)

  if (!page) {
    notFound()
  }

  return <PublishedPage page={page} />
}

export async function generateMetadata({ params }: PageProps) {
  const page = await getPage(params.id)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.settings?.title || page.title || 'Landing Page',
    description: `${page.settings?.title || page.title || 'Landing Page'} - 랜딩페이지 빌더로 제작`,
  }
}