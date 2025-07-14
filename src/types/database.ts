export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          address: string | null
          role: 'user' | 'admin'
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin'
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin'
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          parent_id: number | null
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          parent_id?: number | null
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          parent_id?: number | null
          slug?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          sale_price: number | null
          stock_quantity: number
          category_id: number | null
          sku: string | null
          images: Json
          tags: string[] | null
          status: 'active' | 'inactive' | 'draft' | 'out_of_stock'
          weight: number | null
          dimensions: Json | null
          featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          sale_price?: number | null
          stock_quantity?: number
          category_id?: number | null
          sku?: string | null
          images?: Json
          tags?: string[] | null
          status?: 'active' | 'inactive' | 'draft' | 'out_of_stock'
          weight?: number | null
          dimensions?: Json | null
          featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          stock_quantity?: number
          category_id?: number | null
          sku?: string | null
          images?: Json
          tags?: string[] | null
          status?: 'active' | 'inactive' | 'draft' | 'out_of_stock'
          weight?: number | null
          dimensions?: Json | null
          featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string | null
          order_number: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          total_amount: number
          shipping_amount: number
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          order_number: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          total_amount: number
          shipping_amount?: number
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          order_number?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          total_amount?: number
          shipping_amount?: number
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          product_id: number | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string | null
          product_id: number | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          product_id?: number | null
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          product_id?: number | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
        }
      }
      bank_accounts: {
        Row: {
          id: number
          bank_name: string
          account_number: string
          account_holder: string
          is_default: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          bank_name: string
          account_number: string
          account_holder: string
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          bank_name?: string
          account_number?: string
          account_holder?: string
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
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

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
