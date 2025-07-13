import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

export interface Order {
  id: number
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  total_amount: number
  shipping_amount: number
  payment_method?: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address: {
    name: string
    phone: string
    address: string
    detail_address?: string
    postal_code?: string
  }
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface CreateOrderData {
  user_id: string
  total_amount: number
  shipping_amount?: number
  payment_method?: string
  shipping_address: {
    name: string
    phone: string
    address: string
    detail_address?: string
    postal_code?: string
  }
  notes?: string
  items: {
    product_id: number
    quantity: number
    unit_price: number
    total_price: number
  }[]
}

// 주문 번호 생성 함수
function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = now.getTime().toString().slice(-6)
  return `ORD${date}${time}`
}

// 클라이언트 사이드 주문 서비스
export const orderClient = {
  // 주문 생성
  async createOrder(orderData: CreateOrderData) {
    const supabase = createClient()
    
    try {
      // 트랜잭션 시작
      const orderNumber = generateOrderNumber()
      
      // 주문 생성
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: orderData.total_amount,
          shipping_amount: orderData.shipping_amount || 0,
          payment_method: orderData.payment_method,
          payment_status: 'pending',
          shipping_address: orderData.shipping_address,
          notes: orderData.notes
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 주문 아이템 생성
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 재고 업데이트
      for (const item of orderData.items) {
        const { error: stockError } = await supabase.rpc('update_product_stock', {
          p_product_id: item.product_id,
          p_quantity: -item.quantity
        })
        
        if (stockError) {
          console.warn('재고 업데이트 실패:', stockError)
        }
      }

      return order as Order
    } catch (error) {
      console.error('주문 생성 오류:', error)
      throw error
    }
  },

  // 사용자 주문 목록 조회
  async getUserOrders(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(id, name, images, price)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as (Order & { 
      order_items: (OrderItem & { 
        products: { id: number; name: string; images: string[]; price: number } 
      })[] 
    })[]
  },

  // 주문 상세 조회
  async getOrder(orderId: number) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(id, name, images, price)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data as Order & { 
      order_items: (OrderItem & { 
        products: { id: number; name: string; images: string[]; price: number } 
      })[] 
    }
  },

  // 주문 취소
  async cancelOrder(orderId: number) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data as Order
  }
}

// 관리자용 주문 서비스
export const orderAdmin = {
  // 모든 주문 조회
  async getAllOrders(filters?: {
    status?: string
    limit?: number
    offset?: number
  }) {
    const supabase = createClient()
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        user_profiles(id, name, email),
        order_items(
          *,
          products(id, name, images, price)
        )
      `)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // 주문 상태 업데이트
  async updateOrderStatus(orderId: number, status: Order['status']) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data as Order
  },

  // 결제 상태 업데이트
  async updatePaymentStatus(orderId: number, paymentStatus: Order['payment_status']) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data as Order
  }
}
