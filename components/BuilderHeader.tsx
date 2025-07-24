'use client'

import { Eye, Save, Share, Settings, ExternalLink, Menu, Star, Edit3, List, Globe, GlobeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface BuilderHeaderProps {
  title: string
  isPreviewMode: boolean
  onTogglePreview: () => void
  onSave: () => void
  pageId?: string
  onSaveAsTemplate?: () => void
  onShowNicknameDialog?: () => void
  isPublished?: boolean
  onPublish?: () => void
  onUnpublish?: () => void
}

export default function BuilderHeader({
  title,
  isPreviewMode,
  onTogglePreview,
  onSave,
  pageId,
  onSaveAsTemplate,
  onShowNicknameDialog,
  isPublished,
  onPublish,
  onUnpublish
}: BuilderHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link 
          href="/" 
          className="text-xl font-bold text-gray-900 hover:text-blue-600"
        >
          랜딩페이지 빌더
        </Link>
        <div className="text-gray-500">|</div>
        <h1 className="text-lg font-medium text-gray-700">{title}</h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onTogglePreview}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isPreviewMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isPreviewMode ? '편집 모드' : '미리보기'}</span>
        </button>

        {pageId && (
          <button
            onClick={() => window.open(`/page/${pageId}`, '_blank')}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>새창 미리보기</span>
          </button>
        )}

        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>저장</span>
        </button>

        {pageId && (
          isPublished ? (
            <button
              onClick={onUnpublish}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <GlobeOff className="w-4 h-4" />
              <span>게시 취소</span>
            </button>
          ) : (
            <button
              onClick={onPublish}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>게시하기</span>
            </button>
          )
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>메뉴</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link
                href="/pages"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <List className="w-4 h-4 mr-3" />
                페이지 목록
              </Link>
              
              {onShowNicknameDialog && (
                <button
                  onClick={() => {
                    onShowNicknameDialog()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit3 className="w-4 h-4 mr-3" />
                  닉네임 설정
                </button>
              )}
              
              {onSaveAsTemplate && (
                <button
                  onClick={() => {
                    onSaveAsTemplate()
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Star className="w-4 h-4 mr-3" />
                  템플릿으로 저장
                </button>
              )}
              
              <hr className="my-2" />
              
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-3" />
                구글 시트 설정
              </Link>
            </div>
          )}
        </div>

        {pageId && (
          <Link
            href={`/page/${pageId}`}
            target="_blank"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Share className="w-4 h-4" />
            <span>공유</span>
          </Link>
        )}
      </div>
    </header>
  )
}