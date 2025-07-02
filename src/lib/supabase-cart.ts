import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// 로컬 장바구니 타입
interface CartState {
  items: CartItem[];
  cartId: string | null;
  addItem: (product: Product, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithSupabase: (userId?: string | null) => Promise<void>;
}

export const useCartStore = create<CartState>(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      
      // 장바구니에 상품 추가
      addItem: (product, quantity, selectedSize, selectedColor) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => 
              item.product.id === product.id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                {
                  product,
                  quantity,
                  selectedSize,
                  selectedColor,
                },
              ],
            };
          }
        });
        
        // 장바구니 업데이트 후 Supabase에 동기화
        const userId = localStorage.getItem('supabase.auth.token')
          ? JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').user?.id
          : null;
        
        get().syncWithSupabase(userId);
      },
      
      // 장바구니에서 상품 제거
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
        
        // 장바구니 업데이트 후 Supabase에 동기화
        const userId = localStorage.getItem('supabase.auth.token')
          ? JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').user?.id
          : null;
        
        get().syncWithSupabase(userId);
      },
      
      // 장바구니 상품 수량 업데이트
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
        
        // 장바구니 업데이트 후 Supabase에 동기화
        const userId = localStorage.getItem('supabase.auth.token')
          ? JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').user?.id
          : null;
        
        get().syncWithSupabase(userId);
      },
      
      // 장바구니 비우기
      clearCart: () => {
        set({ items: [] });
        
        // 장바구니 업데이트 후 Supabase에 동기화
        const userId = localStorage.getItem('supabase.auth.token')
          ? JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').user?.id
          : null;
        
        get().syncWithSupabase(userId);
      },
      
      // 장바구니 총 상품 개수
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // 장바구니 총 가격
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      // Supabase와 장바구니 동기화
      syncWithSupabase: async (userId) => {
        try {
          const state = get();
          
          // 로그인된 사용자만 Supabase에 동기화
          if (!userId) {
            return;
          }
          
          // 1. 현재 사용자의 장바구니 가져오기 또는 새로운 장바구니 생성
          let cartId = state.cartId;
          
          if (!cartId) {
            // 장바구니 생성
            const { data: cartData, error: cartError } = await supabase
              .from('carts')
              .insert({ user_id: userId })
              .select('id')
              .single();
            
            if (cartError) {
              console.error('Error creating cart:', cartError);
              return;
            }
            
            cartId = cartData.id;
            set({ cartId });
          }
          
          // 2. 현재 장바구니의 모든 아이템 삭제
          await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cartId);
          
          // 3. 새 아이템 추가
          if (state.items.length > 0) {
            const cartItems = state.items.map((item) => ({
              id: uuidv4(),
              cart_id: cartId,
              product_id: item.product.id,
              quantity: item.quantity,
              selected_size: item.selectedSize || null,
              selected_color: item.selectedColor || null,
            }));
            
            const { error: insertError } = await supabase
              .from('cart_items')
              .insert(cartItems);
            
            if (insertError) {
              console.error('Error inserting cart items:', insertError);
            }
          }
        } catch (error) {
          console.error('Error syncing cart with Supabase:', error);
        }
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
