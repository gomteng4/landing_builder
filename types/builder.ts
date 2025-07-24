export interface PageElement {
  id: string
  type: 'heading' | 'text' | 'image' | 'video' | 'button' | 'form' | 'spacer' | 'html' | 'widget'
  content: ElementContent
  styles?: ElementStyles
  order: number
}

export interface ElementContent {
  // Heading
  text?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  
  // Image
  src?: string
  alt?: string
  width?: number
  height?: number
  link?: string  // 이미지 링크
  fullWidth?: boolean // 전체 너비 사용
  
  // Video
  url?: string
  
  // Button
  buttonText?: string
  
  // Form
  fields?: FormField[]
  
  // Spacer
  spacing?: number
  
  // HTML
  html?: string
  css?: string
  
  // Widget
  widgetType?: 'applicant-list' | 'countdown-banner' | 'discount-counter' | 'visitor-count' | 'stock-alert' | 'floating-menu'
  widgetConfig?: WidgetConfig
}

export interface WidgetConfig {
  // 공통 설정
  title?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  animation?: boolean
  animationSpeed?: number // milliseconds
  sticky?: boolean
  fullWidth?: boolean
  
  // 신청자 목록 위젯
  maxItems?: number
  rollingSpeed?: number // milliseconds
  showTimestamp?: boolean
  nameFormat?: 'mask' | 'initial' | 'full'
  phoneFormat?: 'mask' | 'partial' | 'full'
  
  // 카운트다운 배너
  targetDate?: string
  bannerText?: string
  urgentColor?: string
  completedText?: string
  position?: 'top' | 'bottom'
  
  // 할인 카운터
  currentCount?: number
  increment?: number
  suffix?: string
  prefix?: string
  
  // 방문자 수
  baseCount?: number
  variation?: number // 변동 범위
  
  // 재고 알림
  totalStock?: number
  currentStock?: number
  lowStockThreshold?: number
  
  // 플로팅 메뉴
  kakaoChannelUrl?: string
  phoneNumber?: string
  menuPosition?: 'bottom-right' | 'bottom-left'
}

export interface ElementStyles {
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  padding?: string
  margin?: string
  borderRadius?: string
  alignSelf?: 'flex-start' | 'center' | 'flex-end'  // 요소 정렬
}

export interface FormField {
  id: string
  type: 'text' | 'email' | 'tel'
  label: string
  placeholder?: string
  required: boolean
}

export interface BusinessInfoSection {
  id: string
  isVisible: boolean
  backgroundColor: string
  elements: PageElement[]
}

export interface PageSettings {
  title: string
  primaryColor: string
  backgroundColor: string
  businessInfo: BusinessInfoSection
}

export interface BuilderState {
  elements: PageElement[]
  selectedElementId: string | null
  isPreviewMode: boolean
  settings: PageSettings
}