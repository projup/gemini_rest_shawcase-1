/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store, getOrderStatus } from '../state/Store';
import { Order, OrderItem, ItemStatus, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

// Mock BroadcastChannel for test environment
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: any) => void) | null = null;
  
  constructor(name: string) {
    this.name = name;
  }
  
  postMessage(message: any) {
    if (this.onmessage) {
      this.onmessage({ data: message });
    }
  }
  
  close() {}
}

vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);

describe('Store', () => {
  beforeEach(() => {
    // Clear all orders before each test
    store.clearAllOrders();
  });

  describe('getOrderStatus', () => {
    it('should return pending for order with no items', () => {
      const order: Order = {
        id: 'test_order',
        shortId: 'TEST',
        tableNumber: 'Table 1',
        items: [],
        createdAt: new Date().toISOString(),
      };
      expect(getOrderStatus(order)).toBe('pending');
    });

    it('should return cancelled when all items are cancelled', () => {
      const order: Order = {
        id: 'test_order',
        shortId: 'TEST',
        tableNumber: 'Table 1',
        items: [
          { id: 'item1', menuItemId: 'espresso', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'cancelled' },
          { id: 'item2', menuItemId: 'latte', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'cancelled' },
        ],
        createdAt: new Date().toISOString(),
      };
      expect(getOrderStatus(order)).toBe('cancelled');
    });

    it('should return completed when all items are served', () => {
      const order: Order = {
        id: 'test_order',
        shortId: 'TEST',
        tableNumber: 'Table 1',
        items: [
          { id: 'item1', menuItemId: 'espresso', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'served' },
        ],
        createdAt: new Date().toISOString(),
      };
      expect(getOrderStatus(order)).toBe('completed');
    });

    it('should return ready when all non-cancelled items are ready or served', () => {
      const order: Order = {
        id: 'test_order',
        shortId: 'TEST',
        tableNumber: 'Table 1',
        items: [
          { id: 'item1', menuItemId: 'espresso', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'ready' },
          { id: 'item2', menuItemId: 'latte', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'served' },
        ],
        createdAt: new Date().toISOString(),
      };
      expect(getOrderStatus(order)).toBe('ready');
    });

    it('should return preparing when some items are preparing', () => {
      const order: Order = {
        id: 'test_order',
        shortId: 'TEST',
        tableNumber: 'Table 1',
        items: [
          { id: 'item1', menuItemId: 'espresso', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'preparing' },
          { id: 'item2', menuItemId: 'latte', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'accepted' },
        ],
        createdAt: new Date().toISOString(),
      };
      expect(getOrderStatus(order)).toBe('preparing');
    });

    it('should return accepted when some items are accepted', () => {
      const order: Order = {
        id: 'test_order',
        shortId: 'TEST',
        tableNumber: 'Table 1',
        items: [
          { id: 'item1', menuItemId: 'espresso', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'accepted' },
          { id: 'item2', menuItemId: 'latte', name: { en: 'Test', ru: 'Тест', vi: 'Test' }, price: 100, quantity: 1, department: 'bar', status: 'pending' },
        ],
        createdAt: new Date().toISOString(),
      };
      expect(getOrderStatus(order)).toBe('accepted');
    });
  });

  describe('createOrder', () => {
    it('should create a new order with cart items', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 2, notes: 'Extra hot' },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      
      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.shortId).toBeDefined();
      expect(order.tableNumber).toBe('Table 5');
      expect(order.items.length).toBe(1);
      expect(order.items[0].quantity).toBe(2);
      expect(order.items[0].notes).toBe('Extra hot');
    });

    it('should deduct stock when creating an order', () => {
      const initialState = store.getState();
      const itemId = MENU_ITEMS[0].id;
      const initialStock = initialState.menuModifiers[itemId]?.stock || 30;
      
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 3 },
      ];
      
      store.createOrder('Table 5', cartItems);
      
      const newState = store.getState();
      expect(newState.menuModifiers[itemId]?.stock).toBe(initialStock - 3);
    });

    it('should not deduct stock below zero', () => {
      const itemId = MENU_ITEMS[0].id;
      
      // Set stock to 2
      store.updateMenuModifier(itemId, { stock: 2 });
      
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 5 },
      ];
      
      store.createOrder('Table 5', cartItems);
      
      const state = store.getState();
      expect(state.menuModifiers[itemId]?.stock).toBe(0);
    });
  });

  describe('updateOrderItemStatus', () => {
    it('should update item status', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      const itemId = order.items[0].id;
      
      store.updateOrderItemStatus(order.id, itemId, 'accepted');
      
      const state = store.getState();
      const updatedOrder = state.orders.find(o => o.id === order.id);
      expect(updatedOrder?.items[0].status).toBe('accepted');
    });
  });

  describe('updateOrderAllItemsStatus', () => {
    it('should update all items status in an order', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
        { menuItem: MENU_ITEMS[1], quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      
      store.updateOrderAllItemsStatus(order.id, 'accepted');
      
      const state = store.getState();
      const updatedOrder = state.orders.find(o => o.id === order.id);
      expect(updatedOrder?.items.every(item => item.status === 'accepted')).toBe(true);
    });
  });

  describe('updateMenuModifier', () => {
    it('should update menu item price', () => {
      const itemId = MENU_ITEMS[0].id;
      const newPrice = 999;
      
      store.updateMenuModifier(itemId, { price: newPrice });
      
      const state = store.getState();
      expect(state.menuModifiers[itemId]?.price).toBe(newPrice);
    });

    it('should update menu item stock', () => {
      const itemId = MENU_ITEMS[0].id;
      const newStock = 50;
      
      store.updateMenuModifier(itemId, { stock: newStock });
      
      const state = store.getState();
      expect(state.menuModifiers[itemId]?.stock).toBe(newStock);
    });

    it('should toggle disabled state', () => {
      const itemId = MENU_ITEMS[0].id;
      
      store.updateMenuModifier(itemId, { disabled: true });
      
      const state = store.getState();
      expect(state.menuModifiers[itemId]?.disabled).toBe(true);
    });
  });

  describe('advanceAllItemsForDepartment', () => {
    it('should advance only items for specified department', () => {
      const kitchenItem = MENU_ITEMS.find(i => i.department === 'kitchen')!;
      const barItem = MENU_ITEMS.find(i => i.department === 'bar')!;
      
      const cartItems: CartItem[] = [
        { menuItem: kitchenItem, quantity: 1 },
        { menuItem: barItem, quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      
      store.advanceAllItemsForDepartment(order.id, 'kitchen', 'accepted');
      
      const state = store.getState();
      const updatedOrder = state.orders.find(o => o.id === order.id);
      
      const kitchenItemUpdated = updatedOrder?.items.find(i => i.department === 'kitchen');
      const barItemUpdated = updatedOrder?.items.find(i => i.department === 'bar');
      
      expect(kitchenItemUpdated?.status).toBe('accepted');
      expect(barItemUpdated?.status).toBe('pending');
    });
  });

  describe('requestWaiter', () => {
    it('should set waiterRequested flag', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      
      store.requestWaiter(order.id, true);
      
      const state = store.getState();
      const updatedOrder = state.orders.find(o => o.id === order.id);
      expect(updatedOrder?.waiterRequested).toBe(true);
    });
  });

  describe('requestBill', () => {
    it('should set billRequested flag and payment method', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      
      store.requestBill(order.id, true, 'vietqr', '500000');
      
      const state = store.getState();
      const updatedOrder = state.orders.find(o => o.id === order.id);
      expect(updatedOrder?.billRequested).toBe(true);
      expect(updatedOrder?.paymentMethod).toBe('vietqr');
      expect(updatedOrder?.changeRequestedFrom).toBe('500000');
    });
  });

  describe('payBill', () => {
    it('should mark bill as paid and set all items to served', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      store.updateOrderItemStatus(order.id, order.items[0].id, 'ready');
      
      store.payBill(order.id);
      
      const state = store.getState();
      const updatedOrder = state.orders.find(o => o.id === order.id);
      expect(updatedOrder?.billPaid).toBe(true);
      expect(updatedOrder?.billRequested).toBe(false);
      expect(updatedOrder?.items[0].status).toBe('served');
    });
  });

  describe('deleteOrder', () => {
    it('should remove order from state', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
      ];
      
      const order = store.createOrder('Table 5', cartItems);
      
      store.deleteOrder(order.id);
      
      const state = store.getState();
      expect(state.orders.find(o => o.id === order.id)).toBeUndefined();
    });
  });

  describe('clearAllOrders', () => {
    it('should remove all orders and reset state', () => {
      const cartItems: CartItem[] = [
        { menuItem: MENU_ITEMS[0], quantity: 1 },
      ];

      store.createOrder('Table 5', cartItems);
      
      const state = store.getState();
      expect(state.orders.length).toBeGreaterThan(0);
      
      store.clearAllOrders();
      
      const clearedState = store.getState();
      expect(clearedState.orders.length).toBe(0);
      expect(clearedState.demoActive).toBe(false);
    });
  });
});
