'use client'

import { useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { PageElement, PageSettings } from '@/types/builder'
import DraggableElement from './DraggableElement'
import ElementRenderer from './ElementRenderer'
import BusinessInfoSection from './BusinessInfoSection'

interface BuilderCanvasProps {
  elements: PageElement[]
  selectedElementId: string | null
  isPreviewMode: boolean
  settings: PageSettings
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void
  onMoveElement: (dragIndex: number, hoverIndex: number) => void
  onUpdateSettings: (updates: Partial<PageSettings>) => void
  onAddElement: (type: PageElement['type']) => void
  onDeleteElement: (id: string) => void
}

export default function BuilderCanvas({
  elements,
  selectedElementId,
  isPreviewMode,
  settings,
  onSelectElement,
  onUpdateElement,
  onMoveElement,
  onUpdateSettings,
  onAddElement,
  onDeleteElement
}: BuilderCanvasProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    drop: () => ({ index: elements.length }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null)
    }
  }, [onSelectElement])

  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      onMoveElement(index, index - 1)
    }
  }, [onMoveElement])

  const handleMoveDown = useCallback((index: number) => {
    if (index < elements.length - 1) {
      onMoveElement(index, index + 1)
    }
  }, [onMoveElement, elements.length])

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="min-h-full p-4 md:p-8">
        <div
          ref={drop as any}
          onClick={handleCanvasClick}
          className={`bg-white min-h-[600px] mx-auto shadow-lg transition-all duration-200 ${
            isPreviewMode ? 'max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg' : 'max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl'
          } ${isOver ? 'ring-2 ring-blue-400' : ''}`}
          style={{ backgroundColor: settings.backgroundColor }}
        >
          <div className={`p-4 md:p-6 flex flex-col space-y-4 ${isPreviewMode ? 'preview-mode' : ''}`}>
            {elements.length === 0 && !isPreviewMode && (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-base md:text-lg">사이드바에서 요소를 드래그해서 페이지를 만들어보세요</p>
                  <p className="text-sm mt-2">또는 빈 공간을 클릭하여 요소를 추가할 수 있습니다</p>
                </div>
              </div>
            )}

            {elements.map((element, index) => (
              <div
                key={element.id}
                className="flex"
                style={{
                  justifyContent: element.styles?.alignSelf === 'center' ? 'center' : 
                                element.styles?.alignSelf === 'flex-end' ? 'flex-end' : 'flex-start'
                }}
              >
                {isPreviewMode ? (
                  <ElementRenderer
                    element={element}
                    settings={settings}
                    isPreview={true}
                  />
                ) : (
                  <DraggableElement
                    element={element}
                    index={index}
                    isSelected={selectedElementId === element.id}
                    settings={settings}
                    onSelect={() => onSelectElement(element.id)}
                    onUpdate={onUpdateElement}
                    onMove={onMoveElement}
                    onDelete={onDeleteElement}
                    totalElements={elements.length}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                )}
              </div>
            ))}

            {/* 빈 공간에 요소 추가를 위한 최소 높이 확보 */}
            {!isPreviewMode && (
              <div className="min-h-[200px] flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm">여기를 클릭하거나 요소를 드래그하여 추가하세요</p>
              </div>
            )}
          </div>
          
          {/* 사업자정보 섹션 */}
          <BusinessInfoSection
            businessInfo={settings.businessInfo}
            settings={settings}
            isPreview={isPreviewMode}
            selectedElementId={selectedElementId}
            onUpdateElement={onUpdateElement}
            onDeleteElement={onDeleteElement}
            onSelectElement={(element) => onSelectElement(element ? element.id : null)}
            onAddElement={onAddElement}
            onUpdateBusinessInfo={(updates) => onUpdateSettings({
              businessInfo: { ...settings.businessInfo, ...updates }
            })}
          />
        </div>
      </div>
    </div>
  )
}