import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PageElement = {
  id: string
  type: 'heading' | 'text' | 'image' | 'video' | 'button' | 'form' | 'spacer' | 'html'
  content: any
  styles?: any
  order: number
}

export type Page = {
  id: string
  title: string
  elements: PageElement[]
  settings: {
    primaryColor: string
    backgroundColor: string
    title: string
  }
  created_at: string
  updated_at: string
}

export type FormSubmission = {
  id: string
  page_id: string
  name?: string
  email?: string
  phone?: string
  data: any
  created_at: string
}