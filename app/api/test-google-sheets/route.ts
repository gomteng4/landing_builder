import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  try {
    const { spreadsheet_id, sheet_name, service_account_key } = await request.json()

    if (!spreadsheet_id || !service_account_key) {
      return NextResponse.json(
        { error: '스프레드시트 ID와 서비스 계정 키가 필요합니다.' },
        { status: 400 }
      )
    }

    // Google Sheets API 인증 설정
    const auth = new google.auth.GoogleAuth({
      credentials: service_account_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const authClient = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: authClient })

    // 스프레드시트 정보 가져오기로 연결 테스트
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheet_id
    })

    // 지정된 시트가 존재하는지 확인
    const sheetExists = response.data.sheets?.some(
      sheet => sheet.properties?.title === sheet_name
    )

    if (!sheetExists) {
      return NextResponse.json(
        { error: `시트 "${sheet_name}"를 찾을 수 없습니다. 시트 이름을 확인해주세요.` },
        { status: 400 }
      )
    }

    // 테스트 데이터 추가 (헤더만)
    const testRow = [
      ['이름', '이메일', '전화번호', '신청일시']
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheet_id,
      range: `${sheet_name}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: testRow
      }
    })

    return NextResponse.json({
      success: true,
      message: '연결 성공! 헤더가 추가되었습니다.',
      spreadsheet_title: response.data.properties?.title
    })

  } catch (error: any) {
    console.error('Google Sheets test error:', error)
    
    let errorMessage = '알 수 없는 오류가 발생했습니다.'
    
    if (error.code === 404) {
      errorMessage = '스프레드시트를 찾을 수 없습니다. ID를 확인하고 서비스 계정에 접근 권한을 부여했는지 확인하세요.'
    } else if (error.code === 403) {
      errorMessage = '권한이 없습니다. 서비스 계정을 스프레드시트에 편집자로 공유했는지 확인하세요.'
    } else if (error.message?.includes('invalid_grant')) {
      errorMessage = '서비스 계정 키가 유효하지 않습니다.'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}