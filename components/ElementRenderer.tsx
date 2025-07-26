'use client'

import { useState } from 'react'
import { PageElement, PageSettings } from '@/types/builder'
import Image from 'next/image'
import WidgetRenderer from './WidgetRenderer'

interface ElementRendererProps {
  element: PageElement
  settings: PageSettings
  isPreview: boolean
  onUpdate?: (id: string, updates: Partial<PageElement>) => void
}

export default function ElementRenderer({
  element,
  settings,
  isPreview,
  onUpdate
}: ElementRendererProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const handleDoubleClick = () => {
    if (isPreview || !onUpdate) return
    
    if (element.type === 'heading' || element.type === 'text') {
      setEditValue(element.content.text || '')
      setIsEditing(true)
    }
  }

  const handleSaveEdit = () => {
    if (!onUpdate) return
    
    onUpdate(element.id, {
      content: { ...element.content, text: editValue }
    })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const getTextStyle = () => ({
    color: element.styles?.color || (element.type === 'heading' ? settings.primaryColor : '#000000'),
    textAlign: element.styles?.textAlign || 'left',
    fontSize: element.styles?.fontSize,
    fontWeight: element.styles?.fontWeight,
    margin: '0',
    padding: '0',
  })

  const getElementStyle = () => ({
    alignSelf: element.styles?.alignSelf || 'flex-start',
    padding: element.styles?.padding || '0',
    margin: element.styles?.margin || '0',
  })

  const getButtonStyle = () => ({
    backgroundColor: element.styles?.backgroundColor || settings.primaryColor,
    color: element.styles?.color || '#ffffff',
    borderRadius: element.styles?.borderRadius || '8px',
    padding: element.styles?.padding || '12px 24px',
  })

  switch (element.type) {
    case 'heading':
      const HeadingTag = `h${element.content.level || 1}` as keyof JSX.IntrinsicElements
      const headingContent = (
        <div style={getElementStyle()}>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-3xl font-bold border-2 border-blue-500 rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <HeadingTag
              className={`text-3xl font-bold cursor-pointer ${isPreview ? '' : 'hover:bg-gray-100'}`}
              style={getTextStyle()}
              onDoubleClick={handleDoubleClick}
            >
              {element.content.text || '제목'}
            </HeadingTag>
          )}
        </div>
      )
      
      return element.content.link && isPreview ? (
        <a
          href={element.content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
        >
          {headingContent}
        </a>
      ) : (
        headingContent
      )

    case 'text':
      const textContent = (
        <div style={getElementStyle()}>
          {isEditing ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full border-2 border-blue-500 rounded px-2 py-1 resize-none"
              rows={3}
              autoFocus
            />
          ) : (
            <p
              className={`cursor-pointer ${isPreview ? '' : 'hover:bg-gray-100'}`}
              style={getTextStyle()}
              onDoubleClick={handleDoubleClick}
            >
              {element.content.text || '텍스트'}
            </p>
          )}
        </div>
      )
      
      return element.content.link && isPreview ? (
        <a
          href={element.content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
        >
          {textContent}
        </a>
      ) : (
        textContent
      )

    case 'image':
      const imageElement = element.content.src ? (
        <img
          src={element.content.src}
          alt={element.content.alt || ''}
          className="w-full h-auto max-w-full"
          style={{
            maxWidth: element.content.width || '100%',
            height: element.content.height ? `${element.content.height}px` : 'auto'
          }}
        />
      ) : (
        <div 
          className="bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300"
          style={{
            width: element.content.width || 400,
            height: element.content.height || 300
          }}
        >
          <span className="text-gray-500">이미지를 업로드하세요</span>
        </div>
      )

      const imageContainerClass = element.content.fullWidth && !isPreview
        ? "w-screen -mx-4 md:-mx-8 lg:-mx-16" 
        : ""

      return (
        <div className={imageContainerClass} style={getElementStyle()}>
          {element.content.link && isPreview ? (
            <a
              href={element.content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
            >
              {imageElement}
            </a>
          ) : (
            imageElement
          )}
        </div>
      )

    case 'text-image':
      const textImageElement = element.content.src ? (
        <img
          src={element.content.src}
          alt={element.content.alt || ''}
          className="flex-shrink-0"
          style={{
            width: element.content.width || 100,
            height: element.content.height || 100
          }}
        />
      ) : (
        <div 
          className="bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0"
          style={{
            width: element.content.width || 100,
            height: element.content.height || 100
          }}
        >
          <span className="text-xs text-gray-500">이미지</span>
        </div>
      )

      const textContent = (
        <div className="flex-1">
          <p className="whitespace-pre-line" style={getTextStyle()}>
            {element.content.text || '텍스트 + 이미지'}
          </p>
        </div>
      )

      const layout = element.content.layout || 'left'
      const flexDirection = layout === 'top' ? 'flex-col' : layout === 'bottom' ? 'flex-col-reverse' : 'flex-row'
      const imageOrder = layout === 'right' ? 'order-2' : ''
      const textOrder = layout === 'right' ? 'order-1' : ''

      const combinedElement = (
        <div className={`flex ${flexDirection} items-center gap-4`} style={getElementStyle()}>
          <div className={imageOrder}>
            {textImageElement}
          </div>
          <div className={textOrder}>
            {textContent}
          </div>
        </div>
      )

      return element.content.link && isPreview ? (
        <a
          href={element.content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
        >
          {combinedElement}
        </a>
      ) : (
        combinedElement
      )

    case 'video':
      return (
        <div style={getElementStyle()}>
          {element.content.url ? (
            <div className="aspect-video">
              <iframe
                src={element.content.url}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <span className="text-gray-500">동영상 URL을 입력하세요</span>
            </div>
          )}
        </div>
      )

    case 'button':
      return (
        <div style={getElementStyle()}>
          <button
            className="font-semibold transition-opacity hover:opacity-80"
            style={getButtonStyle()}
            onClick={(e) => {
              if (isPreview && element.content.link) {
                window.open(element.content.link, '_blank')
              } else {
                e.preventDefault()
              }
            }}
          >
            {element.content.buttonText || '버튼'}
          </button>
        </div>
      )

    case 'form':
      return (
        <div style={getElementStyle()}>
          <form
            className="space-y-4 max-w-md"
            onSubmit={(e) => {
              e.preventDefault()
              if (isPreview) {
                // 실제 폼 제출 로직
                handleFormSubmit(e, element.id)
              }
            }}
          >
            {element.content.fields?.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md font-semibold text-white transition-colors"
              style={{ backgroundColor: settings.primaryColor }}
            >
              제출하기
            </button>
          </form>
        </div>
      )

    case 'spacer':
      return (
        <div
          className="w-full"
          style={{ height: `${element.content.spacing || 32}px` }}
        />
      )

    case 'html':
      const htmlContent = element.content.html || '<div style="padding: 20px; text-align: center; color: #666; border: 2px dashed #ddd; border-radius: 8px;">HTML 코드를 입력하세요</div>'
      const cssContent = element.content.css || ''
      
      return (
        <div className="w-full">
          {/* CSS 스타일 주입 */}
          {cssContent && (
            <style 
              dangerouslySetInnerHTML={{ 
                __html: cssContent 
              }} 
            />
          )}
          
          {/* HTML 콘텐츠 렌더링 */}
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ 
              __html: htmlContent
            }}
            style={{
              // 기본 스타일 초기화
              all: 'unset',
              display: 'block',
              width: '100%'
            }}
          />
        </div>
      )

    case 'widget':
      return (
        <div style={getElementStyle()}>
          <WidgetRenderer
            widgetType={element.content.widgetType || 'applicant-list'}
            config={element.content.widgetConfig || {}}
            isPreview={isPreview}
          />
        </div>
      )

    default:
      return null
  }
}

async function handleFormSubmit(e: React.FormEvent, elementId: string) {
  const formData = new FormData(e.target as HTMLFormElement)
  const data: any = {}
  
  formData.forEach((value, key) => {
    data[key] = value
  })

  try {
    // URL에서 페이지 ID 추출 (실제 구현에서는 context나 props로 전달)
    const pageId = window.location.pathname.split('/').pop()
    
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_id: pageId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        data
      }),
    })

    if (response.ok) {
      const result = await response.json()
      alert(result.message || '제출이 완료되었습니다! 관리자에게 알림이 전송되었습니다.')
      ;(e.target as HTMLFormElement).reset()
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || '제출 실패')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    alert('제출 중 오류가 발생했습니다.')
  }
}