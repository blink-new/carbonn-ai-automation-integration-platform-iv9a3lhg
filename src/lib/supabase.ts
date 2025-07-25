import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          provider: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          provider: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          service_name: string
          service_type: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_name: string
          service_type: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_name?: string
          service_type?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          trigger_type: string
          trigger_config: any
          actions: any[]
          is_active: boolean
          execution_count: number
          last_executed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          trigger_type: string
          trigger_config: any
          actions: any[]
          is_active?: boolean
          execution_count?: number
          last_executed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          trigger_type?: string
          trigger_config?: any
          actions?: any[]
          is_active?: boolean
          execution_count?: number
          last_executed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}