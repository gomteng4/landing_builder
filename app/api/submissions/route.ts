import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { google } from 'googleapis'

async function sendToGoogleSheets(submissionData: any) {
  try {
    // 활성화된 구글 시트 설정 가져오기
    const { data: config, error } = await supabase
      .from('google_sheets_config')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error || !config) {
      console.log('구글 시트 설정이 없습니다.')
      return
    }

    // Google Sheets API 인증
    const auth = new google.auth.GoogleAuth({
      credentials: config.service_account_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const authClient = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: authClient })

    // 제출 데이터를 행으로 변환
    const now = new Date()
    const row = [
      submissionData.name || '',
      submissionData.email || '',
      submissionData.phone || '',
      now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      JSON.stringify(submissionData.data || {})
    ]

    // 구글 시트에 데이터 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheet_id,
      range: `${config.sheet_name}!A:E`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row]
      }
    })

    console.log('구글 시트에 데이터가 추가되었습니다.')
  } catch (error) {
    console.error('구글 시트 전송 실패:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page_id, name, email, phone, data } = body

    // 1. 폼 데이터 저장
    const { data: submission, error } = await supabase
      .from('form_submissions')
      .insert([
        {
          page_id,
          name,
          email,
          phone,
          data: data || {}
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. 페이지 정보 가져오기
    const { data: page } = await supabase
      .from('pages')
      .select('title, settings')
      .eq('id', page_id)
      .single()

    // 3. 구글 시트 연동 (비동기 처리)
    sendToGoogleSheets({ name, email, phone, data }).catch(console.error)

    // 4. 알림 전송 (비동기로 처리하여 응답 지연 방지)
    const pageTitle = page?.settings?.title || page?.title || '랜딩페이지'
    
    // 백그라운드에서 알림 처리
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submission: { name, email, phone, data },
        pageTitle
      })
    }).catch(console.error)

    return NextResponse.json({
      ...submission,
      message: '제출이 완료되었습니다!'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageId = searchParams.get('page_id')

    let query = supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (pageId) {
      query = query.eq('page_id', pageId)
    }

    const { data, error } = await query

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