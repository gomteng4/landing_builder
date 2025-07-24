import { NextRequest, NextResponse } from 'next/server'

// 간단한 이메일 알림 (실제 서비스에서는 SendGrid, Mailgun 등 사용)
export async function POST(request: NextRequest) {
  try {
    const { submission, pageTitle } = await request.json()

    // 웹훅이나 이메일 서비스로 알림 전송
    // 예: Slack, Discord, 이메일 등
    
    console.log('📧 새로운 폼 제출 알림:', {
      이름: submission.name,
      이메일: submission.email,
      전화번호: submission.phone,
      페이지: pageTitle,
      시간: new Date().toLocaleString('ko-KR'),
      데이터: submission.data
    })

    // 실제 이메일 발송 로직 (예시)
    // await sendEmail({
    //   to: 'admin@yoursite.com',
    //   subject: `새로운 폼 제출: ${pageTitle}`,
    //   body: `
    //     이름: ${submission.name}
    //     이메일: ${submission.email}
    //     전화번호: ${submission.phone}
    //     페이지: ${pageTitle}
    //     제출 시간: ${new Date().toLocaleString('ko-KR')}
    //   `
    // })

    // Slack 웹훅 예시 (실제 웹훅 URL 필요)
    // const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    // if (slackWebhookUrl) {
    //   await fetch(slackWebhookUrl, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       text: `🎉 새로운 폼 제출!\n이름: ${submission.name}\n이메일: ${submission.email}\n페이지: ${pageTitle}`
    //     })
    //   });
    // }

    return NextResponse.json({ 
      success: true, 
      message: '알림이 전송되었습니다' 
    })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}