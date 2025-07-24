'use client'

import { useEffect, useState, useRef } from 'react'
import { WidgetConfig } from '@/types/builder'
import FloatingMenu from './FloatingMenu'

interface WidgetRendererProps {
  widgetType: string
  config: WidgetConfig
  isPreview?: boolean
}

export default function WidgetRenderer({ widgetType, config, isPreview = false }: WidgetRendererProps) {
  // 플로팅 메뉴는 wrapper 없이 직접 렌더링
  if (widgetType === 'floating-menu') {
    return <FloatingMenu config={config} isPreview={isPreview} />
  }

  const widgetClasses = `
    ${config.sticky ? 'sticky top-0 z-50' : ''}
    ${config.fullWidth && !isPreview ? 'w-screen -mx-4 md:-mx-8 lg:-mx-16' : ''}
  `.trim()

  const WidgetComponent = () => {
    switch (widgetType) {
      case 'applicant-list':
        return <ApplicantListWidget config={config} isPreview={isPreview} />
      case 'countdown-banner':
        return <CountdownBannerWidget config={config} isPreview={isPreview} />
      case 'discount-counter':
        return <DiscountCounterWidget config={config} isPreview={isPreview} />
      case 'visitor-count':
        return <VisitorCountWidget config={config} isPreview={isPreview} />
      case 'stock-alert':
        return <StockAlertWidget config={config} isPreview={isPreview} />
      default:
        return <div className="p-4 text-gray-500">알 수 없는 위젯 타입입니다.</div>
    }
  }

  return (
    <div className={widgetClasses}>
      <WidgetComponent />
    </div>
  )
}

