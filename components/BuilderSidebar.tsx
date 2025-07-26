'use client'

import { useState } from 'react'
import { 
  Type, 
  Heading, 
  Image, 
  Video, 
  MousePointer2, 
  FileText, 
  Space, 
  Code, 
  Settings,
  Trash2,
  Palette,
  Zap
} from 'lucide-react'
import { PageElement, PageSettings } from '@/types/builder'
import ElementEditor from './ElementEditor'
import GlobalSettings from './GlobalSettings'

interface BuilderSidebarProps {
  selectedElement: PageElement | null
  settings: PageSettings
  onAddElement: (type: PageElement['type'], widgetType?: string) => void
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void
  onDeleteElement: (id: string) => void
  onUpdateSettings: (updates: Partial<PageSettings>) => void
  isAddingElement?: boolean
}

const elementTypes = [
  { type: 'heading' as const, icon: Heading, label: '헤딩' },
  { type: 'text' as const, icon: Type, label: '텍스트' },
  { type: 'image' as const, icon: Image, label: '이미지' },
  { type: 'video' as const, icon: Video, label: '동영상' },
  { type: 'button' as const, icon: MousePointer2, label: '버튼' },
  { type: 'form' as const, icon: FileText, label: 'DB폼' },
  { type: 'spacer' as const, icon: Space, label: '간격' },
  { type: 'html' as const, icon: Code, label: 'HTML코드' },
]

export default function BuilderSidebar({
  selectedElement,
  settings,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onUpdateSettings,
  isAddingElement = false
}: BuilderSidebarProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'widgets' | 'settings' | 'edit'>('elements')

  // 선택된 요소가 있을 때 자동으로 편집 탭으로 전환
  if (selectedElement && activeTab !== 'edit') {
    setActiveTab('edit')
  }

  return (
    <div className="w-80 max-w-[90vw] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 px-3 py-3 text-xs font-medium ${
            activeTab === 'elements'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          요소
        </button>
        <button
          onClick={() => setActiveTab('widgets')}
          className={`flex-1 px-3 py-3 text-xs font-medium ${
            activeTab === 'widgets'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-3 h-3 inline mr-1" />
          위젯
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-3 py-3 text-xs font-medium ${
            activeTab === 'settings'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-3 h-3 inline mr-1" />
          설정
        </button>
        {selectedElement && (
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-3 py-3 text-xs font-medium ${
              activeTab === 'edit'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            편집
          </button>
        )}
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' && (
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              요소 추가
            </h3>
            {elementTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => onAddElement(type)}
                disabled={isAddingElement}
                className={`w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg transition-colors ${
                  isAddingElement 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{label}</span>
                {isAddingElement && <span className="text-xs text-gray-500">추가 중...</span>}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔥 인터랙티브 위젯
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              전환율을 높이는 실시간 효과 위젯들입니다
            </p>
            
            {[
              {
                type: 'applicant-list',
                icon: '📝',
                title: '실시간 신청자 목록',
                description: '신청자가 계속 추가되는 롤링 효과'
              },
              {
                type: 'countdown-banner',
                icon: '⏰',
                title: '마감시간 카운트다운',
                description: '상단 고정 긴급 알림 띠'
              },
              {
                type: 'discount-counter',
                icon: '💰',
                title: '실시간 할인 카운터',
                description: '할인받은 사람 수 실시간 증가'
              },
              {
                type: 'visitor-count',
                icon: '👀',
                title: '실시간 조회수',
                description: '현재 페이지를 보는 사람 수'
              },
              {
                type: 'stock-alert',
                icon: '🎯',
                title: '재고 부족 알림',
                description: '한정수량 프로그레스 바'
              },
              {
                type: 'floating-menu',
                icon: '💬',
                title: '플로팅 메뉴',
                description: '카카오톡, 전화 연결 버튼'
              }
            ].map(({ type, icon, title, description }) => (
              <button
                key={type}
                onClick={() => {
                  onAddElement('widget', type)
                }}
                disabled={isAddingElement}
                className={`w-full text-left p-3 border border-gray-200 rounded-lg transition-all ${
                  isAddingElement 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                  </div>
                </div>
                {isAddingElement && <span className="text-xs text-gray-500 block mt-2">추가 중...</span>}
              </button>
            ))}
            
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 text-sm mb-1">💡 사용 팁</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• 위젯 추가 후 편집에서 색상과 내용을 커스터마이징하세요</li>
                <li>• Figma 이미지의 색상을 스포이드로 추출하여 위젯에 적용할 수 있어요</li>
                <li>• 카운트다운은 마감일시를 설정하면 실시간으로 업데이트됩니다</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <GlobalSettings
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {activeTab === 'edit' && selectedElement && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                요소 편집
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('elements')}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  title="요소 추가"
                >
                  + 요소추가
                </button>
                <button
                  onClick={() => onDeleteElement(selectedElement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="요소 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <ElementEditor
              element={selectedElement}
              onUpdate={onUpdateElement}
              settings={settings}
            />
          </div>
        )}

        {activeTab === 'edit' && !selectedElement && (
          <div className="p-4 text-center text-gray-500">
            <div className="text-4xl mb-4">👆</div>
            <p>편집할 요소를 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  )
}