/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Department = 'kitchen' | 'bar';

export type ItemStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface MenuItem {
  id: string;
  name: {
    en: string;
    ru: string;
    vi: string;
  };
  description: {
    en: string;
    ru: string;
    vi: string;
  };
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks' | 'alcohol';
  department: Department;
  image: string;
  popular?: boolean;
  spicy?: boolean;
  vegan?: boolean;
}

export interface MenuModifier {
  price: number;
  stock: number;
  disabled: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: {
    en: string;
    ru: string;
    vi: string;
  };
  price: number;
  quantity: number;
  department: Department;
  status: ItemStatus;
  notes?: string;
}

export interface Order {
  id: string;
  shortId: string;
  tableNumber: string;
  items: OrderItem[];
  createdAt: string;
  notes?: string;
  waiterRequested?: boolean;
  billRequested?: boolean;
  billPaid?: boolean;
  paymentMethod?: 'vietqr' | 'card_terminal' | 'cash' | 'card';
  changeRequestedFrom?: string;
}

export type Language = 'en' | 'ru' | 'vi';

export type Role = 'guest' | 'manager' | 'kitchen' | 'bar' | 'admin';

export interface AppState {
  orders: Order[];
  demoActive: boolean;
  demoStep: number;
  activeTable: string;
  menuModifiers: Record<string, MenuModifier>;
}
