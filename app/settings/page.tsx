'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save, TestTube } from 'lucide-react'

interface GoogleSheetsConfig {
  spreadsheet_id: string
  sheet_name: string
  service_account_key: any
  is_active: boolean
}

export default function SettingsPage() {
  const [config, setConfig] = useState<GoogleSheetsConfig>({
    spreadsheet_id: '',
    sheet_name: 'Sheet1',
    service_account_key: null,
    is_active: false
  })
  const [serviceAccountJson, setServiceAccountJson] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('google_sheets_config')
        .select('*')
        .eq('is_active', true)
        .single()

      if (data && !error) {
        setConfig(data)
        setServiceAccountJson(JSON.stringify(data.service_account_key, null, 2))
      }
    } catch (error) {
      console.log('No existing config found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      // JSON 파싱 검증
      let parsedServiceAccount
      try {
        parsedServiceAccount = JSON.parse(serviceAccountJson)
      } catch (e) {
        throw new Error('서비스 계정 JSON 형식이 올바르지 않습니다.')
      }

      // 기존 설정 비활성화
      await supabase
        .from('google_sheets_config')
        .update({ is_active: false })
        .eq('is_active', true)

      // 새 설정 저장
      const { error } = await supabase
        .from('google_sheets_config')
        .insert({
          spreadsheet_id: config.spreadsheet_id,
          sheet_name: config.sheet_name,
          service_account_key: parsedServiceAccount,
          is_active: true
        })

      if (error) throw error

      setMessage('설정이 성공적으로 저장되었습니다!')
      setConfig(prev => ({ ...prev, is_active: true }))
    } catch (error: any) {
      setMessage(`오류: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setMessage('')

    try {
      const response = await fetch('/api/test-google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheet_id: config.spreadsheet_id,
          sheet_name: config.sheet_name,
          service_account_key: JSON.parse(serviceAccountJson)
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setMessage('연결 테스트 성공! 구글 시트에 접근할 수 있습니다.')
      } else {
        setMessage(`연결 실패: ${result.error}`)
      }
    } catch (error: any) {
      setMessage(`테스트 중 오류: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">설정을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            관리 페이지로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">구글 시트 연동 설정</h1>
          <p className="text-gray-600 mt-2">신청서 데이터를 구글 시트로 자동 전송하도록 설정합니다.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구글 스프레드시트 ID *
              </label>
              <input
                type="text"
                value={config.spreadsheet_id}
                onChange={(e) => setConfig(prev => ({ ...prev, spreadsheet_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
              <p className="text-xs text-gray-500 mt-1">
                스프레드시트 URL에서 /d/ 다음에 오는 긴 문자열입니다.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시트 이름
              </label>
              <input
                type="text"
                value={config.sheet_name}
                onChange={(e) => setConfig(prev => ({ ...prev, sheet_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sheet1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                서비스 계정 JSON 키 *
              </label>
              <textarea
                value={serviceAccountJson}
                onChange={(e) => setServiceAccountJson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={10}
                placeholder={`{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Google Cloud Console에서 생성한 서비스 계정의 JSON 키 파일 내용을 붙여넣으세요.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('성공') || message.includes('테스트 성공') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleTest}
                disabled={!config.spreadsheet_id || !serviceAccountJson || isTesting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TestTube className="w-4 h-4 mr-2" />
                {isTesting ? '테스트 중...' : '연결 테스트'}
              </button>

              <button
                onClick={handleSave}
                disabled={!config.spreadsheet_id || !serviceAccountJson || isSaving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '저장 중...' : '설정 저장'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">설정 방법</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Google Cloud Console에서 프로젝트를 생성하거나 선택합니다.</li>
            <li>Google Sheets API를 활성화합니다.</li>
            <li>서비스 계정을 생성하고 JSON 키를 다운로드합니다.</li>
            <li>구글 스프레드시트를 생성하고, 서비스 계정 이메일을 편집자로 공유합니다.</li>
            <li>위 폼에 스프레드시트 ID와 서비스 계정 JSON을 입력합니다.</li>
            <li>"연결 테스트"로 설정을 확인한 후 "설정 저장"을 클릭합니다.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}