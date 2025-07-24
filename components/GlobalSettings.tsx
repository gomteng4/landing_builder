'use client'

import { PageSettings } from '@/types/builder'
import ColorPicker from './ColorPicker'

interface GlobalSettingsProps {
  settings: PageSettings
  onUpdateSettings: (updates: Partial<PageSettings>) => void
}

export default function GlobalSettings({
  settings,
  onUpdateSettings
}: GlobalSettingsProps) {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">글로벌 설정</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          페이지 제목
        </label>
        <input
          type="text"
          value={settings.title}
          onChange={(e) => onUpdateSettings({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="페이지 제목을 입력하세요"
        />
      </div>

      <ColorPicker
        value={settings.primaryColor}
        onChange={(color) => onUpdateSettings({ primaryColor: color })}
        label="메인 컬러"
        showEyeDropper={true}
      />
      <p className="text-xs text-gray-500 -mt-2">
        헤딩과 버튼에 자동으로 적용됩니다
      </p>

      <ColorPicker
        value={settings.backgroundColor}
        onChange={(color) => onUpdateSettings({ backgroundColor: color })}
        label="페이지 배경색"
        showEyeDropper={true}
      />

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">사업자정보 섹션</h4>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.businessInfo?.isVisible || false}
                onChange={(e) => onUpdateSettings({
                  businessInfo: {
                    ...settings.businessInfo,
                    id: settings.businessInfo?.id || 'business-info',
                    isVisible: e.target.checked,
                    backgroundColor: settings.businessInfo?.backgroundColor || '#f8f9fa',
                    elements: settings.businessInfo?.elements || []
                  }
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">사업자정보 섹션 표시</span>
            </label>
          </div>
          
          {settings.businessInfo?.isVisible && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자정보 배경색
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.businessInfo.backgroundColor}
                  onChange={(e) => onUpdateSettings({
                    businessInfo: {
                      ...settings.businessInfo,
                      backgroundColor: e.target.value
                    }
                  })}
                  className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.businessInfo.backgroundColor}
                  onChange={(e) => onUpdateSettings({
                    businessInfo: {
                      ...settings.businessInfo,
                      backgroundColor: e.target.value
                    }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#f8f9fa"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">미리보기</h4>
        <div className="space-y-2">
          <div 
            className="h-8 rounded flex items-center px-3 text-sm font-semibold"
            style={{ 
              backgroundColor: settings.primaryColor,
              color: '#ffffff'
            }}
          >
            버튼 미리보기
          </div>
          <div 
            className="h-8 rounded flex items-center px-3 text-lg font-bold"
            style={{ 
              color: settings.primaryColor,
              backgroundColor: settings.backgroundColor
            }}
          >
            헤딩 미리보기
          </div>
        </div>
      </div>
    </div>
  )
}