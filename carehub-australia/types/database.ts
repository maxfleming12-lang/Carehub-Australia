export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          email: string
          avatar_url: string | null
          role: 'user' | 'admin'
          subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise' | null
          subscription_status: 'active' | 'inactive' | 'trialing' | 'cancelled' | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          organization: string | null
          phone: string | null
          state: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          email: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise' | null
          subscription_status?: 'active' | 'inactive' | 'trialing' | 'cancelled' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          organization?: string | null
          phone?: string | null
          state?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          full_name?: string | null
          email?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise' | null
          subscription_status?: 'active' | 'inactive' | 'trialing' | 'cancelled' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          organization?: string | null
          phone?: string | null
          state?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          content: string | null
          file_url: string | null
          category: string
          tags: string[]
          access_tier: 'free' | 'starter' | 'professional' | 'enterprise'
          download_count: number
          is_published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          content?: string | null
          file_url?: string | null
          category: string
          tags?: string[]
          access_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          download_count?: number
          is_published?: boolean
        }
        Update: {
          title?: string
          description?: string
          content?: string | null
          file_url?: string | null
          category?: string
          tags?: string[]
          access_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          download_count?: number
          is_published?: boolean
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          excerpt: string
          content: string
          author_id: string
          cover_image: string | null
          tags: string[]
          is_published: boolean
          view_count: number
          seo_title: string | null
          seo_description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          excerpt: string
          content: string
          author_id: string
          cover_image?: string | null
          tags?: string[]
          is_published?: boolean
          view_count?: number
          seo_title?: string | null
          seo_description?: string | null
        }
        Update: {
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          cover_image?: string | null
          tags?: string[]
          is_published?: boolean
          view_count?: number
          seo_title?: string | null
          seo_description?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: string
          answers: Json
          score: number
          level: string
          recommendations: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          type: string
          answers: Json
          score: number
          level: string
          recommendations: string[]
        }
        Update: {
          [_ in never]?: never
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: string
          title: string
          content: string
          context: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          type: string
          title: string
          content: string
          context: Json
        }
        Update: {
          [_ in never]?: never
        }
        Relationships: []
      }
      shift_notes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          client_name: string
          date: string
          start_time: string
          end_time: string
          content: string
          raw_data: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          client_name: string
          date: string
          start_time: string
          end_time: string
          content: string
          raw_data: Json
        }
        Update: {
          [_ in never]?: never
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          content: Json
          duration_hours: number
          level: 'beginner' | 'intermediate' | 'advanced'
          category: string
          thumbnail: string | null
          access_tier: 'free' | 'starter' | 'professional' | 'enterprise'
          is_published: boolean
          certificate_enabled: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          content: Json
          duration_hours: number
          level: 'beginner' | 'intermediate' | 'advanced'
          category: string
          thumbnail?: string | null
          access_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          is_published?: boolean
          certificate_enabled?: boolean
        }
        Update: {
          title?: string
          description?: string
          content?: Json
          duration_hours?: number
          level?: 'beginner' | 'intermediate' | 'advanced'
          category?: string
          thumbnail?: string | null
          access_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          is_published?: boolean
          certificate_enabled?: boolean
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          course_id: string
          progress: number
          completed: boolean
          completed_at: string | null
          certificate_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          course_id: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
          certificate_url?: string | null
        }
        Update: {
          progress?: number
          completed?: boolean
          completed_at?: string | null
          certificate_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
