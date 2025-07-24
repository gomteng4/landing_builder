'use client'

import { useState } from 'react'
import { PageElement, PageSettings, FormField } from '@/types/builder'
import { Plus, Trash2, Wand2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { convertFigmaToHTML } from '@/lib/figmaConverter'
import ColorPicker from './ColorPicker'
import WidgetRenderer from './WidgetRenderer'
import WidgetEditor from './WidgetEditor'

interface ElementEditorProps {
  element: PageElement
  onUpdate: (id: string, updates: Partial<PageElement>) => void
  settings: PageSettings
}

export default function ElementEditor({
  element,
  onUpdate,
  settings
}: ElementEditorProps) {
  const [activeStyleTab, setActiveStyleTab] = useState<'content' | 'style'>('content')

  const updateContent = (updates: any) => {
    onUpdate(element.id, {
      content: { ...element.content, ...updates }
    })
  }

  const updateStyles = (updates: any) => {
    onUpdate(element.id, {
      styles: { ...element.styles, ...updates }
    })
  }

  const addFormField = () => {
    const newField: FormField = {
      id: uuidv4(),
      type: 'text',
      label: '새 필드',
      placeholder: '',
      required: false
    }
    
    updateContent({
      fields: [...(element.content.fields || []), newField]
    })
  }

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = element.content.fields?.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    updateContent({ fields: updatedFields })
  }

  const removeFormField = (fieldId: string) => {
    const updatedFields = element.content.fields?.filter(field => field.id !== fieldId)
    updateContent({ fields: updatedFields })
  }

  return (
    <div className="space-y-4">
      {/* 탭 헤더 */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveStyleTab('content')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeStyleTab === 'content'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          내용
        </button>
        <button
          onClick={() => setActiveStyleTab('style')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeStyleTab === 'style'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          스타일
        </button>
      </div>

      {/* 내용 편집 */}
      {activeStyleTab === 'content' && (
        <div className="space-y-4">
          {element.type === 'heading' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 텍스트
                </label>
                <input
                  type="text"
                  value={element.content.text || ''}
                  onChange={(e) => updateContent({ text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 레벨
                </label>
                <select
                  value={element.content.level || 1}
                  onChange={(e) => updateContent({ level: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <option key={level} value={level}>H{level}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {element.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                텍스트 내용
              </label>
              <textarea
                value={element.content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {element.type === 'image' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 업로드
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const formData = new FormData()
                      formData.append('file', file)
                      
                      try {
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          
                          // 이미지 사이즈 자동 계산
                          const img = new Image()
                          img.onload = function() {
                            let width = img.width
                            let height = img.height
                            
                            // 최대 너비를 400px로 제한하고 비율 유지
                            const maxWidth = 400
                            if (width > maxWidth) {
                              height = (height * maxWidth) / width
                              width = maxWidth
                            }
                            
                            updateContent({ 
                              src: data.url,
                              width: Math.round(width),
                              height: Math.round(height)
                            })
                          }
                          img.src = data.url
                        } else {
                          alert('이미지 업로드에 실패했습니다.')
                        }
                      } catch (error) {
                        alert('이미지 업로드 중 오류가 발생했습니다.')
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF 파일 (최대 5MB)
                </p>
              </div>
              
              <div className="text-center text-gray-500 text-sm">또는</div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 URL
                </label>
                <input
                  type="url"
                  value={element.content.src || ''}
                  onChange={(e) => {
                    const url = e.target.value
                    updateContent({ src: url })
                    
                    // URL이 입력되면 이미지 사이즈 자동 계산
                    if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                      const img = new Image()
                      img.onload = function() {
                        let width = img.width
                        let height = img.height
                        
                        // 최대 너비를 400px로 제한하고 비율 유지
                        const maxWidth = 400
                        if (width > maxWidth) {
                          height = (height * maxWidth) / width
                          width = maxWidth
                        }
                        
                        updateContent({ 
                          width: Math.round(width),
                          height: Math.round(height)
                        })
                      }
                      img.src = url
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL (선택사항)
                </label>
                <input
                  type="url"
                  value={element.content.link || ''}
                  onChange={(e) => updateContent({ link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  이미지 클릭 시 이동할 링크
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대체 텍스트
                </label>
                <input
                  type="text"
                  value={element.content.alt || ''}
                  onChange={(e) => updateContent({ alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={element.content.fullWidth || false}
                    onChange={(e) => updateContent({ fullWidth: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">전체 너비</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  화면 전체 너비로 이미지를 표시합니다
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    너비 (px)
                  </label>
                  <input
                    type="number"
                    value={element.content.width || ''}
                    onChange={(e) => updateContent({ width: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    높이 (px)
                  </label>
                  <input
                    type="number"
                    value={element.content.height || ''}
                    onChange={(e) => updateContent({ height: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {element.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                동영상 URL
              </label>
              <input
                type="url"
                value={element.content.url || ''}
                onChange={(e) => updateContent({ url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                YouTube, Vimeo 등의 임베드 URL을 입력하세요
              </p>
            </div>
          )}

          {element.type === 'button' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  버튼 텍스트
                </label>
                <input
                  type="text"
                  value={element.content.buttonText || ''}
                  onChange={(e) => updateContent({ buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL
                </label>
                <input
                  type="url"
                  value={element.content.link || ''}
                  onChange={(e) => updateContent({ link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          {element.type === 'form' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  폼 필드
                </label>
                <button
                  onClick={addFormField}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>필드 추가</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {element.content.fields?.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        필드 {index + 1}
                      </span>
                      <button
                        onClick={() => removeFormField(field.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">유형</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateFormField(field.id, { type: e.target.value as any })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="text">텍스트</option>
                          <option value="email">이메일</option>
                          <option value="tel">전화번호</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">라벨</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">플레이스홀더</label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-xs text-gray-600">필수 필드</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {element.type === 'spacer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                간격 높이 (px)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="8"
                  max="128"
                  value={element.content.spacing || 32}
                  onChange={(e) => updateContent({ spacing: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>8px</span>
                  <span className="font-medium">{element.content.spacing || 32}px</span>
                  <span>128px</span>
                </div>
              </div>
              <input
                type="number"
                value={element.content.spacing || 32}
                onChange={(e) => updateContent({ spacing: parseInt(e.target.value) || 32 })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                placeholder="커스텀 높이"
              />
            </div>
          )}

          {element.type === 'html' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 font-medium text-sm">💡 Figma 코드 사용법</span>
                  <button
                    onClick={() => {
                      const figmaCSS = element.content.html || ''
                      if (!figmaCSS.trim()) {
                        alert('먼저 Figma CSS 코드를 입력해주세요')
                        return
                      }
                      
                      const { html, css } = convertFigmaToHTML(figmaCSS)
                      updateContent({ html, css })
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>자동 변환</span>
                  </button>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>1. Figma에서 디자인 선택 → Dev Mode → Copy as CSS</p>
                  <p>2. 복사한 CSS 코드를 아래 텍스트박스에 붙여넣기</p>
                  <p>3. &quot;자동 변환&quot; 버튼 클릭으로 HTML/CSS로 변환</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Figma CSS 코드 입력 (변환 전)
                </label>
                <textarea
                  value={element.content.html || ''}
                  onChange={(e) => {
                    updateContent({ html: e.target.value })
                  }}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="/* 목업 내용(셀프개통) */

position: relative;
width: 1206px;
height: 2622px;

background: #FFFFFF;

/* Rectangle 1 */

position: absolute;
width: 1206px;
height: 1697px;
...

👆 Figma에서 복사한 CSS 코드를 여기에 붙여넣고 '자동 변환' 버튼을 클릭하세요"
                />
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  ⚠️ 변환 전에는 CSS 코드가 그대로 텍스트로 표시됩니다. 반드시 &quot;자동 변환&quot; 버튼을 클릭해주세요.
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환된 HTML (수정 가능)
                  </label>
                  <textarea
                    value={element.content.html?.includes('figma-container') ? element.content.html : ''}
                    onChange={(e) => updateContent({ html: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                    placeholder="자동 변환 후 HTML이 여기에 표시됩니다..."
                    readOnly={!element.content.html?.includes('figma-container')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환된 CSS (수정 가능)
                  </label>
                  <textarea
                    value={element.content.css || ''}
                    onChange={(e) => updateContent({ css: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                    placeholder="자동 변환 후 CSS가 여기에 표시됩니다..."
                  />
                </div>
              </div>

              {element.content.html?.includes('figma-container') && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <span className="text-green-600 font-medium text-sm">✅ 변환 완료!</span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>• Figma CSS가 HTML로 성공적으로 변환되었습니다</p>
                    <p>• 이미지는 업로드가 필요합니다</p>
                    <p>• 모바일 반응형 스타일이 자동으로 추가되었습니다</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  실시간 미리보기
                </label>
                <div 
                  className="bg-white border rounded p-3 max-h-60 overflow-auto"
                  style={{ minHeight: '120px' }}
                >
                  {element.content.html?.includes('figma-container') ? (
                    <div>
                      <style dangerouslySetInnerHTML={{ __html: element.content.css || '' }} />
                      <div dangerouslySetInnerHTML={{ __html: element.content.html }} />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-sm">Figma CSS 코드를 입력하고 &quot;자동 변환&quot;을 클릭하면</p>
                      <p className="text-sm">여기에 미리보기가 표시됩니다</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {element.type === 'widget' && (
            <>
              <WidgetEditor 
                element={element}
                updateContent={updateContent}
              />
            </>
          )}
        </div>
      )}

      {/* 스타일 편집 */}
      {activeStyleTab === 'style' && (
        <div className="space-y-4">
          {(element.type === 'heading' || element.type === 'text') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 정렬
                </label>
                <div className="flex space-x-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateStyles({ textAlign: align })}
                      className={`px-3 py-2 text-sm border rounded ${
                        (element.styles?.textAlign || 'left') === align
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {align === 'left' ? '왼쪽' : align === 'center' ? '가운데' : '오른쪽'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 색상
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={element.styles?.color || (element.type === 'heading' ? settings.primaryColor : '#000000')}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.styles?.color || ''}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="기본값 사용"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              요소 정렬
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'flex-start', label: '왼쪽' },
                { value: 'center', label: '가운데' },
                { value: 'flex-end', label: '오른쪽' }
              ].map(align => (
                <button
                  key={align.value}
                  onClick={() => updateStyles({ alignSelf: align.value as any })}
                  className={`px-3 py-2 text-sm border rounded ${
                    (element.styles?.alignSelf || 'flex-start') === align.value
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {align.label}
                </button>
              ))}
            </div>
          </div>

          {element.type === 'button' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배경색
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={element.styles?.backgroundColor || settings.primaryColor}
                    onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.styles?.backgroundColor || ''}
                    onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="기본값 사용"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 색상
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={element.styles?.color || '#ffffff'}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={element.styles?.color || ''}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모서리 둥글기
                </label>
                <input
                  type="text"
                  value={element.styles?.borderRadius || ''}
                  onChange={(e) => updateStyles({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8px"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여백 (padding)
            </label>
            <input
              type="text"
              value={element.styles?.padding || ''}
              onChange={(e) => updateStyles({ padding: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 16px 또는 16px 32px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              외부 여백 (margin)
            </label>
            <input
              type="text"
              value={element.styles?.margin || ''}
              onChange={(e) => updateStyles({ margin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 16px 또는 16px 0"
            />
          </div>
        </div>
      )}
    </div>
  )
}