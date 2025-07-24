'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageBuilder from '@/components/PageBuilder'
import { PageElement, PageSettings } from '@/types/builder'

export default function BuilderPage() {
  const searchParams = useSearchParams()
  const pageId = searchParams.get('id')
  
  const [initialData, setInitialData] = useState<{
    elements: PageElement[]
    settings: PageSettings
  } | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPage = async () => {
      if (pageId) {
        try {
          const response = await fetch(`/api/pages/${pageId}`)
          if (response.ok) {
            const data = await response.json()
            setInitialData({
              elements: data.elements || [],
              settings: data.settings || {
                title: data.title || '새 랜딩페이지',
                primaryColor: '#3b82f6',
                backgroundColor: '#ffffff'
              }
            })
          } else {
            // 페이지를 찾을 수 없는 경우 새 페이지로 시작
            setInitialData({
              elements: [],
              settings: {
                title: '새 랜딩페이지',
                primaryColor: '#3b82f6',
                backgroundColor: '#ffffff',
                businessInfo: {
                  id: 'business-info',
                  isVisible: false,
                  backgroundColor: '#f8fafc',
                  elements: []
                }
              }
            })
          }
        } catch (error) {
          console.error('Failed to load page:', error)
          setInitialData({
            elements: [],
            settings: {
              title: '새 랜딩페이지',
              primaryColor: '#3b82f6',
              backgroundColor: '#ffffff',
              businessInfo: {
                id: 'business-info',
                isVisible: false,
                backgroundColor: '#f8fafc',
                elements: []
              }
            }
          })
        }
      } else {
        // 새 페이지
        setInitialData({
          elements: [],
          settings: {
            title: '새 랜딩페이지',
            primaryColor: '#3b82f6',
            backgroundColor: '#ffffff',
            businessInfo: {
              id: 'business-info',
              isVisible: false,
              backgroundColor: '#f8fafc',
              elements: []
            }
          }
        })
      }
      setLoading(false)
    }

    loadPage()
  }, [pageId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <PageBuilder 
      initialData={initialData}
      pageId={pageId || undefined}
    />
  )
}