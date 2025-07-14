import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);
        
        if (!existingItem) {
          set({ items: [...items, product] });
        }
      },
      
      removeItem: (productId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== productId) });
      },
      
      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
