# Supabase 'landingpage' 프로젝트 연동 가이드

## 📋 단계별 설정 방법

### 1️⃣ Supabase 프로젝트 정보 확인

1. **Supabase Dashboard** 접속: https://supabase.com/dashboard
2. **'landingpage' 프로젝트** 선택
3. **Settings** → **API** 메뉴로 이동

### 2️⃣ API 키 복사

다음 정보들을 복사해두세요:

- **Project URL**: `https://your-project-id.supabase.co`
- **anon public**: `eyJhbGc...` (공개 키)
- **service_role**: `eyJhbGc...` (비밀 키, 보안 주의!)

### 3️⃣ 환경변수 설정

`.env.local` 파일을 열고 아래 값들을 교체하세요:

```env
# Project URL을 여기에 입력
NEXT_PUBLIC_SUPABASE_URL=https://sqyhwfmaeqmcfiimeult.supabase.co

# anon public 키를 여기에 입력
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeWh3Zm1hZXFtY2ZpaW1ldWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTkzODMsImV4cCI6MjA2ODczNTM4M30.frtawjLXaN3pVSxygWsw4WYjoz7-ERww0hAHCWObkns

# service_role 키를 여기에 입력 (보안 주의!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxeWh3Zm1hZXFtY2ZpaW1ldWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE1OTM4MywiZXhwIjoyMDY4NzM1MzgzfQ.mFA-3ZqhFYv_fae3D_GqSo9zQVLaJmXJw32TOVAuVs0
```

### 4️⃣ 데이터베이스 스키마 설정

1. **Supabase Dashboard** → **SQL Editor**로 이동
2. `supabase/schema.sql` 파일의 내용을 복사
3. **SQL Editor**에 붙여넣고 **Run** 실행

생성되는 테이블들:
- ✅ `pages` - 랜딩페이지 저장
- ✅ `form_submissions` - 폼 데이터 수집
- ✅ `images` Storage 버킷 - 이미지 파일 저장

### 5️⃣ Storage 설정 (이미지 업로드용)

1. **Supabase Dashboard** → **Storage** 메뉴
2. `images` 버킷이 생성되었는지 확인
3. 버킷 설정:
   - **Public bucket**: ✅ 체크
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

### 6️⃣ 보안 정책 (RLS) 확인

SQL Editor에서 다음 정책들이 활성화되었는지 확인:

```sql
-- Pages 테이블 정책
SELECT * FROM pg_policies WHERE tablename = 'pages';

-- Storage 정책  
SELECT * FROM storage.policies WHERE bucket_id = 'images';
```

## 🔧 연동 테스트

### 개발 서버 재시작
```bash
npm run dev
```

### 기능 테스트
1. **페이지 생성**: 빌더에서 새 페이지 만들기
2. **이미지 업로드**: 이미지 요소에서 파일 업로드
3. **폼 제출**: DB폼 요소로 데이터 수집 테스트
4. **데이터 확인**: Supabase Dashboard에서 데이터 확인

## ⚠️ 주의사항

### 보안
- **service_role** 키는 절대 클라이언트에 노출하지 마세요
- 프로덕션에서는 적절한 RLS 정책 설정 필요
- API 키를 GitHub에 커밋하지 마세요

### 할당량
- **무료 플랜 제한**:
  - Storage: 1GB
  - Database: 500MB
  - 월 대역폭: 5GB

## 🚨 트러블슈팅

### 연결 오류 시
1. **환경변수 확인**: 올바른 URL과 키 입력했는지 확인
2. **개발 서버 재시작**: `npm run dev`
3. **브라우저 캐시 클리어**: F12 → Application → Clear storage

### 이미지 업로드 실패 시
1. **Storage 버킷 확인**: `images` 버킷 존재 여부
2. **정책 확인**: Storage 업로드 정책 활성화
3. **파일 크기**: 5MB 이하인지 확인

### 폼 데이터 저장 안됨
1. **테이블 확인**: `form_submissions` 테이블 존재
2. **RLS 정책**: 테이블 쓰기 권한 확인

## ✅ 완료 확인

모든 설정이 완료되면:
- ✅ 페이지 저장/불러오기 정상 작동
- ✅ 이미지 업로드 Supabase Storage 사용
- ✅ 폼 데이터 Supabase Database 저장
- ✅ 새창 미리보기 정상 작동

## 📞 도움이 필요하신가요?

설정 중 문제가 발생하면:
1. 브라우저 개발자 도구(F12) → Console 탭에서 오류 메시지 확인
2. Supabase Dashboard → Logs에서 서버 로그 확인
3. 환경변수 값 재확인

성공적으로 연동되면 **Supabase의 실시간 데이터베이스와 스토리지**를 활용한 완전한 랜딩페이지 빌더를 사용할 수 있습니다! 🎉