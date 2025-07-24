import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          랜딩페이지 빌더
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          드래그앤드롭으로 쉽게 랜딩페이지를 만들어보세요
        </p>
        <div className="space-x-4">
          <Link
            href="/builder"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            빌더 시작하기
          </Link>
          <Link
            href="/pages"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            페이지 관리
          </Link>
          <Link
            href="/admin"
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            폼 관리하기
          </Link>
        </div>
      </div>
    </div>
  )
}