// 신청자 목록 위젯
function ApplicantListWidget({ config, isPreview }: { config: WidgetConfig, isPreview: boolean }) {
  const [applicants, setApplicants] = useState<Array<{
    id: string
    name: string
    phone: string
    timestamp: Date
  }>>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const sampleNames = [
    '김민수', '이영희', '박철호', '정수진', '최혜림', '장동건', '윤서연', '한지민',
    '오세훈', '강유진', '임채영', '송지은', '배현우', '서민준', '황태희', '권순영',
    '조현우', '신민아', '홍길동', '유재석', '강호동', '김종국', '송중기', '전지현'
  ]

  const formatName = (name: string) => {
    switch (config.nameFormat) {
      case 'mask': return name.charAt(0) + '*'.repeat(name.length - 1)
      case 'initial': return name.charAt(0) + '*' + name.charAt(name.length - 1)
      default: return name
    }
  }

  const formatPhone = (phone: string) => {
    switch (config.phoneFormat) {
      case 'mask': return phone.slice(0, 3) + '-' + '*'.repeat(4) + '-' + phone.slice(-2) + '**'
      case 'partial': return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + '**' + phone.slice(-2)
      default: return phone
    }
  }

  const generateRandomApplicant = () => {
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)]
    const phone = '010-' + 
      Math.floor(1000 + Math.random() * 9000).toString() + '-' +
      Math.floor(1000 + Math.random() * 9000).toString()
    
    return {
      id: Date.now().toString() + Math.random(),
      name,
      phone,
      timestamp: new Date()
    }
  }

  useEffect(() => {
    if (!isPreview) return
    
    // 더 많은 초기 데이터 생성
    const maxItems = config.maxItems || 5
    const initialApplicants = Array.from({ length: maxItems * 2 }, generateRandomApplicant)
    setApplicants(initialApplicants)

    // 롤링 애니메이션
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (initialApplicants.length - maxItems + 1))
    }, config.animationSpeed || config.rollingSpeed || 3000)

    return () => clearInterval(interval)
  }, [config, isPreview])

  return (
    <div 
      className="p-4 rounded-lg border shadow-sm"
      style={{
        backgroundColor: config.backgroundColor || '#f8f9fa',
        borderColor: config.borderColor || '#e9ecef',
        borderRadius: config.borderRadius || '8px'
      }}
    >
      <h3 
        className="font-semibold mb-3 text-center"
        style={{ color: config.textColor || '#333' }}
      >
        {config.title || '📝 실시간 신청자 현황'}
      </h3>
      
      <div className="space-y-2 max-h-60 overflow-hidden">
        {applicants.slice(currentIndex, currentIndex + (config.maxItems || 5)).map((applicant, index) => (
          <div
            key={applicant.id}
            className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-blue-500 transition-all duration-500 ease-in-out transform"
            style={{
              animationDelay: `${index * 0.1}s`,
              opacity: isPreview ? 1 : 0,
              animation: isPreview ? 'slideInUp 0.5s ease-in forwards' : 'none'
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">👤</span>
              <div>
                <div className="font-medium text-gray-800">
                  {formatName(applicant.name)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatPhone(applicant.phone)}
                </div>
              </div>
            </div>
            {config.showTimestamp && (
              <div className="text-xs text-gray-500">
                {index === 0 ? '방금 전' : `${index}분 전`}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// 카운트다운 배너 위젯
function CountdownBannerWidget({ config, isPreview }: { config: WidgetConfig, isPreview: boolean }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!config.targetDate) return

    const targetTime = new Date(config.targetDate).getTime()
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetTime - now

      if (distance < 0) {
        setIsExpired(true)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [config.targetDate])

  if (isExpired) {
    return (
      <div 
        className="w-full py-3 px-4 text-center font-bold"
        style={{
          backgroundColor: config.urgentColor || '#dc3545',
          color: 'white'
        }}
      >
        {config.completedText || '⏰ 이벤트가 종료되었습니다!'}
      </div>
    )
  }

  return (
    <div 
      className={`w-full py-3 px-4 text-center font-bold ${config.sticky ? 'sticky top-0 z-50' : ''}`}
      style={{
        backgroundColor: config.backgroundColor || '#ff6b35',
        color: config.textColor || 'white',
        animation: config.animation ? 'pulse 2s infinite' : 'none'
      }}
    >
      <div className="flex items-center justify-center space-x-4 text-sm md:text-base">
        <span className="text-yellow-300">🔥</span>
        <span>{config.bannerText || '특가 이벤트 마감까지'}</span>
        <div className="flex space-x-2">
          {timeLeft.days > 0 && (
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              {timeLeft.days}일
            </span>
          )}
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
            {timeLeft.hours.toString().padStart(2, '0')}시간
          </span>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
            {timeLeft.minutes.toString().padStart(2, '0')}분
          </span>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
            {timeLeft.seconds.toString().padStart(2, '0')}초
          </span>
        </div>
        <span className="text-yellow-300">🔥</span>
      </div>
    </div>
  )
}

// 할인 카운터 위젯
function DiscountCounterWidget({ config, isPreview }: { config: WidgetConfig, isPreview: boolean }) {
  const [count, setCount] = useState(config.currentCount || 0)

  useEffect(() => {
    if (!isPreview) return

    const baseSpeed = config.animationSpeed || 3000
    const interval = setInterval(() => {
      setCount(prev => prev + (config.increment || 1))
    }, baseSpeed + Math.random() * 2000) // 설정된 속도 ± 1초 랜덤

    return () => clearInterval(interval)
  }, [config, isPreview])

  return (
    <div 
      className="p-4 rounded-lg text-center"
      style={{
        backgroundColor: config.backgroundColor || '#e8f5e8',
        borderColor: config.borderColor || '#28a745',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: config.borderRadius || '8px'
      }}
    >
      <h3 
        className="font-semibold mb-2"
        style={{ color: config.textColor || '#155724' }}
      >
        {config.title || '💰 실시간 할인 혜택'}
      </h3>
      <div className="text-2xl font-bold" style={{ color: config.textColor || '#155724' }}>
        {config.prefix || '지금까지 '}<span className="text-red-500">{count.toLocaleString()}</span>{config.suffix || '명이 50% 할인받았습니다!'}
      </div>
    </div>
  )
}

// 방문자 수 위젯
function VisitorCountWidget({ config, isPreview }: { config: WidgetConfig, isPreview: boolean }) {
  const [visitors, setVisitors] = useState(config.baseCount || 234)

  useEffect(() => {
    if (!isPreview) return

    const baseSpeed = config.animationSpeed || 5000
    const interval = setInterval(() => {
      const variation = config.variation || 10
      const change = Math.floor(Math.random() * variation) - Math.floor(variation / 2)
      setVisitors(prev => Math.max(1, prev + change))
    }, baseSpeed + Math.random() * baseSpeed) // 설정된 속도 ± 50% 랜덤

    return () => clearInterval(interval)
  }, [config, isPreview])

  return (
    <div 
      className="p-3 rounded-lg border-l-4 border-blue-500"
      style={{
        backgroundColor: config.backgroundColor || '#f0f8ff',
        borderRadius: config.borderRadius || '6px'
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-xl">👀</span>
        <div>
          <div className="text-sm text-gray-600">{config.title || '실시간 조회'}</div>
          <div className="font-semibold" style={{ color: config.textColor || '#0066cc' }}>
            현재 <span className="text-red-500">{visitors}</span>명이 이 페이지를 보고 있습니다
          </div>
        </div>
      </div>
    </div>
  )
}

// 재고 알림 위젯
function StockAlertWidget({ config, isPreview }: { config: WidgetConfig, isPreview: boolean }) {
  const [currentStock, setCurrentStock] = useState(config.currentStock || 23)
  const totalStock = config.totalStock || 100
  const lowThreshold = config.lowStockThreshold || 30
  const percentage = (currentStock / totalStock) * 100
  const isLowStock = currentStock <= lowThreshold

  useEffect(() => {
    if (!isPreview) return

    const baseSpeed = config.animationSpeed || 8000
    const interval = setInterval(() => {
      setCurrentStock(prev => Math.max(0, prev - Math.floor(Math.random() * 3)))
    }, baseSpeed + Math.random() * 3000) // 설정된 속도 ± 1.5초 랜덤

    return () => clearInterval(interval)
  }, [isPreview])

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: config.backgroundColor || (isLowStock ? '#fff5f5' : '#f0fff4'),
        borderColor: config.borderColor || (isLowStock ? '#fc8181' : '#68d391'),
        borderRadius: config.borderRadius || '8px'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 
          className="font-semibold"
          style={{ color: config.textColor || (isLowStock ? '#c53030' : '#2f855a') }}
        >
          {config.title || '🎯 한정수량 알림'}
        </h3>
        {isLowStock && <span className="text-red-500 text-xl animate-pulse">⚠️</span>}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>남은 수량</span>
          <span className="font-semibold">
            {totalStock}개 중 <span className={isLowStock ? 'text-red-500' : 'text-green-500'}>
              {currentStock}개 남음
            </span>
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isLowStock ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {isLowStock && (
          <div className="text-xs text-red-600 font-medium">
            ⏰ 품절 임박! 서둘러 주문하세요!
          </div>
        )}
      </div>
    </div>
  )
}