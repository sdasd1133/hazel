export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          is_admin?: boolean
        }
      }
      parent_categories: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          category: string
          description: string | null
          is_featured: boolean
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: string
          description?: string | null
          is_featured?: boolean
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: string
          description?: string | null
          is_featured?: boolean
          in_stock?: boolean
          created_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          display_order: number
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          display_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          display_order?: number
        }
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          size: string
        }
        Insert: {
          id?: string
          product_id: string
          size: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string
        }
      }
      product_colors: {
        Row: {
          id: string
          product_id: string
          color: string
        }
        Insert: {
          id?: string
          product_id: string
          color: string
        }
        Update: {
          id?: string
          product_id?: string
          color?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          selected_size: string | null
          selected_color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity?: number
          selected_size?: string | null
          selected_color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          selected_size?: string | null
          selected_color?: string | null
          created_at?: string
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
  }
}
