'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface TemplateDialogProps {
  onSave: (templateName: string, description: string) => void
  onClose: () => void
}

export default function TemplateDialog({ onSave, onClose }: TemplateDialogProps) {
  const [templateName, setTemplateName] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('템플릿 이름을 입력해주세요.')
      return
    }
    
    onSave(templateName.trim(), description.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">템플릿으로 저장</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                템플릿 이름 *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="템플릿 이름을 입력하세요"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="템플릿에 대한 설명을 입력하세요 (선택사항)"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                템플릿 선택 시 사용자에게 표시될 설명입니다.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              템플릿 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}