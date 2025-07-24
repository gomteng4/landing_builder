'use client'

import { useState } from 'react'
import { Phone, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react'

interface FloatingMenuConfig {
  kakaoChannelUrl?: string
  phoneNumber?: string
  isVisible?: boolean
  position?: 'bottom-right' | 'bottom-left'
  backgroundColor?: string
  textColor?: string
}

interface FloatingMenuProps {
  config: FloatingMenuConfig
  isPreview?: boolean
}

export default function FloatingMenu({ config, isPreview = false }: FloatingMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 플로팅 메뉴는 기본적으로 표시됨 (페이지에 추가되면 항상 보임)
  if (config.isVisible === false) {
    return null
  }

  const position = config.position === 'bottom-left' ? 'left-4' : 'right-4'
  const bgColor = config.backgroundColor || '#007bff'
  const textColor = config.textColor || '#ffffff'

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      
      <div className={`fixed bottom-4 ${position} z-50 flex flex-col ${config.position === 'bottom-left' ? 'items-start' : 'items-end'} space-y-2`}>
        {/* 확장된 메뉴 아이템들 */}
        {isExpanded && (
          <div className="flex flex-col space-y-2 animate-slide-up">
            {config.kakaoChannelUrl && (
              <button
                onClick={() => {
                  if (!isPreview && config.kakaoChannelUrl) {
                    window.open(config.kakaoChannelUrl, '_blank')
                  }
                }}
                className="flex items-center space-x-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
                style={{ 
                  backgroundColor: '#fee500',
                  color: '#3c1e1e'
                }}
              >
                <MessageCircle size={20} />
                <span className="font-medium">카카오 상담</span>
              </button>
            )}
            
            {config.phoneNumber && (
              <button
                onClick={() => {
                  if (!isPreview && config.phoneNumber) {
                    window.location.href = `tel:${config.phoneNumber}`
                  }
                }}
                className="flex items-center space-x-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
                style={{ 
                  backgroundColor: '#28a745',
                  color: '#ffffff'
                }}
              >
                <Phone size={20} />
                <span className="font-medium">전화 상담</span>
              </button>
            )}
          </div>
        )}

        {/* 메인 토글 버튼 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: bgColor,
            color: textColor
          }}
          aria-label="상담 메뉴"
        >
          {isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </button>
      </div>
    </>
  )
}