'use client'

import { PageElement, PageSettings } from '@/types/builder'
import ElementRenderer from './ElementRenderer'

interface PublishedPageProps {
  page: {
    id: string
    title: string
    elements: PageElement[]
    settings: PageSettings
  }
}

export default function PublishedPage({ page }: PublishedPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{ 
        backgroundColor: page.settings.backgroundColor,
        '--primary-color': page.settings.primaryColor
      } as React.CSSProperties}
    >
      <head>
        <title>{page.settings.title || page.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      
      <div className="max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {page.elements.map((element) => (
            <div
              key={element.id}
              className="flex"
              style={{
                justifyContent: element.styles?.alignSelf === 'center' ? 'center' : 
                              element.styles?.alignSelf === 'flex-end' ? 'flex-end' : 'flex-start'
              }}
            >
              <ElementRenderer
                element={element}
                settings={page.settings}
                isPreview={true}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}