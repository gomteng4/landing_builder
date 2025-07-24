// Figma CSS를 HTML로 변환하는 유틸리티 함수

export function convertFigmaToHTML(figmaCSS: string): { html: string; css: string } {
  const lines = figmaCSS.split('\n').map(line => line.trim()).filter(line => line);
  
  let currentElement: any = null;
  const elements: any[] = [];
  let globalStyles: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 새로운 요소의 시작 (주석으로 이름이 지정된 경우)
    if (line.startsWith('/*') && line.endsWith('*/')) {
      if (currentElement) {
        elements.push(currentElement);
      }
      
      const elementName = line.replace(/\/\*\s*/, '').replace(/\s*\*\//, '');
      currentElement = {
        name: elementName,
        className: `figma-${elementName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
        styles: {},
        content: elementName
      };
      continue;
    }
    
    // CSS 속성 파싱
    if (line.includes(':') && line.endsWith(';')) {
      const [property, value] = line.split(':').map(s => s.trim());
      const cleanValue = value.replace(';', '');
      
      if (currentElement) {
        currentElement.styles[property] = cleanValue;
      } else {
        globalStyles.push(`${property}: ${cleanValue};`);
      }
    }
  }
  
  // 마지막 요소 추가
  if (currentElement) {
    elements.push(currentElement);
  }
  
  // HTML 생성
  const html = generateHTML(elements);
  
  // CSS 생성
  const css = generateCSS(elements, globalStyles);
  
  return { html, css };
}

function generateHTML(elements: any[]): string {
  if (elements.length === 0) {
    return '<div>요소를 찾을 수 없습니다</div>';
  }
  
  // 컨테이너로 감싸기
  let html = '<div class="figma-container">\n';
  
  elements.forEach(element => {
    const tag = getAppropriateTag(element);
    const content = getElementContent(element);
    
    html += `  <${tag} class="${element.className}">${content}</${tag}>\n`;
  });
  
  html += '</div>';
  
  return html;
}

function generateCSS(elements: any[], globalStyles: string[]): string {
  let css = '';
  
  // 컨테이너 스타일
  css += '.figma-container {\n';
  css += '  position: relative;\n';
  css += '  width: 100%;\n';
  css += '  max-width: 1206px;\n';
  css += '  margin: 0 auto;\n';
  css += '  background: #FFFFFF;\n';
  
  // 글로벌 스타일이 있으면 추가
  globalStyles.forEach(style => {
    css += `  ${style}\n`;
  });
  
  css += '}\n\n';
  
  // 각 요소별 스타일
  elements.forEach(element => {
    css += `.${element.className} {\n`;
    
    Object.entries(element.styles).forEach(([property, value]) => {
      const convertedStyle = convertCSSProperty(property, value as string);
      if (convertedStyle) {
        css += `  ${convertedStyle}\n`;
      }
    });
    
    css += '}\n\n';
  });
  
  // 반응형 스타일 추가
  css += `
/* 모바일 반응형 */
@media (max-width: 768px) {
  .figma-container {
    max-width: 100%;
    padding: 20px;
    transform: scale(0.6);
    transform-origin: top left;
  }
  
  .figma-container > * {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    margin-bottom: 20px;
  }
}`;
  
  return css;
}

function convertCSSProperty(property: string, value: string): string | null {
  // position absolute를 relative로 변환하거나 제거
  if (property === 'position' && value === 'absolute') {
    return 'position: relative;';
  }
  
  // 이미지 URL 처리
  if (property === 'background' && value.startsWith('url(')) {
    const imageName = value.replace('url(', '').replace(')', '');
    return `/* 이미지를 업로드하세요: ${imageName} */\n  background: #f0f0f0;`;
  }
  
  // 폰트 패밀리 처리 (웹 폰트로 변경)
  if (property === 'font-family' && value.includes('Paperlogy')) {
    return 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
  }
  
  // 일반 CSS 속성
  const validProperties = [
    'width', 'height', 'background', 'color', 'font-size', 'font-weight',
    'line-height', 'text-align', 'border-radius', 'margin', 'padding',
    'display', 'align-items', 'justify-content', 'flex-direction'
  ];
  
  if (validProperties.includes(property)) {
    return `${property}: ${value};`;
  }
  
  return null;
}

function getAppropriateTag(element: any): string {
  const name = element.name.toLowerCase();
  
  if (name.includes('button') || name.includes('버튼')) {
    return 'button';
  }
  
  if (name.includes('text') || name.includes('title') || 
      element.styles['font-size'] || element.content.length > 0) {
    const fontSize = parseInt(element.styles['font-size'] || '16');
    if (fontSize > 32) return 'h1';
    if (fontSize > 24) return 'h2';
    if (fontSize > 18) return 'h3';
    return 'p';
  }
  
  if (name.includes('image') || name.includes('img') || name.includes('icon')) {
    return 'div'; // 이미지는 배경으로 처리
  }
  
  return 'div';
}

function getElementContent(element: any): string {
  // 버튼이나 텍스트 요소의 경우 의미있는 내용 생성
  if (element.name.includes('인증')) {
    return element.name;
  }
  
  if (element.name.includes('로고')) {
    return `<span style="font-weight: bold;">${element.name}</span>`;
  }
  
  // 이미지나 아이콘의 경우
  if (element.styles.background && element.styles.background.startsWith('url(')) {
    const imageName = element.styles.background.replace('url(', '').replace(')', '');
    return `<span style="color: #999; font-size: 12px;">📷 이미지: ${imageName}</span>`;
  }
  
  return element.content || element.name || '';
}