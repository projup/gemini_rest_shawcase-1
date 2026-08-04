/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, Order, OrderItem, CartItem, ItemStatus, OrderStatus, Role, MenuModifier } from '../types';
import { MENU_ITEMS } from '../data/menu';

const STORAGE_KEY = 'restaurant_automation_pilot_state';
const CHANNEL_NAME = 'restaurant_automation_pilot_channel';

// Derived Order Status helper (Dynamic selector)
export function getOrderStatus(order: Order): OrderStatus {
  const statuses = order.items.map(item => item.status);
  if (statuses.length === 0) return 'pending';

  if (statuses.every(s => s === 'cancelled')) {
    return 'cancelled';
  }

  // Filter out cancelled items for progressive tracking
  const nonCancelled = statuses.filter(s => s !== 'cancelled');
  if (nonCancelled.length === 0) return 'cancelled';

  if (nonCancelled.every(s => s === 'served')) {
    return 'completed';
  }
  if (nonCancelled.every(s => s === 'ready' || s === 'served')) {
    return 'ready';
  }
  if (nonCancelled.some(s => s === 'preparing')) {
    return 'preparing';
  }
  if (nonCancelled.some(s => s === 'accepted')) {
    return 'accepted';
  }
  return 'pending';
}

const DEFAULT_STATE: AppState = {
  orders: [],
  demoActive: false,
  demoStep: 0,
  activeTable: 'Table 5',
  menuModifiers: {},
};

class StateStore {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();
  private channel: BroadcastChannel | null = null;
  private demoTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.loadInitialState();
    
