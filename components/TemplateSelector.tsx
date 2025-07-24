'use client'

import { useState } from 'react'
import { PageElement, PageSettings } from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  elements: PageElement[]
  settings: PageSettings
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: { elements: PageElement[], settings: PageSettings }) => void
  onClose: () => void
}

const templates: Template[] = [
  {
    id: 'basic-landing',
    name: '기본 랜딩페이지',
    description: '헤딩, 텍스트, 이미지, 버튼으로 구성된 기본 템플릿',
    thumbnail: '📄',
    elements: [
      {
        id: uuidv4(),
        type: 'heading',
        content: { text: '놓치면 후회하는 특별한 기회!', level: 1 },
        styles: { textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' },
        order: 0
      },
      {
        id: uuidv4(),
        type: 'text',
        content: { text: '지금 바로 신청하세요. 한정된 시간, 한정된 수량으로 제공되는 특별 혜택을 놓치지 마세요!' },
        styles: { textAlign: 'center', fontSize: '1.2rem', color: '#6b7280', margin: '20px 0' },
        order: 1
      },
      {
        id: uuidv4(),
        type: 'image',
        content: { src: '', alt: '메인 이미지', width: 400, height: 300 },
        styles: { alignSelf: 'center' },
        order: 2
      },
      {
        id: uuidv4(),
        type: 'button',
        content: { buttonText: '지금 신청하기', link: '#form' },
        styles: { alignSelf: 'center', backgroundColor: '#3b82f6', color: '#ffffff', padding: '15px 30px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold' },
        order: 3
      }
    ],
    settings: {
      title: '특별 혜택 랜딩페이지',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      businessInfo: {
        id: 'business-info',
        isVisible: false,
        backgroundColor: '#f8f9fa',
        elements: []
      }
    }
  },
  {
    id: 'promotion-page',
    name: '프로모션 페이지',
    description: '카운트다운, 할인 정보, 긴급성을 강조하는 템플릿',
    thumbnail: '🔥',
    elements: [
      {
        id: uuidv4(),
        type: 'widget',
        content: {
          widgetType: 'countdown-banner',
          widgetConfig: {
            title: '🔥 한정 특가 이벤트 마감까지',
            backgroundColor: '#dc2626',
            textColor: '#ffffff',
            borderColor: '#dc2626',
            borderRadius: '0px',
            animation: true,
            animationSpeed: 1000,
            sticky: true,
            fullWidth: true,
            targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            bannerText: '특가 이벤트 마감까지',
            urgentColor: '#dc3545',
            completedText: '⏰ 이벤트가 종료되었습니다!',
            position: 'top'
          }
        },
        order: 0
      },
      {
        id: uuidv4(),
        type: 'heading',
        content: { text: '💸 50% 특가 할인', level: 1 },
        styles: { textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', color: '#dc2626' },
        order: 1
      },
      {
        id: uuidv4(),
        type: 'widget',
        content: {
          widgetType: 'discount-counter',
          widgetConfig: {
            title: '💰 지금까지 혜택받은 고객',
            backgroundColor: '#fef3c7',
            textColor: '#92400e',
            borderColor: '#f59e0b',
            borderRadius: '8px',
            animation: true,
            animationSpeed: 2000,
            sticky: false,
            fullWidth: false,
            currentCount: 1247,
            increment: 1,
            suffix: '명이 50% 할인받았습니다!',
            prefix: '지금까지 '
          }
        },
        order: 2
      },
      {
        id: uuidv4(),
        type: 'button',
        content: { buttonText: '⚡ 지금 바로 신청', link: '#' },
        styles: { alignSelf: 'center', backgroundColor: '#dc2626', color: '#ffffff', padding: '20px 40px', borderRadius: '12px', fontSize: '1.3rem', fontWeight: 'bold' },
        order: 3
      }
    ],
    settings: {
      title: '한정 특가 프로모션',
      primaryColor: '#dc2626',
      backgroundColor: '#ffffff',
      businessInfo: {
        id: 'business-info',
        isVisible: false,
        backgroundColor: '#f8f9fa',
        elements: []
      }
    }
  },
  {
    id: 'form-landing',
    name: '신청서 랜딩페이지',
    description: '폼과 실시간 신청자 현황이 포함된 템플릿',
    thumbnail: '📝',
    elements: [
      {
        id: uuidv4(),
        type: 'heading',
        content: { text: '무료 상담 신청하기', level: 1 },
        styles: { textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' },
        order: 0
      },
      {
        id: uuidv4(),
        type: 'text',
        content: { text: '전문가와 1:1 무료 상담을 받아보세요. 맞춤형 솔루션을 제공해드립니다.' },
        styles: { textAlign: 'center', fontSize: '1.1rem', color: '#6b7280', margin: '20px 0' },
        order: 1
      },
      {
        id: uuidv4(),
        type: 'widget',
        content: {
          widgetType: 'applicant-list',
          widgetConfig: {
            title: '📝 실시간 신청자 현황',
            backgroundColor: '#eff6ff',
            textColor: '#1e40af',
            borderColor: '#3b82f6',
            borderRadius: '8px',
            animation: true,
            animationSpeed: 3000,
            sticky: false,
            fullWidth: false,
            maxItems: 4,
            rollingSpeed: 4000,
            showTimestamp: true,
            nameFormat: 'mask',
            phoneFormat: 'mask'
          }
        },
        order: 2
      },
      {
        id: uuidv4(),
        type: 'form',
        content: {
          fields: [
            { id: uuidv4(), type: 'text' as const, label: '이름', placeholder: '이름을 입력하세요', required: true },
            { id: uuidv4(), type: 'tel' as const, label: '전화번호', placeholder: '010-0000-0000', required: true },
            { id: uuidv4(), type: 'email' as const, label: '이메일', placeholder: '이메일을 입력하세요', required: false }
          ]
        },
        order: 3
      },
      {
        id: uuidv4(),
        type: 'widget',
        content: {
          widgetType: 'floating-menu',
          widgetConfig: {
            title: '상담 문의',
            backgroundColor: '#10b981',
            textColor: '#ffffff',
            borderColor: '#059669',
            borderRadius: '50%',
            animation: true,
            animationSpeed: 0,
            sticky: false,
            fullWidth: false,
            kakaoChannelUrl: 'https://pf.kakao.com/_your_channel',
            phoneNumber: '010-1234-5678',
            position: 'bottom-right'
          }
        },
        order: 4
      }
    ],
    settings: {
      title: '무료 상담 신청',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      businessInfo: {
        id: 'business-info',
        isVisible: false,
        backgroundColor: '#f8f9fa',
        elements: []
      }
    }
  }
]

export default function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template.id)
    onSelectTemplate({
      elements: template.elements,
      settings: template.settings
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">템플릿 선택</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">마음에 드는 템플릿을 선택하여 빠르게 시작하세요</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{template.thumbnail}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>요소 개수:</span>
                    <span>{template.elements.length}개</span>
                  </div>
                </div>

                <button 
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectTemplate(template)
                  }}
                >
                  이 템플릿 사용하기
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              나중에 선택
            </button>
            <div className="text-sm text-gray-500">
              템플릿을 선택하지 않고 빈 페이지로 시작할 수도 있습니다
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}