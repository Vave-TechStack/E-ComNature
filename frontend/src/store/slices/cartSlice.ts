import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  totalAmount: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
        state.items[existingIndex].totalPrice =
          state.items[existingIndex].unitPrice * state.items[existingIndex].quantity;
      } else {
        state.items.push(action.payload);
      }

      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; variantId?: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.variantId === action.payload.variantId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.unitPrice * item.quantity;
      }

      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    removeItem: (state, action: PayloadAction<{ productId: number; variantId?: number }>) => {
      state.items = state.items.filter(
        (item) =>
          !(item.productId === action.payload.productId &&
            item.variantId === action.payload.variantId)
      );

      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    toggleSaveForLater: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.isSavedForLater = !item.isSavedForLater;
      }
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  toggleSaveForLater,
  toggleCart,
  setCartOpen,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
