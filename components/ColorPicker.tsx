'use client'

import { useState, useRef, useCallback } from 'react'
import { Pipette, Palette, Eye } from 'lucide-react'
import { extractColorsFromImage, extractColorFromPoint, ColorPalette } from '@/lib/colorExtractor'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  imageUrl?: string
  label?: string
  showEyeDropper?: boolean
}

export default function ColorPicker({ 
  value, 
  onChange, 
  imageUrl, 
  label = "색상 선택",
  showEyeDropper = true 
}: ColorPickerProps) {
  const [isDropperMode, setIsDropperMode] = useState(false)
  const [extractedPalette, setExtractedPalette] = useState<ColorPalette | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // 이미지에서 색상 팔레트 추출
  const extractPalette = useCallback(async () => {
    if (!imageUrl) return
    
    setIsExtracting(true)
    try {
      const palette = await extractColorsFromImage(imageUrl)
      setExtractedPalette(palette)
    } catch (error) {
      console.error('색상 추출 실패:', error)
    } finally {
      setIsExtracting(false)
    }
  }, [imageUrl])

  // 스포이드 모드에서 이미지 클릭 처리
  const handleImageClick = useCallback(async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDropperMode || !imageUrl) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (e.currentTarget.naturalWidth / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (e.currentTarget.naturalHeight / rect.height))
    
    try {
      const color = await extractColorFromPoint(imageUrl, x, y)
      onChange(color)
      setIsDropperMode(false)
    } catch (error) {
      console.error('스포이드 실패:', error)
    }
  }, [isDropperMode, imageUrl, onChange])

  // 브라우저 네이티브 스포이드 (지원되는 경우)
  const handleNativeEyeDropper = useCallback(async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore - EyeDropper API는 아직 TypeScript에 정의되지 않음
        const eyeDropper = new EyeDropper()
        const result = await eyeDropper.open()
        onChange(result.sRGBHex)
      } catch (error) {
        console.error('네이티브 스포이드 실패:', error)
      }
    }
  }, [onChange])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* 기본 색상 선택기 */}
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
        
        {/* 네이티브 스포이드 (지원되는 브라우저) */}
        {showEyeDropper && 'EyeDropper' in window && (
          <button
            onClick={handleNativeEyeDropper}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="화면에서 색상 추출"
          >
            <Pipette className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 이미지 기반 기능들 */}
      {imageUrl && (
        <div className="space-y-3">
          {/* 컨트롤 버튼들 */}
          <div className="flex space-x-2">
            <button
              onClick={extractPalette}
              disabled={isExtracting}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Palette className="w-4 h-4" />
              <span>{isExtracting ? '추출 중...' : '색상 팔레트 추출'}</span>
            </button>
            
            <button
              onClick={() => setIsDropperMode(!isDropperMode)}
              className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-md transition-colors ${
                isDropperMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isDropperMode ? '스포이드 모드 ON' : '스포이드 모드'}</span>
            </button>
          </div>

          {/* 이미지 미리보기 */}
          <div className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="색상 추출용 이미지"
              className={`max-w-full h-auto rounded-lg border ${
                isDropperMode 
                  ? 'cursor-crosshair border-green-500 border-2' 
                  : 'border-gray-300'
              }`}
              style={{ maxHeight: '200px' }}
              onClick={handleImageClick}
              crossOrigin="anonymous"
            />
            {isDropperMode && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                클릭하여 색상 추출
              </div>
            )}
          </div>

          {/* 추출된 색상 팔레트 */}
          {extractedPalette && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">추출된 색상 팔레트</h4>
              <div className="grid grid-cols-4 gap-2">
                {extractedPalette.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => onChange(color)}
                    className="w-full h-8 rounded border border-gray-300 hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`${color} (클릭하여 선택)`}
                  />
                ))}
              </div>
              
              {/* 텍스트 색상 추천 */}
              {extractedPalette.textColors.length > 0 && (
                <div className="space-y-1">
                  <h5 className="text-xs font-medium text-gray-600">텍스트 색상 추천</h5>
                  <div className="grid grid-cols-4 gap-2">
                    {extractedPalette.textColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => onChange(color)}
                        className="w-full h-6 rounded border border-gray-300 hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                        title={`${color} (텍스트용)`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 색상 프리셋 */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">인기 색상</h4>
        <div className="grid grid-cols-8 gap-1">
          {[
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
            '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
            '#f97316', '#6366f1', '#14b8a6', '#eab308',
            '#1f2937', '#374151', '#6b7280', '#ffffff'
          ].map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}