'use client'

import { useState, useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PageElement, PageSettings, BuilderState } from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'

// WidgetEditor에서 가져온 기본 설정 함수
function getDefaultWidgetConfig(widgetType: string) {
  switch (widgetType) {
    case 'applicant-list':
      return {
        title: '📝 실시간 신청자 현황',
        backgroundColor: '#f8f9fa',
        textColor: '#333333',
        borderColor: '#e9ecef',
        borderRadius: '8px',
        animation: true,
        animationSpeed: 2000,
        sticky: false,
        fullWidth: false,
        maxItems: 5,
        rollingSpeed: 4000,
        showTimestamp: true,
        nameFormat: 'mask',
        phoneFormat: 'mask'
      }
    case 'countdown-banner':
      return {
        title: '🔥 특가 이벤트 마감까지',
        backgroundColor: '#ff6b35',
        textColor: '#ffffff',
        borderColor: '#ff6b35',
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
    case 'discount-counter':
      return {
        title: '💰 실시간 할인 혜택',
        backgroundColor: '#e8f5e8',
        textColor: '#155724',
        borderColor: '#28a745',
        borderRadius: '8px',
        animation: true,
        animationSpeed: 3000,
        sticky: false,
        fullWidth: false,
        currentCount: 1247,
        increment: 1,
        suffix: '명이 50% 할인받았습니다!',
        prefix: '지금까지 '
      }
    case 'visitor-count':
      return {
        title: '실시간 조회',
        backgroundColor: '#f0f8ff',
        textColor: '#0066cc',
        borderColor: '#4a90e2',
        borderRadius: '6px',
        animation: true,
        animationSpeed: 5000,
        sticky: false,
        fullWidth: false,
        baseCount: 234,
        variation: 10
      }
    case 'stock-alert':
      return {
        title: '🎯 한정수량 알림',
        backgroundColor: '#f0fff4',
        textColor: '#2f855a',
        borderColor: '#68d391',
        borderRadius: '8px',
        animation: true,
        animationSpeed: 4000,
        sticky: false,
        fullWidth: false,
        totalStock: 100,
        currentStock: 23,
        lowStockThreshold: 30
      }
    case 'floating-menu':
      return {
        title: '플로팅 메뉴',
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        borderColor: '#0056b3',
        borderRadius: '50%',
        animation: true,
        animationSpeed: 0,
        sticky: false,
        fullWidth: false,
        kakaoChannelUrl: 'https://pf.kakao.com/_your_channel',
        phoneNumber: '010-1234-5678',
        position: 'bottom-right'
      }
    default:
      return {}
  }
}
import BuilderCanvas from './BuilderCanvas'
import BuilderSidebar from './BuilderSidebar'
import BuilderHeader from './BuilderHeader'
import TemplateSelector from './TemplateSelector'
import NicknameDialog from './NicknameDialog'
import TemplateDialog from './TemplateDialog'
import { supabase } from '@/lib/supabase'

interface PageBuilderProps {
  initialData?: {
    elements: PageElement[]
    settings: PageSettings
  }
  pageId?: string
}

export default function PageBuilder({ initialData, pageId }: PageBuilderProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(!initialData && !pageId)
  const [showNicknameDialog, setShowNicknameDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [currentNickname, setCurrentNickname] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState('')
  const [builderState, setBuilderState] = useState<BuilderState>({
    elements: initialData?.elements || [],
    selectedElementId: null,
    isPreviewMode: false,
    settings: initialData?.settings || {
      title: '새 랜딩페이지',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      businessInfo: {
        id: 'business-info',
        isVisible: false,
        backgroundColor: '#f8f9fa',
        elements: []
      }
    }
  })

  const [isAddingElement, setIsAddingElement] = useState(false)

  // 페이지 정보 로드
  useEffect(() => {
    if (pageId) {
      loadPageInfo()
    }
  }, [pageId])

  const loadPageInfo = async () => {
    if (!pageId) return
    
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('nickname, is_published, published_url')
        .eq('id', pageId)
        .single()

      if (data && !error) {
        setCurrentNickname(data.nickname || '')
        setIsPublished(data.is_published || false)
        setPublishedUrl(data.published_url || '')
      }
    } catch (error) {
      console.error('페이지 정보 로드 실패:', error)
    }
  }

  const addElement = useCallback((type: PageElement['type'], widgetType?: string) => {
    console.log('Adding element:', type, 'widgetType:', widgetType, 'isAddingElement:', isAddingElement)
    
    if (isAddingElement) {
      console.log('Blocked: already adding element')
      return
    }
    
    setIsAddingElement(true)
    
    setBuilderState(prev => {
      const content = type === 'widget' && widgetType 
        ? { widgetType, widgetConfig: getDefaultWidgetConfig(widgetType) }
        : getDefaultContent(type)
        
      const newElement: PageElement = {
        id: uuidv4(),
        type,
        content,
        order: prev.elements.length,
      }

      console.log('New element created:', newElement)

      return {
        ...prev,
        elements: [...prev.elements, newElement],
        selectedElementId: newElement.id
      }
    })

    // 500ms 후 다시 추가 가능하도록
    setTimeout(() => {
      console.log('Resetting isAddingElement')
      setIsAddingElement(false)
    }, 500)
  }, [isAddingElement])

  const updateElement = useCallback((id: string, updates: Partial<PageElement>) => {
    setBuilderState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setBuilderState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedElementId: prev.selectedElementId === id ? null : prev.selectedElementId
    }))
  }, [])

  const selectElement = useCallback((id: string | null) => {
    setBuilderState(prev => ({
      ...prev,
      selectedElementId: id
    }))
  }, [])

  const moveElement = useCallback((dragIndex: number, hoverIndex: number) => {
    setBuilderState(prev => {
      const dragElement = prev.elements[dragIndex]
      const newElements = [...prev.elements]
      newElements.splice(dragIndex, 1)
      newElements.splice(hoverIndex, 0, dragElement)
      
      // Update order values
      const updatedElements = newElements.map((el, index) => ({
        ...el,
        order: index
      }))

      return {
        ...prev,
        elements: updatedElements
      }
    })
  }, [])

  const togglePreview = useCallback(() => {
    setBuilderState(prev => ({
      ...prev,
      isPreviewMode: !prev.isPreviewMode,
      selectedElementId: null
    }))
  }, [])

  const handleTemplateSelect = useCallback((template: { elements: PageElement[], settings: PageSettings }) => {
    setBuilderState(prev => ({
      ...prev,
      elements: template.elements,
      settings: template.settings
    }))
    setShowTemplateSelector(false)
  }, [])

  const updateSettings = useCallback((updates: Partial<PageSettings>) => {
    setBuilderState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }))
  }, [])

  const handleSaveNickname = useCallback(async (nickname: string) => {
    if (!pageId) return

    try {
      const { error } = await supabase
        .from('pages')
        .update({ nickname })
        .eq('id', pageId)

      if (error) throw error
      
      setCurrentNickname(nickname)
      alert('닉네임이 저장되었습니다!')
    } catch (error) {
      console.error('닉네임 저장 실패:', error)
      alert('닉네임 저장 중 오류가 발생했습니다.')
    }
  }, [pageId])

  const handleSaveAsTemplate = useCallback(async (templateName: string, description: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .insert({
          title: builderState.settings.title,
          slug: `template-${Date.now()}`,
          elements: builderState.elements,
          settings: builderState.settings,
          is_template: true,
          template_name: templateName,
          template_description: description,
          is_published: false
        })

      if (error) throw error
      
      alert('템플릿으로 저장되었습니다!')
    } catch (error) {
      console.error('템플릿 저장 실패:', error)
      alert('템플릿 저장 중 오류가 발생했습니다.')
    }
  }, [builderState])

  const savePage = useCallback(async () => {
    try {
      const payload = {
        title: builderState.settings.title,
        elements: builderState.elements,
        settings: builderState.settings,
        nickname: currentNickname
      }

      const response = pageId 
        ? await fetch(`/api/pages/${pageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        : await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

      if (!response.ok) {
        throw new Error('저장에 실패했습니다')
      }

      const data = await response.json()
      
      if (!pageId && data.id) {
        // 새 페이지인 경우 URL 업데이트
        window.history.replaceState(null, '', `/builder?id=${data.id}`)
      }

      // 랜덤 URL 생성된 경우 사용자에게 알림
      if (data.slug) {
        const randomUrl = `${window.location.origin}/r/${data.slug}`
        const message = `페이지가 저장되었습니다!\n\n랜덤 URL: ${randomUrl}\n\n이 URL을 공유하여 다른 사람들이 페이지에 접근할 수 있습니다.`
        alert(message)
        
        // 클립보드에 복사 (브라우저가 지원하는 경우)
        if (navigator.clipboard) {
          navigator.clipboard.writeText(randomUrl).catch(() => {
            // 클립보드 복사 실패 시 무시
          })
        }
      } else {
        alert('페이지가 저장되었습니다!')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }, [builderState, pageId, currentNickname])

  const handlePublish = useCallback(async () => {
    if (!pageId) {
      alert('페이지를 먼저 저장해주세요.')
      return
    }

    try {
      const response = await fetch(`/api/pages/${pageId}/publish`, {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '게시에 실패했습니다')
      }

      setIsPublished(true)
      setPublishedUrl(data.published_url)
      
      const fullUrl = `${window.location.origin}/r/${data.published_url}`
      const message = `페이지가 성공적으로 게시되었습니다!\\n\\n게시 URL: ${fullUrl}\\n\\n이 URL을 공유하여 다른 사람들이 페이지에 접근할 수 있습니다.`
      alert(message)
      
      // 클립보드에 복사
      if (navigator.clipboard) {
        navigator.clipboard.writeText(fullUrl).catch(() => {})
      }
    } catch (error) {
      console.error('게시 실패:', error)
      alert('게시 중 오류가 발생했습니다.')
    }
  }, [pageId])

  const handleUnpublish = useCallback(async () => {
    if (!pageId) return

    if (!confirm('정말로 게시를 취소하시겠습니까? 게시된 URL로 더 이상 접근할 수 없게 됩니다.')) {
      return
    }

    try {
      const response = await fetch(`/api/pages/${pageId}/publish`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '게시 취소에 실패했습니다')
      }

      setIsPublished(false)
      setPublishedUrl('')
      alert('페이지 게시가 취소되었습니다.')
    } catch (error) {
      console.error('게시 취소 실패:', error)
      alert('게시 취소 중 오류가 발생했습니다.')
    }
  }, [pageId])

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className="h-screen flex flex-col"
        style={{ 
          '--primary-color': builderState.settings.primaryColor,
          '--background-color': builderState.settings.backgroundColor 
        } as React.CSSProperties}
      >
        <BuilderHeader
          title={builderState.settings.title}
          isPreviewMode={builderState.isPreviewMode}
          onTogglePreview={togglePreview}
          onSave={savePage}
          pageId={pageId}
          onSaveAsTemplate={() => setShowTemplateDialog(true)}
          onShowNicknameDialog={() => setShowNicknameDialog(true)}
          isPublished={isPublished}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {!builderState.isPreviewMode && (
            <BuilderSidebar
              selectedElement={
                builderState.selectedElementId
                  ? builderState.elements.find(el => el.id === builderState.selectedElementId)
                  : null
              }
              settings={builderState.settings}
              onAddElement={addElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onUpdateSettings={updateSettings}
              isAddingElement={isAddingElement}
            />
          )}
          
          <BuilderCanvas
            elements={builderState.elements}
            selectedElementId={builderState.selectedElementId}
            isPreviewMode={builderState.isPreviewMode}
            settings={builderState.settings}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
            onMoveElement={moveElement}
            onUpdateSettings={updateSettings}
            onAddElement={addElement}
            onDeleteElement={deleteElement}
          />
        </div>
        
        {showTemplateSelector && (
          <TemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplateSelector(false)}
          />
        )}

        {showNicknameDialog && (
          <NicknameDialog
            currentNickname={currentNickname}
            onSave={handleSaveNickname}
            onClose={() => setShowNicknameDialog(false)}
          />
        )}

        {showTemplateDialog && (
          <TemplateDialog
            onSave={handleSaveAsTemplate}
            onClose={() => setShowTemplateDialog(false)}
          />
        )}
      </div>
    </DndProvider>
  )
}

function getDefaultContent(type: PageElement['type']) {
  switch (type) {
    case 'heading':
      return { text: '새 제목', level: 1 as const }
    case 'text':
      return { text: '여기에 텍스트를 입력하세요.' }
    case 'image':
      return { src: '', alt: '이미지', width: 400, height: 300 }
    case 'video':
      return { url: '' }
    case 'button':
      return { buttonText: '버튼', link: '#' }
    case 'form':
      return {
        fields: [
          { id: uuidv4(), type: 'text' as const, label: '이름', placeholder: '이름을 입력하세요', required: true },
          { id: uuidv4(), type: 'email' as const, label: '이메일', placeholder: '이메일을 입력하세요', required: true },
          { id: uuidv4(), type: 'tel' as const, label: '전화번호', placeholder: '전화번호를 입력하세요', required: false }
        ]
      }
    case 'spacer':
      return { spacing: 32 }
    case 'html':
      return { 
        html: '<div style="padding: 20px; text-align: center; color: #666; border: 2px dashed #ddd; border-radius: 8px; background: #f9f9f9;">Figma에서 복사한 HTML/CSS 코드를 붙여넣으세요<br><small>HTML 코드 요소를 클릭하여 편집할 수 있습니다</small></div>', 
        css: '' 
      }
    case 'widget':
      return {
        widgetType: 'applicant-list',
        widgetConfig: getDefaultWidgetConfig('applicant-list')
      }
    default:
      return {}
  }
}