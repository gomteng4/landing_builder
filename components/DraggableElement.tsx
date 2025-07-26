'use client'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { PageElement, PageSettings } from '@/types/builder'
import { ChevronUp, ChevronDown, Edit3, Trash2 } from 'lucide-react'
import ElementRenderer from './ElementRenderer'

interface DraggableElementProps {
  element: PageElement
  index: number
  isSelected: boolean
  settings: PageSettings
  onSelect: () => void
  onUpdate: (id: string, updates: Partial<PageElement>) => void
  onMove: (dragIndex: number, hoverIndex: number) => void
  onDelete?: (id: string) => void
  totalElements: number
  onMoveUp?: (index: number) => void
  onMoveDown?: (index: number) => void
}

export default function DraggableElement({
  element,
  index,
  isSelected,
  settings,
  onSelect,
  onUpdate,
  onMove,
  onDelete,
  totalElements,
  onMoveUp,
  onMoveDown
}: DraggableElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { id: element.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    hover: (item: { id: string; index: number }) => {
      if (!ref.current) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = { y: 0 } // 실제 구현에서는 monitor.getClientOffset() 사용
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      onMove(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`builder-element relative group ${
        isSelected ? 'selected' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {isOver && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 z-10" />
      )}
      
      {/* 요소 편집/삭제/순서변경 버튼들 */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1 z-10">
        <div className="flex space-x-1">
          {onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp(index)
              }}
              disabled={index === 0}
              className={`text-white rounded-sm w-5 h-5 flex items-center justify-center text-xs transition-colors ${
                index === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              title="위로 이동"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown(index)
              }}
              disabled={index === totalElements - 1}
              className={`text-white rounded-sm w-5 h-5 flex items-center justify-center text-xs transition-colors ${
                index === totalElements - 1 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              title="아래로 이동"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600"
            title="이 요소 편집"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(element.id)
              }}
              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              title="이 요소 삭제"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      
      <ElementRenderer
        element={element}
        settings={settings}
        isPreview={false}
        onUpdate={onUpdate}
      />
    </div>
  )
}