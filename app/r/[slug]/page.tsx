'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PublishedPage from '@/components/PublishedPage'
import { PageElement, PageSettings } from '@/types/builder'
import { supabase } from '@/lib/supabase'

interface PageData {
  id: string
  title: string
  slug: string
  elements: PageElement[]
  settings: PageSettings
}

export default function RandomUrlPage() {
  const params = useParams()
  const slug = params.slug as string
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPage() {
      if (!slug) return

      try {
        setLoading(true)
        
        // Supabase에서 직접 조회 (published_url 또는 slug로)
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .or(`slug.eq.${slug},published_url.eq.${slug}`)
          .eq('is_published', true)
          .single()
        
        if (error || !data) {
          console.error('Supabase error:', error)
          setError('페이지를 찾을 수 없습니다.')
          return
        }

        setPageData({
          id: data.id,
          title: data.title,
          slug: data.slug,
          elements: data.elements || [],
          settings: data.settings || { title: '', primaryColor: '#3b82f6', backgroundColor: '#ffffff' }
        })
        
        // 페이지 조회수 증가 (비동기로 처리)
        fetch(`/api/pages/slug/${slug}/view`, { method: 'POST' }).catch(console.error)
        
      } catch (err) {
        console.error('Error fetching page:', err)
        setError('페이지를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || '페이지를 찾을 수 없습니다'}
          </h1>
          <p className="text-gray-600 mb-6">
            요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <PublishedPage
      page={{
        id: pageData.id,
        title: pageData.title,
        elements: pageData.elements,
        settings: pageData.settings
      }}
    />
  )
}