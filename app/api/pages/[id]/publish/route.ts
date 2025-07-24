import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// API 라우트에서는 서비스 역할 키 사용
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getBaseUrl(request: NextRequest) {
  // Vercel 배포 환경에서는 request에서 호스트를 가져옴
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  return `${protocol}://${host}`
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageId = params.id

    // 페이지 존재 확인
    const { data: page, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (fetchError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // 이미 게시된 경우 기존 URL 반환
    if (page.is_published && page.published_url) {
      const baseUrl = getBaseUrl(request)
      const fullUrl = `${baseUrl}/r/${page.published_url}`
      return NextResponse.json({
        success: true,
        published_url: fullUrl,
        message: '이미 게시된 페이지입니다.'
      })
    }

    // 페이지 게시 처리 - slug가 없으면 새로 생성
    let published_url = page.slug
    if (!published_url) {
      // slug가 없으면 페이지 ID 기반으로 생성
      published_url = `page-${pageId.slice(0, 8)}-${Date.now().toString(36)}`
    }
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('pages')
      .update({
        is_published: true,
        published_at: now,
        published_url: published_url,
        updated_at: now
      })
      .eq('id', pageId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 전체 URL 생성
    const baseUrl = getBaseUrl(request)
    const fullUrl = `${baseUrl}/r/${published_url}`
    
    return NextResponse.json({
      success: true,
      published_url: fullUrl,
      published_at: now,
      message: '페이지가 성공적으로 게시되었습니다!'
    })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageId = params.id

    // 페이지 게시 취소
    const { data, error } = await supabase
      .from('pages')
      .update({
        is_published: false,
        published_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '페이지 게시가 취소되었습니다.'
    })
  } catch (error) {
    console.error('Unpublish error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}