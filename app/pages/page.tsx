'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Edit, Eye, Copy, Trash2, Globe, Star, Settings } from 'lucide-react'

interface Page {
  id: string
  title: string
  slug: string
  nickname: string | null
  is_template: boolean
  template_name: string | null
  template_description: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'templates'>('all')

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error('페이지 목록 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 페이지를 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setPages(prev => prev.filter(page => page.id !== id))
      alert('페이지가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleTogglePublish = async (page: Page) => {
    try {
      const endpoint = `/api/pages/${page.id}/publish`
      const method = page.is_published ? 'DELETE' : 'POST'
      
      const response = await fetch(endpoint, { method })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '게시 상태 변경에 실패했습니다')
      }
      
      setPages(prev => prev.map(p => 
        p.id === page.id ? { ...p, is_published: !p.is_published } : p
      ))
      
      if (page.is_published) {
        alert('페이지 게시가 취소되었습니다.')
      } else {
        const url = `${window.location.origin}/r/${data.published_url}`
        alert(`페이지가 게시되었습니다!\\n\\nURL: ${url}`)
      }
    } catch (error) {
      console.error('게시 상태 변경 실패:', error)
      alert('게시 상태 변경 중 오류가 발생했습니다.')
    }
  }

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/r/${slug}`
    navigator.clipboard.writeText(url)
    alert('URL이 클립보드에 복사되었습니다!')
  }

  const filteredPages = pages.filter(page => {
    switch (filter) {
      case 'published':
        return page.is_published
      case 'templates':
        return page.is_template
      default:
        return true
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">페이지 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">랜딩페이지 관리</h1>
            <p className="text-gray-600 mt-2">생성한 랜딩페이지를 관리하고 게시할 수 있습니다.</p>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              href="/settings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Link>
            <Link 
              href="/builder"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 페이지 만들기
            </Link>
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: '전체', count: pages.length },
                { id: 'published', label: '게시됨', count: pages.filter(p => p.is_published).length },
                { id: 'templates', label: '템플릿', count: pages.filter(p => p.is_template).length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 페이지 그리드 */}
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">페이지가 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 랜딩페이지를 만들어보세요!</p>
            <Link 
              href="/builder"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              페이지 만들기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map(page => (
              <div key={page.id} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {page.nickname || page.title}
                      </h3>
                      {page.nickname && (
                        <p className="text-sm text-gray-500 truncate">{page.title}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      {page.is_published && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Globe className="w-3 h-3 mr-1" />
                          게시됨
                        </span>
                      )}
                      {page.is_template && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Star className="w-3 h-3 mr-1" />
                          템플릿
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <p>생성: {new Date(page.created_at).toLocaleDateString('ko-KR')}</p>
                    <p>수정: {new Date(page.updated_at).toLocaleDateString('ko-KR')}</p>
                    <p className="truncate">URL: /r/{page.slug}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/builder?id=${page.id}`}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      편집
                    </Link>

                    <Link
                      href={`/r/${page.slug}`}
                      target="_blank"
                      className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      미리보기
                    </Link>

                    <button
                      onClick={() => copyUrl(page.slug)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      URL 복사
                    </button>

                    <button
                      onClick={() => handleTogglePublish(page)}
                      className={`inline-flex items-center px-3 py-1 text-sm rounded ${
                        page.is_published
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {page.is_published ? '게시 중단' : '게시하기'}
                    </button>

                    <button
                      onClick={() => handleDelete(page.id)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}