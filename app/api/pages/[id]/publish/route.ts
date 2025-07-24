import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
      return NextResponse.json({
        success: true,
        published_url: page.published_url,
        message: '이미 게시된 페이지입니다.'
      })
    }

    // 페이지 게시 처리
    const published_url = page.slug // 기존 slug를 published_url로 사용
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

    return NextResponse.json({
      success: true,
      published_url: published_url,
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