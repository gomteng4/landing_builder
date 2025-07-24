import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generatePageSlug, isValidSlug } from '@/lib/urlGenerator'

// API 라우트에서는 서비스 역할 키 사용
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, elements, settings, nickname } = body

    // 고유한 슬러그 생성
    let slug = generatePageSlug()
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    // 슬러그가 고유할 때까지 시도
    while (!isUnique && attempts < maxAttempts) {
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existingPage) {
        isUnique = true
      } else {
        slug = generatePageSlug()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: '고유한 URL을 생성할 수 없습니다. 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('pages')
      .insert([
        {
          title,
          slug,
          nickname,
          elements: elements || [],
          settings: settings || {
            title: '',
            primaryColor: '#3b82f6',
            backgroundColor: '#ffffff'
          }
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}