    // Set up cross-tab synchronization using BroadcastChannel
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'STATE_UPDATE') {
            this.state = event.data.state;
            this.notifyListeners();
          }
        };
      } catch (err) {
        console.error('BroadcastChannel is not supported or failed to initialize', err);
      }
    }
  }

  private loadInitialState(): AppState {
    let initial: AppState;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          initial = { ...parsed };
        } catch {
          initial = { ...DEFAULT_STATE };
        }
      } else {
        initial = { ...DEFAULT_STATE };
      }
    } else {
      initial = { ...DEFAULT_STATE };
    }

    if (!initial.menuModifiers) {
      initial.menuModifiers = {};
    }

    // Auto-clear demo active on fresh reload to avoid getting stuck
    initial.demoActive = false;
    initial.demoStep = 0;

    // Pre-populate menuModifiers for any menu items not present
    MENU_ITEMS.forEach(item => {
      if (!initial.menuModifiers[item.id]) {
        initial.menuModifiers[item.id] = {
          price: item.price,
          stock: 30, // Default stock of 30 for all items
          disabled: false
        };
      }
    });

    return initial;
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'STATE_UPDATE', state: this.state });
      } catch (err) {
        console.error('Failed to post state update', err);
      }
    }
    this.notifyListeners();
  }

  public subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    // Initial emission
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.state));
  }

  public getState(): AppState {
    return this.state;
  }

  public updateState(partial: Partial<AppState>) {
    this.state = {
      ...this.state,
      ...partial,
    };
    this.saveState();
  }

  // BUSINESS ACTIONS

  public createOrder(tableNumber: string, cartItems: CartItem[], notes?: string): Order {
    const orderId = `ord_${Math.random().toString(36).substr(2, 9)}`;
    const shortId = Math.random().toString(36).substr(2, 4).toUpperCase();

    // Deduct stock levels in menuModifiers for each item ordered
    const updatedModifiers = { ...this.state.menuModifiers };
    const items: OrderItem[] = cartItems.map((cart, idx) => {
      const menuItem = cart.menuItem;
      const customPrice = updatedModifiers[menuItem.id]?.price ?? menuItem.price;
      
      // Deduct stock
      if (updatedModifiers[menuItem.id]) {
        updatedModifiers[menuItem.id] = {
          ...updatedModifiers[menuItem.id],
          stock: Math.max(0, updatedModifiers[menuItem.id].stock - cart.quantity)
        };
      }

      return {
        id: `${orderId}_item_${idx}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: customPrice,
        quantity: cart.quantity,
        department: menuItem.department,
        status: 'pending',
        notes: cart.notes,
      };
    });

    const newOrder: Order = {
      id: orderId,
      shortId,
      tableNumber,
      items,
      createdAt: new Date().toISOString(),
      notes,
    };

    this.state = {
      ...this.state,
      orders: [newOrder, ...this.state.orders],
      menuModifiers: updatedModifiers
    };
    this.saveState();
    return newOrder;
  }

  public updateOrderItemStatus(orderId: string, itemId: string, status: ItemStatus) {
    this.state = {
      ...this.state,
      orders: this.state.orders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, status };
          })
        };
      })
    };
    this.saveState();
  }

  public updateOrderAllItemsStatus(orderId: string, status: ItemStatus) {
    this.state = {
      ...this.state,
      orders: this.state.orders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item => ({ ...item, status }))
        };
      })
    };
    this.saveState();
  }

  public updateMenuModifier(itemId: string, modifier: Partial<MenuModifier>) {
    const updatedModifiers = { ...this.state.menuModifiers };
    if (!updatedModifiers[itemId]) {
      const menuItem = MENU_ITEMS.find(item => item.id === itemId);
      updatedModifiers[itemId] = {
        price: menuItem?.price ?? 0,
        stock: 30,
        disabled: false
      };
    }
    updatedModifiers[itemId] = {
      ...updatedModifiers[itemId],
      ...modifier
    };
    this.state = {
      ...this.state,
      menuModifiers: updatedModifiers
    };
    this.saveState();
  }

  public advanceAllItemsForDepartment(orderId: string, department: 'kitchen' | 'bar', nextStatus: ItemStatus) {
    this.state = {
      ...this.state,
      orders: this.state.orders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item => {
            if (item.department !== department) return item;
            // Only advance if it's not already at served or further along than nextStatus
            return { ...item, status: nextStatus };
          })
        };
      })
    };
    this.saveState();
  }

  public requestWaiter(orderId: string, value: boolean = true) {
    this.state = {
      ...this.state,
      orders: this.state.orders.map(order => {
        if (order.id !== orderId) return order;
        return { ...order, waiterRequested: value };
      })
    };
    this.saveState();
  }

  public requestBill(orderId: string, value: boolean = true, paymentMethod?: 'vietqr' | 'card_terminal' | 'cash' | 'card', changeRequestedFrom?: string) {
    this.state = {
      ...this.state,
      orders: this.state.orders.map(order => {
        if (order.id !== orderId) return order;
        return { 
          ...order, 
          billRequested: value,
          paymentMethod: value ? paymentMethod : undefined,
          changeRequestedFrom: value ? changeRequestedFrom : undefined
        };
      })
    };
    this.saveState();
  }

  public payBill(orderId: string) {
    this.state = {
      ...this.state,
      orders: this.state.orders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          billPaid: true,
          billRequested: false,
          items: order.items.map(item => ({ ...item, status: 'served' as ItemStatus }))
        };
      })
    };
    this.saveState();
  }

  public deleteOrder(orderId: string) {
    this.state = {
      ...this.state,
      orders: this.state.orders.filter(order => order.id !== orderId)
    };
    this.saveState();
  }

  public clearAllOrders() {
    this.stopDemo();
    this.state = {
      ...DEFAULT_STATE,
      orders: []
    };
    this.saveState();
  }

  // DEMO MODE RUNNER

  public startDemo() {
    if (this.demoTimer) clearTimeout(this.demoTimer);
    
    // Clear any previous orders to show a clean demo sequence
    this.state = {
      ...this.state,
      orders: [],
      demoActive: true,
      demoStep: 1
    };
    this.saveState();

    // Step 1: Place an order
    this.runDemoStep(1);
  }

  public stopDemo() {
    if (this.demoTimer) {
      clearTimeout(this.demoTimer);
      this.demoTimer = null;
    }
    this.state = {
      ...this.state,
      demoActive: false,
      demoStep: 0
    };
    this.saveState();
  }

  private runDemoStep(step: number) {
    if (!this.state.demoActive) return;

    const delay = (ms: number, nextStep: () => void) => {
      this.demoTimer = setTimeout(() => {
        if (!this.state.demoActive) return;
        nextStep();
      }, ms);
    };

    switch (step) {
      case 1: {
        // Place demo order containing both kitchen items and bar drinks
        const demoCartItems: CartItem[] = [
          {
            menuItem: MENU_ITEMS.find(item => item.id === 'starter_rolls')!,
            quantity: 1,
            notes: 'Extra sweet chili sauce'
          },
          {
            menuItem: MENU_ITEMS.find(item => item.id === 'main_steak')!,
            quantity: 1,
            notes: 'Medium-rare'
          },
          {
            menuItem: MENU_ITEMS.find(item => item.id === 'drink_lemonade')!,
            quantity: 1,
            notes: 'Less ice'
          },
          {
            menuItem: MENU_ITEMS.find(item => item.id === 'alcohol_martini')!,
            quantity: 1
          }
        ];

        const order = this.createOrder('Table 4', demoCartItems, 'Demo Automate Session');
        
        this.state = {
          ...this.state,
          demoStep: 2
        };
        this.saveState();

        delay(3000, () => this.runDemoStep(2));
        break;
      }

      case 2: {
        // Admin views the order and marks both departments as Accepted
        const activeOrder = this.state.orders[0];
        if (activeOrder) {
          this.advanceAllItemsForDepartment(activeOrder.id, 'kitchen', 'accepted');
          this.advanceAllItemsForDepartment(activeOrder.id, 'bar', 'accepted');
        }
        
        this.state = {
          ...this.state,
          demoStep: 3
        };
        this.saveState();

        delay(3000, () => this.runDemoStep(3));
        break;
      }

      case 3: {
        // Kitchen begins preparing the meals
        const activeOrder = this.state.orders[0];
        if (activeOrder) {
          this.advanceAllItemsForDepartment(activeOrder.id, 'kitchen', 'preparing');
        }
        
        this.state = {
          ...this.state,
          demoStep: 4
        };
        this.saveState();

        delay(3000, () => this.runDemoStep(4));
        break;
      }

      case 4: {
        // Bar begins preparing the drinks
        const activeOrder = this.state.orders[0];
        if (activeOrder) {
          this.advanceAllItemsForDepartment(activeOrder.id, 'bar', 'preparing');
        }
        
        this.state = {
          ...this.state,
          demoStep: 5
        };
        this.saveState();

        delay(3000, () => this.runDemoStep(5));
        break;
      }

      case 5: {
        // Kitchen completes the appetizers and steak -> READY
        const activeOrder = this.state.orders[0];
        if (activeOrder) {
          this.advanceAllItemsForDepartment(activeOrder.id, 'kitchen', 'ready');
        }
        
        this.state = {
          ...this.state,
          demoStep: 6
        };
        this.saveState();

        delay(3000, () => this.runDemoStep(6));
        break;
      }

      case 6: {
        // Bar completes the artisan drinks -> READY
        const activeOrder = this.state.orders[0];
        if (activeOrder) {
          this.advanceAllItemsForDepartment(activeOrder.id, 'bar', 'ready');
        }
        
        this.state = {
          ...this.state,
          demoStep: 7
        };
        this.saveState();

        delay(3500, () => this.runDemoStep(7));
        break;
      }

      case 7: {
        // Admin or staff delivers the items -> SERVED, completes the full order cycle
        const activeOrder = this.state.orders[0];
        if (activeOrder) {
          this.payBill(activeOrder.id);
        }
        
        this.state = {
          ...this.state,
          demoStep: 8,
          demoActive: false // Stop automatic triggers, sequence is complete!
        };
        this.saveState();
        break;
      }

      default:
        this.stopDemo();
        break;
    }
  }
}

export const store = new StateStore();
export default store;
