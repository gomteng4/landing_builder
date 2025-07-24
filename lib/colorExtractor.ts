/**
 * 이미지에서 색상을 추출하는 유틸리티 함수들
 */

export interface ColorPalette {
  dominantColor: string
  colors: string[]
  textColors: string[] // 텍스트에 적합한 색상들
}

/**
 * 이미지에서 주요 색상들을 추출합니다
 */
export function extractColorsFromImage(imageUrl: string): Promise<ColorPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        // 성능을 위해 이미지 크기 조정
        const maxSize = 200
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = extractDominantColors(imageData.data, 8)
        
        const palette: ColorPalette = {
          dominantColor: colors[0] || '#3b82f6',
          colors: colors,
          textColors: generateTextColors(colors)
        }
        
        resolve(palette)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

/**
 * 특정 좌표의 색상을 추출합니다 (스포이드 기능)
 */
export function extractColorFromPoint(imageUrl: string, x: number, y: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(x, y, 1, 1)
        const [r, g, b] = Array.from(imageData.data)
        
        const color = rgbToHex(r, g, b)
        resolve(color)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

/**
 * RGB 값을 HEX로 변환
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * HEX를 RGB로 변환
 */
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * 이미지 데이터에서 주요 색상들을 추출
 */
function extractDominantColors(imageData: Uint8ClampedArray, colorCount: number = 5): string[] {
  const colorMap = new Map<string, number>()
  
  // 4픽셀마다 샘플링하여 성능 향상
  for (let i = 0; i < imageData.length; i += 16) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    const a = imageData[i + 3]
    
    // 투명한 픽셀 제외
    if (a < 128) continue
    
    // 너무 밝거나 어두운 색상 필터링
    const brightness = (r + g + b) / 3
    if (brightness < 30 || brightness > 225) continue
    
    // 색상을 약간 그룹화하여 비슷한 색상들을 합침
    const groupedR = Math.floor(r / 32) * 32
    const groupedG = Math.floor(g / 32) * 32
    const groupedB = Math.floor(b / 32) * 32
    
    const color = rgbToHex(groupedR, groupedG, groupedB)
    colorMap.set(color, (colorMap.get(color) || 0) + 1)
  }
  
  // 빈도순으로 정렬하여 상위 색상들 반환
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([color]) => color)
}

/**
 * 주요 색상들로부터 텍스트에 적합한 색상들을 생성
 */
function generateTextColors(colors: string[]): string[] {
  const textColors: string[] = []
  
  colors.forEach(color => {
    const rgb = hexToRgb(color)
    if (!rgb) return
    
    // 밝기 계산
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    
    // 어두운 배경에는 밝은 텍스트, 밝은 배경에는 어두운 텍스트
    if (brightness > 128) {
      // 밝은 색상 - 어두운 텍스트 생성
      const darkerR = Math.max(0, rgb.r - 100)
      const darkerG = Math.max(0, rgb.g - 100)
      const darkerB = Math.max(0, rgb.b - 100)
      textColors.push(rgbToHex(darkerR, darkerG, darkerB))
    } else {
      // 어두운 색상 - 밝은 텍스트 생성
      const lighterR = Math.min(255, rgb.r + 100)
      const lighterG = Math.min(255, rgb.g + 100)
      const lighterB = Math.min(255, rgb.b + 100)
      textColors.push(rgbToHex(lighterR, lighterG, lighterB))
    }
  })
  
  return textColors
}

/**
 * 색상의 대비를 계산 (접근성을 위한 함수)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 1
  
  const luminance1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const luminance2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const brighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  
  return (brighter + 0.05) / (darker + 0.05)
}

/**
 * 색상의 명도를 계산
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * 색상이 텍스트에 적합한지 확인 (배경색과의 대비 고려)
 */
export function isGoodTextColor(textColor: string, backgroundColor: string): boolean {
  const contrast = getContrastRatio(textColor, backgroundColor)
  return contrast >= 4.5 // WCAG AA 기준
}

/**
 * 색상 팔레트를 생성하는 헬퍼 함수
 */
export function generateColorVariations(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return [baseColor]
  
  const variations: string[] = [baseColor]
  
  // 밝기 변형
  for (let i = 1; i <= 3; i++) {
    const factor = 0.8 + (i * 0.1)
    const lighterR = Math.min(255, Math.floor(rgb.r * factor))
    const lighterG = Math.min(255, Math.floor(rgb.g * factor))
    const lighterB = Math.min(255, Math.floor(rgb.b * factor))
    variations.push(rgbToHex(lighterR, lighterG, lighterB))
    
    const darkerR = Math.max(0, Math.floor(rgb.r / factor))
    const darkerG = Math.max(0, Math.floor(rgb.g / factor))
    const darkerB = Math.max(0, Math.floor(rgb.b / factor))
    variations.push(rgbToHex(darkerR, darkerG, darkerB))
  }
  
  return variations
}