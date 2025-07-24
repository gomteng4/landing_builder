import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// API 라우트에서는 서비스 역할 키 사용
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    // 페이지 조회수 증가
    // 먼저 현재 조회수를 가져옴 (published_url 또는 slug로 검색)
    const { data } = await supabase
      .from('pages')
      .select('page_views, id')
      .or(`slug.eq.${slug},published_url.eq.${slug}`)
      .eq('is_published', true)
      .single()
    
    if (!data) {
      return NextResponse.json({ success: false, error: 'Page not found' })
    }
    
    const currentViews = data.page_views || 0
    
    // 조회수 +1 업데이트 (ID로 업데이트)
    const { error } = await supabase
      .from('pages')
      .update({ page_views: currentViews + 1 })
      .eq('id', data.id)

    if (error) {
      console.error('View count update error:', error)
      // 조회수 업데이트 실패는 치명적이지 않으므로 에러를 반환하지 않음
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ success: false })
  }
}