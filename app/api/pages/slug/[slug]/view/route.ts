import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    // 페이지 조회수 증가
    // 먼저 현재 조회수를 가져옴
    const { data } = await supabase
      .from('pages')
      .select('page_views')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    
    const currentViews = data?.page_views || 0
    
    // 조회수 +1 업데이트
    const { error } = await supabase
      .from('pages')
      .update({ page_views: currentViews + 1 })
      .eq('slug', slug)
      .eq('is_published', true)

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