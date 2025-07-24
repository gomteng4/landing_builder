// 랜덤 URL 생성을 위한 유틸리티 함수들

/**
 * 랜덤한 문자열을 생성합니다
 * @param length 생성할 문자열 길이
 * @param includeNumbers 숫자 포함 여부
 * @returns 랜덤 문자열
 */
export function generateRandomString(length: number = 8, includeNumbers: boolean = true): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const chars = includeNumbers ? letters + numbers : letters
  
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 사용하기 쉬운 랜덤 URL 슬러그를 생성합니다
 * 형태: [형용사]-[명사]-[숫자]
 * 예: happy-mountain-42, cool-ocean-88
 */
export function generateFriendlySlug(): string {
  const adjectives = [
    'happy', 'cool', 'bright', 'smart', 'quick', 'calm', 'bold', 'fresh',
    'warm', 'clean', 'clear', 'deep', 'fast', 'free', 'good', 'kind',
    'light', 'open', 'pure', 'rich', 'safe', 'soft', 'true', 'wide',
    'young', 'sweet', 'strong', 'sharp', 'simple', 'smooth'
  ]
  
  const nouns = [
    'mountain', 'ocean', 'river', 'forest', 'garden', 'bridge', 'tower', 'castle',
    'island', 'valley', 'meadow', 'stream', 'sunset', 'sunrise', 'cloud', 'star',
    'moon', 'wave', 'breeze', 'flame', 'crystal', 'diamond', 'pearl', 'stone',
    'flower', 'tree', 'bird', 'butterfly', 'journey', 'adventure'
  ]
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 100)
  
  return `${adjective}-${noun}-${number}`
}

/**
 * 짧은 랜덤 코드를 생성합니다 (6자리)
 * 예: abc123, xyz789
 */
export function generateShortCode(): string {
  return generateRandomString(6, true)
}

/**
 * 여러 형태의 랜덤 URL 중 하나를 선택하여 생성합니다
 */
export function generatePageSlug(): string {
  const types = ['friendly', 'short', 'mixed']
  const selectedType = types[Math.floor(Math.random() * types.length)]
  
  switch (selectedType) {
    case 'friendly':
      return generateFriendlySlug()
    case 'short':
      return generateShortCode()
    case 'mixed':
      return `${generateRandomString(4, false)}${Math.floor(Math.random() * 1000)}`
    default:
      return generateFriendlySlug()
  }
}

/**
 * 슬러그가 유효한 형식인지 확인합니다
 */
export function isValidSlug(slug: string): boolean {
  // 영문자, 숫자, 하이픈만 허용, 3-50자
  const slugRegex = /^[a-z0-9-]{3,50}$/
  return slugRegex.test(slug)
}

/**
 * URL 안전성을 위해 슬러그를 정리합니다
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}