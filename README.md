# 랜딩페이지 빌더

Next.js와 Supabase를 활용한 드래그앤드롭 방식의 랜딩페이지 빌더입니다.

## ✨ 주요 기능

### 🎨 드래그앤드롭 빌더
- 직관적인 드래그앤드롭 인터페이스
- 실시간 편집 기능 (더블클릭으로 바로 수정)
- 8가지 요소 타입: 헤딩, 텍스트, 이미지, 동영상, 버튼, DB폼, 간격, HTML코드

### 🎯 Figma 연동
- HTML/CSS 코드 직접 붙여넣기 지원
- Figma Dev Mode 출력물 완벽 호환
- 복잡한 레이아웃도 그대로 렌더링

### 📱 반응형 디자인
- 모바일 최적화된 미리보기
- 데스크톱/모바일 자동 대응

### 🗄️ 데이터 수집
- 실시간 폼 데이터 수집
- Supabase 자동 저장
- 이름/이메일/전화번호 필드 지원

### ⚙️ 커스터마이징
- 글로벌 컬러 설정
- 요소별 세부 스타일 편집
- 이미지 파일 업로드 및 링크 설정
- 버튼/이미지 정렬 옵션 (왼쪽/가운데/오른쪽)
- 새창 미리보기 기능
- 실시간 미리보기

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. Supabase 'landingpage' 프로젝트 연동
**📋 자세한 설정 가이드**: `SUPABASE_SETUP.md` 파일을 참고하세요!

`.env.local` 파일을 수정하여 Supabase landingpage 프로젝트 정보를 입력하세요:

```env
# Supabase landingpage 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# API 키들 (Supabase Dashboard > Settings > API에서 확인)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Supabase 데이터베이스 설정
`supabase/schema.sql` 파일의 SQL을 Supabase SQL Editor에서 실행하세요:

- `pages` 테이블: 랜딩페이지 저장
- `form_submissions` 테이블: 폼 데이터 수집
- `images` Storage 버킷: 이미지 파일 저장

### 4. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
├── app/
│   ├── builder/          # 페이지 빌더 (/builder)
│   ├── page/[id]/        # 완성된 페이지 (/page/[id])
│   └── api/              # API 라우트
├── components/           # React 컴포넌트
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입 정의
└── supabase/            # 데이터베이스 스키마
```

## 🔧 사용법

### 1. 새 페이지 만들기
- `/builder` 접속
- 사이드바에서 요소 드래그앤드롭
- 실시간으로 편집 및 미리보기

### 2. 요소 편집
- 요소 클릭으로 선택
- 사이드바에서 내용/스타일 편집
- 더블클릭으로 빠른 텍스트 편집

### 3. Figma 코드 사용
- "HTML코드" 요소 추가
- Figma에서 복사한 HTML/CSS 붙여넣기
- 실시간 미리보기 확인

### 4. 페이지 저장 및 공유
- 저장 버튼으로 페이지 저장
- 고유 URL로 페이지 공유
- 폼 데이터 자동 수집

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Drag & Drop**: react-dnd
- **Icons**: Lucide React

## 📋 요소 타입

| 요소 | 설명 | 편집 가능 속성 |
|------|------|----------------|
| 헤딩 | H1-H6 제목 | 텍스트, 레벨, 색상, 정렬 |
| 텍스트 | 일반 텍스트 | 텍스트, 색상, 정렬 |
| 이미지 | 이미지 삽입 | URL, 크기, 대체텍스트 |
| 동영상 | 동영상 임베드 | YouTube/Vimeo URL |
| 버튼 | 클릭 가능한 버튼 | 텍스트, 링크, 색상 |
| DB폼 | 데이터 수집 폼 | 필드 구성, 필수 여부 |
| 간격 | 투명한 여백 | 높이 (8px-128px) |
| HTML코드 | 커스텀 HTML/CSS | HTML, CSS 코드 |

## 🚀 배포

### Vercel 배포
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 import
3. 환경변수 설정
4. 자동 배포 완료

### 환경변수 확인사항
- Supabase URL과 키가 올바른지 확인
- RLS 정책이 적절히 설정되었는지 확인
- 이미지 도메인이 Next.js config에 추가되었는지 확인

## 🔒 보안

- Row Level Security (RLS) 활성화
- API 키는 환경변수로 관리
- XSS 방지를 위한 HTML 정리
- HTTPS 강제 사용 권장

## 📈 향후 개선사항

- [ ] 사용자 인증 시스템
- [ ] 페이지 템플릿 라이브러리
- [ ] 고급 애니메이션 효과
- [ ] SEO 최적화 도구
- [ ] 이미지 업로드 기능
- [ ] 실시간 협업 기능

## 📞 지원

문제나 질문이 있으시면 Issues를 통해 문의해주세요.