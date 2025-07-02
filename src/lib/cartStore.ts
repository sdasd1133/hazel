import { create } from 'zustand';
import { Product, CartItem } from '@/types';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, size, color) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          item => item.product.id === product.id && 
                 item.selectedSize === size && 
                 item.selectedColor === color
        );

        if (existingItemIndex > -1) {
          // 같은 상품이 이미 있으면 수량만 증가
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // 새 상품 추가
          set({ 
            items: [...currentItems, { 
              product, 
              quantity, 
              selectedSize: size, 
              selectedColor: color 
            }]
          });
        }
      },
      removeItem: (itemToRemove) => {
        set({
          items: get().items.filter(item => 
            !(item.product.id === itemToRemove.product.id && 
              item.selectedSize === itemToRemove.selectedSize &&
              item.selectedColor === itemToRemove.selectedColor))
        });
      },
      updateQuantity: (itemToUpdate, quantity) => {
        const updatedItems = get().items.map(item => {
          if (item.product.id === itemToUpdate.product.id && 
              item.selectedSize === itemToUpdate.selectedSize &&
              item.selectedColor === itemToUpdate.selectedColor) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage', // 로컬 스토리지에 저장될 이름
    }
  )
);
