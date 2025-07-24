'use client'

import { useParams } from 'next/navigation'

export default function PublishedPageRoute() {
  const params = useParams()
  const slug = params.slug as string
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">페이지 라우팅 테스트</h1>
        <p className="text-lg">Slug: {slug}</p>
        <p className="text-sm text-gray-600 mt-4">
          이 페이지가 보이면 라우팅은 정상 작동합니다.
        </p>
      </div>
    </div>
  )
}