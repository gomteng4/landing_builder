export default function PublishedPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✅ 라우팅 성공!</h1>
        <p className="text-xl mb-2">Slug: <strong>{params.slug}</strong></p>
        <p className="text-gray-600">Next.js 동적 라우팅이 정상 작동합니다!</p>
      </div>
    </div>
  )
}