'use client'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { PageElement, PageSettings } from '@/types/builder'
import ElementRenderer from './ElementRenderer'

interface DraggableElementProps {
  element: PageElement
  index: number
  isSelected: boolean
  settings: PageSettings
  onSelect: () => void
  onUpdate: (id: string, updates: Partial<PageElement>) => void
  onMove: (dragIndex: number, hoverIndex: number) => void
}

export default function DraggableElement({
  element,
  index,
  isSelected,
  settings,
  onSelect,
  onUpdate,
  onMove
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
      className={`builder-element relative ${
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
      
      <ElementRenderer
        element={element}
        settings={settings}
        isPreview={false}
        onUpdate={onUpdate}
      />
    </div>
  )
}