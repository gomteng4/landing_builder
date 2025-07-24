'use client'

import { PageElement } from '@/types/builder'
import ColorPicker from './ColorPicker'
import WidgetRenderer from './WidgetRenderer'

interface WidgetEditorProps {
  element: PageElement
  updateContent: (updates: any) => void
}

// 위젯별 기본 설정을 반환하는 함수
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
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 24시간 후
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

export default function WidgetEditor({ element, updateContent }: WidgetEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          위젯 타입
        </label>
        <select
          value={element.content.widgetType || 'applicant-list'}
          onChange={(e) => {
            const widgetType = e.target.value as any
            const defaultConfig = getDefaultWidgetConfig(widgetType)
            updateContent({ 
              widgetType,
              widgetConfig: defaultConfig
            })
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="applicant-list">📝 실시간 신청자 목록</option>
          <option value="countdown-banner">⏰ 마감시간 카운트다운</option>
          <option value="discount-counter">💰 실시간 할인 카운터</option>
          <option value="visitor-count">👀 실시간 조회수</option>
          <option value="stock-alert">🎯 재고 부족 알림</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          위젯 제목
        </label>
        <input
          type="text"
          value={element.content.widgetConfig?.title || ''}
          onChange={(e) => updateContent({
            widgetConfig: {
              ...element.content.widgetConfig,
              title: e.target.value
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="위젯 제목을 입력하세요"
        />
      </div>

      <ColorPicker
        value={element.content.widgetConfig?.backgroundColor || '#f8f9fa'}
        onChange={(color) => updateContent({
          widgetConfig: {
            ...element.content.widgetConfig,
            backgroundColor: color
          }
        })}
        label="배경색"
        showEyeDropper={true}
      />

      <ColorPicker
        value={element.content.widgetConfig?.textColor || '#333333'}
        onChange={(color) => updateContent({
          widgetConfig: {
            ...element.content.widgetConfig,
            textColor: color
          }
        })}
        label="텍스트 색상"
        showEyeDropper={true}
      />

      <ColorPicker
        value={element.content.widgetConfig?.borderColor || '#e9ecef'}
        onChange={(color) => updateContent({
          widgetConfig: {
            ...element.content.widgetConfig,
            borderColor: color
          }
        })}
        label="테두리 색상"
        showEyeDropper={true}
      />

      {/* 공통 설정 */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={element.content.widgetConfig?.sticky || false}
            onChange={(e) => updateContent({
              widgetConfig: {
                ...element.content.widgetConfig,
                sticky: e.target.checked
              }
            })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">스크롤 고정 (Sticky)</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={element.content.widgetConfig?.fullWidth || false}
            onChange={(e) => updateContent({
              widgetConfig: {
                ...element.content.widgetConfig,
                fullWidth: e.target.checked
              }
            })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">전체 너비</span>
        </label>
      </div>

      {element.content.widgetConfig?.animation && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            애니메이션 속도 (초)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={(element.content.widgetConfig?.animationSpeed || 2000) / 1000}
            onChange={(e) => updateContent({
              widgetConfig: {
                ...element.content.widgetConfig,
                animationSpeed: parseFloat(e.target.value) * 1000
              }
            })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>빠름 (1초)</span>
            <span>현재: {((element.content.widgetConfig?.animationSpeed || 2000) / 1000).toFixed(1)}초</span>
            <span>느림 (10초)</span>
          </div>
        </div>
      )}

      {/* 위젯별 특수 설정 */}
      {element.content.widgetType === 'applicant-list' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 표시 개수
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={element.content.widgetConfig?.maxItems || 5}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  maxItems: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              롤링 속도 (초)
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={(element.content.widgetConfig?.rollingSpeed || 4000) / 1000}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  rollingSpeed: parseInt(e.target.value) * 1000
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 표시 형식
            </label>
            <select
              value={element.content.widgetConfig?.nameFormat || 'mask'}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  nameFormat: e.target.value as any
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mask">김*수 (첫글자만)</option>
              <option value="initial">김*수 (첫/끝글자)</option>
              <option value="full">김민수 (전체)</option>
            </select>
          </div>
        </>
      )}

      {element.content.widgetType === 'countdown-banner' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              마감 날짜/시간
            </label>
            <input
              type="datetime-local"
              value={element.content.widgetConfig?.targetDate || ''}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  targetDate: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배너 텍스트
            </label>
            <input
              type="text"
              value={element.content.widgetConfig?.bannerText || ''}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  bannerText: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="특가 이벤트 마감까지"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={element.content.widgetConfig?.sticky || false}
                onChange={(e) => updateContent({
                  widgetConfig: {
                    ...element.content.widgetConfig,
                    sticky: e.target.checked
                  }
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">상단에 고정</span>
            </label>
          </div>
        </>
      )}

      {element.content.widgetType === 'discount-counter' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 숫자
            </label>
            <input
              type="number"
              value={element.content.widgetConfig?.currentCount || 0}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  currentCount: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              증가량
            </label>
            <input
              type="number"
              min="1"
              value={element.content.widgetConfig?.increment || 1}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  increment: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              앞 텍스트
            </label>
            <input
              type="text"
              value={element.content.widgetConfig?.prefix || ''}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  prefix: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="지금까지 "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              뒤 텍스트
            </label>
            <input
              type="text"
              value={element.content.widgetConfig?.suffix || ''}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  suffix: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="명이 50% 할인받았습니다!"
            />
          </div>
        </>
      )}

      {element.content.widgetType === 'visitor-count' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기본 방문자 수
            </label>
            <input
              type="number"
              value={element.content.widgetConfig?.baseCount || 234}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  baseCount: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              변동 범위
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={element.content.widgetConfig?.variation || 10}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  variation: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              방문자 수가 ±{element.content.widgetConfig?.variation || 10}만큼 변동됩니다
            </p>
          </div>
        </>
      )}

      {element.content.widgetType === 'stock-alert' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전체 수량
            </label>
            <input
              type="number"
              value={element.content.widgetConfig?.totalStock || 100}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  totalStock: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 남은 수량
            </label>
            <input
              type="number"
              value={element.content.widgetConfig?.currentStock || 23}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  currentStock: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              부족 알림 기준
            </label>
            <input
              type="number"
              value={element.content.widgetConfig?.lowStockThreshold || 30}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  lowStockThreshold: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              이 수량 이하일 때 긴급 알림을 표시합니다
            </p>
          </div>
        </>
      )}

      {element.content.widgetType === 'floating-menu' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카카오톡 채널 URL
            </label>
            <input
              type="url"
              value={element.content.widgetConfig?.kakaoChannelUrl || ''}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  kakaoChannelUrl: e.target.value
                }
              })}
              placeholder="https://pf.kakao.com/_your_channel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              value={element.content.widgetConfig?.phoneNumber || ''}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  phoneNumber: e.target.value
                }
              })}
              placeholder="010-1234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              위치
            </label>
            <select
              value={element.content.widgetConfig?.position || 'bottom-right'}
              onChange={(e) => updateContent({
                widgetConfig: {
                  ...element.content.widgetConfig,
                  position: e.target.value as 'bottom-right' | 'bottom-left'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bottom-right">우측 하단</option>
              <option value="bottom-left">좌측 하단</option>
            </select>
          </div>
        </>
      )}

      {/* 위젯 미리보기 */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          실시간 미리보기
        </label>
        <div className="border rounded-lg p-3 bg-gray-50">
          <WidgetRenderer
            widgetType={element.content.widgetType || 'applicant-list'}
            config={element.content.widgetConfig || {}}
            isPreview={true}
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-purple-800 mb-1">🎨 스포이드 활용 팁</h4>
        <p className="text-xs text-purple-700">
          Figma에서 작업한 이미지가 있다면, 색상 선택에서 스포이드 기능을 사용해보세요! 
          이미지의 색상을 추출하여 위젯 색상에 적용하면 통일감 있는 디자인을 만들 수 있습니다.
        </p>
      </div>
    </div>
  )
}