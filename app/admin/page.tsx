'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Phone, User, Calendar, Eye, Trash2, Bell } from 'lucide-react'

interface FormSubmission {
  id: string
  page_id: string
  name?: string
  email?: string
  phone?: string
  data: any
  created_at: string
  pages?: {
    title: string
  }
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all')

  useEffect(() => {
    loadSubmissions()
    
    // 실시간 구독 설정
    const subscription = supabase
      .channel('form_submissions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'form_submissions'
      }, (payload) => {
        console.log('새로운 폼 제출!', payload)
        // 브라우저 알림
        if (Notification.permission === 'granted') {
          new Notification('새로운 폼 제출!', {
            body: `${payload.new.name || '익명'}님이 폼을 제출했습니다.`,
            icon: '/favicon.ico'
          })
        }
        // 목록 새로고침
        loadSubmissions()
      })
      .subscribe()

    // 알림 권한 요청
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadSubmissions = async () => {
    try {
      let query = supabase
        .from('form_submissions')
        .select(`
          *,
          pages (
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0]
        query = query.gte('created_at', today)
      } else if (filter === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('created_at', weekAgo)
      }

      const { data, error } = await query.limit(100)

      if (error) {
        console.error('Error loading submissions:', error)
      } else {
        setSubmissions(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id)

      if (error) {
        alert('삭제 실패: ' + error.message)
      } else {
        setSubmissions(prev => prev.filter(s => s.id !== id))
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR')
  }

  useEffect(() => {
    loadSubmissions()
  }, [filter])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-blue-600" />
                폼 제출 관리
              </h1>
              <p className="text-gray-600 mt-1">
                랜딩페이지에서 제출된 폼 데이터를 실시간으로 확인하세요
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'today' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                오늘
              </button>
              <button
                onClick={() => setFilter('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7일
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 제출된 폼이 없습니다
            </h3>
            <p className="text-gray-600">
              랜딩페이지에 폼이 제출되면 여기에 실시간으로 표시됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                총 {submissions.length}개의 제출 데이터
              </h2>
              <p className="text-sm text-gray-600">
                새로운 폼 제출 시 브라우저 알림이 전송됩니다
              </p>
            </div>

            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {submission.name || '이름 없음'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {submission.pages?.title || '페이지 제목 없음'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(submission.created_at)}
                      </span>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {submission.name && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">이름:</span>
                        <span className="text-sm font-medium">{submission.name}</span>
                      </div>
                    )}
                    
                    {submission.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">이메일:</span>
                        <a 
                          href={`mailto:${submission.email}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {submission.email}
                        </a>
                      </div>
                    )}
                    
                    {submission.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">전화번호:</span>
                        <a 
                          href={`tel:${submission.phone}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {submission.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {submission.data && Object.keys(submission.data).length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">추가 데이터:</h4>
                      <pre className="text-xs text-gray-600 overflow-auto">
                        {JSON.stringify(submission.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}