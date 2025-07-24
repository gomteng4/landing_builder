# Vercel 배포 가이드

이 문서는 랜딩페이지 빌더를 Vercel에 배포하는 방법을 설명합니다.

## 사전 준비사항

1. **Vercel 계정** - [vercel.com](https://vercel.com)에서 계정 생성
2. **GitHub 계정** - 코드 리포지토리 관리용
3. **Supabase 프로젝트** - 데이터베이스 및 스토리지용

## 1. Supabase 설정

### 1.1 Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (가장 가까운 지역 선택)

### 1.2 데이터베이스 스키마 설정
1. Supabase Dashboard > SQL Editor
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행
3. 스키마가 정상적으로 생성되었는지 확인

### 1.3 API 키 확인
1. Supabase Dashboard > Settings > API
2. 다음 값들을 복사해 둡니다:
   - `Project URL`
   - `anon public` 키
   - `service_role` 키 (중요: 안전하게 보관)

## 2. GitHub 리포지토리 설정

### 2.1 리포지토리 생성
```bash
# GitHub에서 새 리포지토리 생성 후
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[username]/[repository-name].git
git push -u origin main
```

### 2.2 환경 파일 제외
`.gitignore` 파일에 다음이 포함되어 있는지 확인:
```
.env.local
.env
.vercel
```

## 3. Vercel 배포

### 3.1 Vercel에 프로젝트 연결
1. [vercel.com](https://vercel.com) 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 선택
4. 프로젝트 설정:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3.2 환경변수 설정
Vercel Dashboard > Settings > Environment Variables에서 다음 변수들을 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-id].supabase.co` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon public 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service role 키 (서버 전용) |

### 3.3 배포 실행
1. 환경변수 설정 완료 후 "Deploy" 클릭
2. 빌드 과정 모니터링
3. 배포 완료 후 도메인 확인

## 4. 도메인 설정 (선택사항)

### 4.1 커스텀 도메인 연결
1. Vercel Dashboard > Settings > Domains
2. 도메인 추가 및 DNS 설정
3. SSL 인증서 자동 발급 확인

## 5. 랜덤 URL 시스템

배포 완료 후 다음 기능들이 작동합니다:

### 5.1 페이지 생성 시 랜덤 URL 할당
- 새 페이지 저장 시 자동으로 고유한 랜덤 URL 생성
- 형태: `happy-mountain-42`, `abc123`, `cool789` 등
- 중복 방지 시스템으로 고유성 보장

### 5.2 랜덤 URL로 페이지 접근
- 형태: `https://[도메인]/r/[랜덤코드]`
- 예시: `https://mysite.vercel.app/r/happy-mountain-42`
- 모바일 반응형 지원

### 5.3 URL 공유 기능
- 페이지 저장 시 랜덤 URL 자동 클립보드 복사
- 소셜 미디어, 메신저 등으로 쉽게 공유 가능

## 6. 확인 사항

### 6.1 기본 기능 테스트
- [ ] 페이지 빌더 접근 가능
- [ ] 요소 추가/편집 정상 동작
- [ ] 페이지 저장 및 랜덤 URL 생성
- [ ] 랜덤 URL로 페이지 조회 가능
- [ ] 폼 제출 및 알림 기능
- [ ] 이미지 업로드 기능

### 6.2 성능 확인
- [ ] 페이지 로딩 속도
- [ ] 모바일 반응형
- [ ] SEO 메타태그
- [ ] 이미지 최적화

## 7. 모니터링

### 7.1 Vercel Analytics
- Vercel Dashboard에서 트래픽 및 성능 모니터링
- Core Web Vitals 확인

### 7.2 Supabase 모니터링
- Supabase Dashboard에서 데이터베이스 사용량 확인
- API 요청 수 및 성능 모니터링

## 8. 업데이트 방법

### 8.1 코드 업데이트
```bash
git add .
git commit -m "Update description"
git push
```

### 8.2 자동 배포
- GitHub에 푸시하면 Vercel에서 자동으로 재배포
- 빌드 상태는 Vercel Dashboard에서 확인

## 문제 해결

### 8.1 빌드 오류
- Vercel Dashboard > Functions 탭에서 에러 로그 확인
- 환경변수 설정 재확인

### 8.2 데이터베이스 연결 오류
- Supabase URL 및 키 재확인
- RLS 정책 설정 확인

### 8.3 이미지 업로드 오류
- Supabase Storage 설정 확인
- CORS 정책 설정 확인

## 보안 고려사항

1. **환경변수 관리**: service_role 키는 절대 클라이언트에 노출하지 않기
2. **RLS 설정**: 운영 환경에서는 적절한 Row Level Security 정책 설정
3. **CORS 설정**: 필요한 도메인만 허용하도록 설정
4. **파일 업로드**: 허용되는 파일 형식 및 크기 제한 설정

## 추가 기능 개발

향후 추가할 수 있는 기능들:
- 사용자 인증 시스템
- 페이지 분석 대시보드
- 커스텀 도메인 연결
- 템플릿 갤러리
- A/B 테스트 기능