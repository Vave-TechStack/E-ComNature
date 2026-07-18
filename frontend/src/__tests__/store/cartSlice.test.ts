import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleSaveForLater,
  toggleCart,
  setCartOpen,
} from '@/store/slices/cartSlice';
import type { CartItem } from '@/types';

const createMockItem = (overrides?: Partial<CartItem>): CartItem => ({
  id: 1,
  productId: 1,
  productName: 'Test Product',
  productImage: 'https://example.com/image.jpg',
  quantity: 1,
  unitPrice: 499,
  totalPrice: 499,
  isSavedForLater: false,
  isGiftWrap: false,
  ...overrides,
});

describe('cartSlice', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.items).toEqual([]);
    expect(state.itemCount).toBe(0);
    expect(state.totalAmount).toBe(0);
    expect(state.isOpen).toBe(false);
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const item = createMockItem();
      const state = reducer(undefined, addItem(item));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].productName).toBe('Test Product');
      expect(state.itemCount).toBe(1);
      expect(state.totalAmount).toBe(499);
    });

    it('should increase quantity if same product and variant already exists', () => {
      const item = createMockItem({ productId: 1, unitPrice: 499, quantity: 1, totalPrice: 499 });
      const stateWithItem = reducer(undefined, addItem(item));
      const updatedState = reducer(stateWithItem, addItem({ ...item, quantity: 1, totalPrice: 499 }));

      expect(updatedState.items).toHaveLength(1);
      expect(updatedState.items[0].quantity).toBe(2);
      expect(updatedState.items[0].totalPrice).toBe(998);
      expect(updatedState.itemCount).toBe(2);
    });

    it('should handle multiple different items', () => {
      const item1 = createMockItem({ productId: 1, productName: 'Product 1' });
      const item2 = createMockItem({ productId: 2, productName: 'Product 2', id: 2 });

      const stateAfterFirst = reducer(undefined, addItem(item1));
      const stateAfterSecond = reducer(stateAfterFirst, addItem(item2));

      expect(stateAfterSecond.items).toHaveLength(2);
      expect(stateAfterSecond.itemCount).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from cart by productId', () => {
      const item = createMockItem();
      const stateWithItem = reducer(undefined, addItem(item));
      const state = reducer(stateWithItem, removeItem({ productId: item.productId }));

      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
      expect(state.totalAmount).toBe(0);
    });

    it('should remove item by productId and variantId', () => {
      const item1 = createMockItem({ productId: 1, variantId: 1, variantInfo: 'Red' });
      const item2 = createMockItem({ productId: 1, variantId: 2, variantInfo: 'Blue', id: 2 });
      const stateWithItems = reducer(undefined, addItem(item1));
      const stateWithTwo = reducer(stateWithItems, addItem(item2));

      const state = reducer(stateWithTwo, removeItem({ productId: 1, variantId: 1 }));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].variantInfo).toBe('Blue');
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const item = createMockItem();
      const stateWithItem = reducer(undefined, addItem(item));
      const state = reducer(stateWithItem, updateQuantity({ productId: 1, quantity: 3 }));

      expect(state.items[0].quantity).toBe(3);
      expect(state.items[0].totalPrice).toBe(1497); // 499 * 3
      expect(state.itemCount).toBe(3);
    });

    it('should update quantity with variantId', () => {
      const item = createMockItem({ variantId: 1 });
      const stateWithItem = reducer(undefined, addItem(item));
      const state = reducer(stateWithItem, updateQuantity({ productId: 1, variantId: 1, quantity: 5 }));

      expect(state.items[0].quantity).toBe(5);
    });
  });

  describe('toggleSaveForLater', () => {
    it('should toggle isSavedForLater flag', () => {
      const item = createMockItem();
      const stateWithItem = reducer(undefined, addItem(item));

      const toggledOn = reducer(stateWithItem, toggleSaveForLater(1));
      expect(toggledOn.items[0].isSavedForLater).toBe(true);

      const toggledOff = reducer(toggledOn, toggleSaveForLater(1));
      expect(toggledOff.items[0].isSavedForLater).toBe(false);
    });
  });

  describe('clearCart', () => {
    it('should clear all items and reset counts', () => {
      const item1 = createMockItem({ productId: 1 });
      const item2 = createMockItem({ productId: 2, id: 2 });
      const stateWithItems = reducer(undefined, addItem(item1));
      const stateWithTwo = reducer(stateWithItems, addItem(item2));
      const state = reducer(stateWithTwo, clearCart());

      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
      expect(state.totalAmount).toBe(0);
    });
  });

  describe('cart open/close', () => {
    it('should toggle cart open state', () => {
      const toggledOn = reducer(undefined, toggleCart());
      expect(toggledOn.isOpen).toBe(true);

      const toggledOff = reducer(toggledOn, toggleCart());
      expect(toggledOff.isOpen).toBe(false);
    });

    it('should set cart open state explicitly', () => {
      const opened = reducer(undefined, setCartOpen(true));
      expect(opened.isOpen).toBe(true);

      const closed = reducer(opened, setCartOpen(false));
      expect(closed.isOpen).toBe(false);
    });
  });
});
