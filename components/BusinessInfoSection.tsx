'use client'

import { useState } from 'react'
import { PageElement, PageSettings, BusinessInfoSection as BusinessInfo } from '@/types/builder'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import ElementRenderer from './ElementRenderer'
import DraggableElement from './DraggableElement'
import { v4 as uuidv4 } from 'uuid'

interface BusinessInfoSectionProps {
  businessInfo: BusinessInfo
  settings: PageSettings
  isPreview: boolean
  selectedElementId?: string | null
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void
  onDeleteElement: (id: string) => void
  onSelectElement: (element: PageElement | null) => void
  onAddElement: (type: PageElement['type']) => void
  onUpdateBusinessInfo: (updates: Partial<BusinessInfo>) => void
}

export default function BusinessInfoSection({
  businessInfo,
  settings,
  isPreview,
  selectedElementId,
  onUpdateElement,
  onDeleteElement,
  onSelectElement,
  onAddElement,
  onUpdateBusinessInfo
}: BusinessInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleAddElement = (type: PageElement['type']) => {
    const newElement: PageElement = {
      id: uuidv4(),
      type,
      content: getDefaultContent(type),
      styles: {},
      order: businessInfo.elements.length
    }

    onUpdateBusinessInfo({
      elements: [...businessInfo.elements, newElement]
    })
  }

  const handleUpdateElement = (id: string, updates: Partial<PageElement>) => {
    const updatedElements = businessInfo.elements.map(element =>
      element.id === id ? { ...element, ...updates } : element
    )
    onUpdateBusinessInfo({ elements: updatedElements })
  }

  const handleDeleteElement = (id: string) => {
    const updatedElements = businessInfo.elements.filter(element => element.id !== id)
    onUpdateBusinessInfo({ elements: updatedElements })
    onSelectElement(null)
  }

  const getDefaultContent = (type: PageElement['type']) => {
    switch (type) {
      case 'heading':
        return { text: '사업자 정보', level: 3 as const }
      case 'text':
        return { text: '회사명: 예시 회사\n주소: 서울시 강남구\n전화: 02-1234-5678\n이메일: info@example.com' }
      case 'image':
        return { src: '', alt: '회사 로고', width: 100, height: 100, link: '' }
      case 'text-image':
        return { 
          text: '회사명: 예시 회사\n주소: 서울시 강남구\n전화: 02-1234-5678', 
          src: '', 
          alt: '회사 로고', 
          width: 100, 
          height: 100, 
          link: '',
          layout: 'left' as 'left' | 'right' | 'top' | 'bottom'
        }
      case 'button':
        return { buttonText: '문의하기', link: 'mailto:info@example.com' }
      default:
        return {}
    }
  }

  if (!businessInfo?.isVisible) {
    return null
  }

  return (
    <div 
      className="w-full border-t-2 border-gray-200 relative"
      style={{ backgroundColor: businessInfo.backgroundColor }}
    >
      {!isPreview && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            title="사업자정보 편집"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onUpdateBusinessInfo({ isVisible: false })}
            className="p-2 bg-white border border-red-300 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
            title="사업자정보 삭제"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {isEditing && !isPreview && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-3">사업자정보 편집 모드</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'heading' as const, label: '제목' },
                { type: 'text' as const, label: '텍스트' },
                { type: 'image' as const, label: '이미지' },
                { type: 'text-image' as const, label: '텍스트+이미지' },
                { type: 'button' as const, label: '버튼' }
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => handleAddElement(type)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  + {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {businessInfo.elements.length === 0 && !isPreview ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏢</div>
              <p className="text-sm">사업자정보를 추가하려면 편집 버튼을 클릭하세요</p>
            </div>
          ) : (
            businessInfo.elements
              .sort((a, b) => a.order - b.order)
              .map((element, index) => (
                <div key={element.id} className="relative">
                  {!isPreview ? (
                    <div className="relative group">
                      <DraggableElement
                        element={element}
                        index={index}
                        isSelected={selectedElementId === element.id}
                        onSelect={() => onSelectElement(element)}
                        onUpdate={handleUpdateElement}
                        onMove={(dragIndex, hoverIndex) => {
                          const sortedElements = [...businessInfo.elements].sort((a, b) => a.order - b.order)
                          const dragElement = sortedElements[dragIndex]
                          const newElements = [...sortedElements]
                          newElements.splice(dragIndex, 1)
                          newElements.splice(hoverIndex, 0, dragElement)
                          
                          const updatedElements = newElements.map((el, idx) => ({
                            ...el,
                            order: idx
                          }))
                          
                          onUpdateBusinessInfo({ elements: updatedElements })
                        }}
                        settings={settings}
                      />
                      {/* 요소 편집/삭제 버튼들 */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectElement(element)
                          }}
                          className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600"
                          title="이 요소 편집"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteElement(element.id)
                          }}
                          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          title="이 요소 삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ElementRenderer
                      element={element}
                      settings={settings}
                      isPreview={isPreview}
                    />
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}