'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface NicknameDialogProps {
  currentNickname?: string
  onSave: (nickname: string) => void
  onClose: () => void
}

export default function NicknameDialog({ currentNickname = '', onSave, onClose }: NicknameDialogProps) {
  const [nickname, setNickname] = useState(currentNickname)

  const handleSave = () => {
    onSave(nickname.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">페이지 닉네임 설정</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="페이지를 구분할 수 있는 이름을 입력하세요"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              닉네임은 페이지 목록에서 표시되며, 관리를 위한 용도입니다.
            </p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}