/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, Check, Clock, Bell, RefreshCw, Trash2, ShieldAlert, 
  CreditCard, CheckCircle2, ChevronRight, UserCheck, Plus, 
  Minus, ShoppingBag, Send, X, AlertCircle, Play, Ban, Sliders, Coins,
  TrendingUp, DollarSign, BarChart3, Award
} from 'lucide-react';
import { AppState, Language, Order, OrderItem, ItemStatus, MenuItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MENU_ITEMS } from '../data/menu';
import { store, getOrderStatus } from '../state/Store';

interface AdminViewProps {
  state: AppState;
  lang: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({ state, lang }) => {
  const t = TRANSLATIONS[lang];
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Manual order states
  const [manualOrderOpen, setManualOrderOpen] = useState(false);
  const [manualTable, setManualTable] = useState('Table 1');
  const [manualCart, setManualCart] = useState<Record<string, number>>({});
  const [manualNotes, setManualNotes] = useState('');
  
  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active panel tab selection (Requirement 15)
  const [activePanel, setActivePanel] = useState<'orders' | 'analytics'>('orders');

  const simulateMockSales = () => {
    const mockOrders: Order[] = [];
    const tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];
    
    for (let i = 0; i < 8; i++) {
      const orderId = `ord_mock_${Math.random().toString(36).substr(2, 9)}`;
      const shortId = Math.random().toString(36).substr(2, 4).toUpperCase();
      const tableNumber = tables[Math.floor(Math.random() * tables.length)];
      
      const itemsCount = 1 + Math.floor(Math.random() * 3);
      const selectedItems: OrderItem[] = [];
      const usedItemIds = new Set<string>();
      
      for (let j = 0; j < itemsCount; j++) {
        const item = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
        if (usedItemIds.has(item.id)) continue;
        usedItemIds.add(item.id);
        
        const qty = 1 + Math.floor(Math.random() * 2);
        selectedItems.push({
          id: `${orderId}_item_${j}`,
          menuItemId: item.id,
          name: item.name,
          price: state.menuModifiers?.[item.id]?.price ?? item.price,
          quantity: qty,
          department: item.department,
          status: 'served',
        });
      }
      
      const paymentMethods = ['vietqr', 'card_terminal', 'cash'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      const orderTime = new Date(Date.now() - (15 * 60000 + Math.random() * 180 * 60000));
      
      const newOrder: Order = {
        id: orderId,
        shortId,
        tableNumber,
        items: selectedItems,
        createdAt: orderTime.toISOString(),
        notes: i % 3 === 0 ? 'Extra hot' : undefined,
        billRequested: true,
        billPaid: true,
        paymentMethod: paymentMethod as any,
      };
      mockOrders.push(newOrder);
    }
    
    store.updateState({
      orders: [...mockOrders, ...state.orders]
    });
    
    showToast(lang === 'ru' ? 'Сгенерировано 8 оплаченных заказов!' : 'Simulated 8 paid order sales!');
  };

  const activeOrders = state.orders.filter((o) => {
    const status = getOrderStatus(o);
    return status !== 'completed' && status !== 'cancelled';
  });
  
  const completedOrders = state.orders.filter((o) => {
    const status = getOrderStatus(o);
    return status === 'completed' || status === 'cancelled';
  });

  const selectedOrder = state.orders.find((o) => o.id === selectedOrderId) || activeOrders[0] || completedOrders[0];

  // Compile active service alerts from orders
  const serviceAlerts: { orderId: string; tableNumber: string; type: 'waiter' | 'bill'; active: boolean }[] = [];
  state.orders.forEach((order) => {
    const status = getOrderStatus(order);
    if (status !== 'completed' && status !== 'cancelled') {
      if (order.waiterRequested) {
        serviceAlerts.push({ orderId: order.id, tableNumber: order.tableNumber, type: 'waiter', active: true });
      }
      if (order.billRequested) {
        serviceAlerts.push({ orderId: order.id, tableNumber: order.tableNumber, type: 'bill', active: true });
      }
    }
  });

  const handleResolveAlert = (orderId: string, type: 'waiter' | 'bill') => {
    if (type === 'waiter') {
      store.requestWaiter(orderId, false);
    } else {
      store.requestBill(orderId, false);
    }
    showToast(lang === 'ru' ? 'Запрос решен!' : 'Request resolved!');
  };

  const handlePayAndClose = (orderId: string) => {
    store.payBill(orderId);
    store.requestWaiter(orderId, false);
    store.requestBill(orderId, false);
    showToast(lang === 'ru' ? 'Заказ успешно оплачен и закрыт!' : 'Order paid and successfully closed!');
  };

  const handlePayBill = (orderId: string) => {
    store.payBill(orderId);
    store.requestWaiter(orderId, false);
    store.requestBill(orderId, false);
    showToast(lang === 'ru' ? 'Счет оплачен!' : 'Bill marked as paid!');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(lang === 'ru' ? 'Удалить эту запись заказа из базы данных?' : 'Delete this order record permanently?')) {
      store.deleteOrder(orderId);
      if (selectedOrderId === orderId) {
        setSelectedOrderId(null);
      }
      showToast(lang === 'ru' ? 'Заказ удален!' : 'Order deleted!');
    }
  };

  const handleClearAll = () => {
    if (confirm(lang === 'ru' ? 'Вы уверены, что хотите очистить всю историю заказов?' : 'Are you sure you want to clear all order histories?')) {
      store.clearAllOrders();
      setSelectedOrderId(null);
      showToast(lang === 'ru' ? 'История очищена!' : 'Session cleared!');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'accepted':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'preparing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'ready':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 animate-pulse';
      case 'completed':
      case 'served':
        return 'text-slate-500 bg-slate-50 border-slate-100';
      case 'cancelled':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Manual Order logic
  const handleAddManualItem = (itemId: string) => {
    const item = MENU_ITEMS.find(i => i.id === itemId)!;
    const modifier = state.menuModifiers?.[itemId];
    const maxStock = modifier?.stock ?? 30;
    const currentQty = manualCart[itemId] || 0;

    if (modifier?.disabled) {
      alert(lang === 'ru' ? 'Это блюдо отключено администратором!' : 'This item has been disabled by the administrator!');
      return;
    }

    if (currentQty >= maxStock) {
      alert(lang === 'ru' ? 'Недостаточно запасов блюда!' : 'Insufficient stock!');
      return;
    }

    setManualCart(prev => ({
      ...prev,
      [itemId]: currentQty + 1
    }));
  };

  const handleRemoveManualItem = (itemId: string) => {
    setManualCart(prev => {
      const copy = { ...prev };
      if (copy[itemId] > 1) {
        copy[itemId]--;
      } else {
        delete copy[itemId];
      }
      return copy;
    });
  };

  const handlePlaceManualOrder = () => {
    const cartItems = Object.entries(manualCart).map(([itemId, qty]) => {
      const item = MENU_ITEMS.find(i => i.id === itemId)!;
      return {
        menuItem: item,
        quantity: qty as number
      };
    });

    if (cartItems.length === 0) {
      alert(lang === 'ru' ? 'Выберите блюда для заказа!' : 'Please select dishes to order!');
      return;
    }

    store.createOrder(manualTable, cartItems, manualNotes);
    setManualCart({});
    setManualNotes('');
    setManualOrderOpen(false);
    showToast(lang === 'ru' ? 'Заказ оформлен!' : 'Manual order created!');
  };

  const getMenuItemPrice = (item: MenuItem) => {
    return state.menuModifiers?.[item.id]?.price ?? item.price;
  };

  const getMenuItemStock = (item: MenuItem) => {
    return state.menuModifiers?.[item.id]?.stock ?? 30;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-slate-950 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-fadeIn border border-slate-800">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* DASHBOARD HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
              🛎️
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {lang === 'ru' ? 'Панель Менеджера' : 'Manager Dashboard'}
              </h1>
              <p className="text-xs text-slate-500">
                {lang === 'ru' 
                  ? 'Контроль заказов, вызовы официанта, ручное создание заказов и быстрая смена статусов.' 
                  : 'Oversee floor transactions, manual entries, culinary progress, and client help requests.'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setManualOrderOpen(!manualOrderOpen)}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {lang === 'ru' ? 'Новый заказ вручную' : 'New Manual Order'}
            </button>
            <button
              id="clear-all-data-btn"
              onClick={handleClearAll}
              className="px-3.5 py-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-xs font-semibold text-slate-500 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t.clearSession}
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE MANUAL ORDER PLACEMENT PANEL */}
        {manualOrderOpen && (
          <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-md border-t-4 border-t-indigo-600 animate-slideDown">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {lang === 'ru' ? 'Оформление Заказа Вручную' : 'Create New Manual Order'}
                </h3>
              </div>
              <button 
                onClick={() => setManualOrderOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Table Selector and Catalog */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {lang === 'ru' ? 'Выберите Стол:' : 'Select Table:'}
                  </label>
                  <select
                    value={manualTable}
                    onChange={(e) => setManualTable(e.target.value)}
                    className="bg-slate-100 border border-slate-200 text-xs font-bold py-1.5 px-3 rounded-lg text-slate-700 outline-none"
                  >
                    {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'].map(tbl => (
                      <option key={tbl} value={tbl}>{tbl}</option>
                    ))}
                  </select>
                </div>

                {/* Mini Item grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'ru' ? 'Каталог Блюд' : 'Catalog Selector'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {MENU_ITEMS.map((item) => {
                      const qty = manualCart[item.id] || 0;
                      const stock = getMenuItemStock(item);
                      const isModDisabled = state.menuModifiers?.[item.id]?.disabled;
                      const isUnavailable = isModDisabled || stock <= 0;

                      return (
                        <div 
                          key={item.id} 
                          className={`p-2 border rounded-lg flex items-center justify-between text-xs transition-colors ${
                            isUnavailable 
                              ? 'bg-slate-50 border-slate-200 opacity-60' 
                              : 'bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-slate-900">{item.name[lang]}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              ${getMenuItemPrice(item).toFixed(2)} • Stock: {stock}
                            </p>
                          </div>
                          
                          {isUnavailable ? (
                            <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                              {isModDisabled ? 'Disabled' : 'No Stock'}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {qty > 0 && (
                                <>
                                  <button
                                    onClick={() => handleRemoveManualItem(item.id)}
                                    className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="font-bold text-slate-800 w-4 text-center">{qty}</span>
                                </>
                              )}
                              <button
                                onClick={() => handleAddManualItem(item.id)}
                                className="p-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded font-bold"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected manual Cart summary */}
              <div className="md:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">
                    {lang === 'ru' ? 'Итоговая корзина' : 'Order Basket Summary'}
                  </h4>
                  
                  {Object.keys(manualCart).length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center italic">
                      {lang === 'ru' ? 'Корзина пуста' : 'No items added yet.'}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {Object.entries(manualCart).map(([itemId, qty]) => {
                        const item = MENU_ITEMS.find(i => i.id === itemId)!;
                        return (
                          <div key={itemId} className="flex items-center justify-between text-xs border-b border-slate-100 pb-1">
                            <span className="font-medium text-slate-800 truncate max-w-[150px]">
                              {qty}x {item.name[lang]}
                            </span>
                            <span className="font-mono text-slate-500 font-bold">
                              ${(getMenuItemPrice(item) * (qty as number)).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {lang === 'ru' ? 'Инструкции / Примечания:' : 'Order Notes / Directives:'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Medium-rare, No ice"
                      value={manualNotes}
                      onChange={(e) => setManualNotes(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-250">
                  <button
                    onClick={handlePlaceManualOrder}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {lang === 'ru' ? 'Создать заказ' : 'Place Manual Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABS SELECTOR / CONTROLLER (Requirement 15) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1 flex-1 sm:flex-initial">
            <button
              onClick={() => setActivePanel('orders')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activePanel === 'orders'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {lang === 'ru' ? 'Активные заказы' : 'Live Order Workspace'}
              <span className="ml-1 px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-black rounded-md">
                {activeOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActivePanel('analytics')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activePanel === 'analytics'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              {lang === 'ru' ? 'Аналитика и Выручка' : 'Manager Dashboard'}
              <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md">
                ${state.orders.filter(o => o.billPaid).reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0), 0).toFixed(0)}
              </span>
            </button>
          </div>
          
          <div className="flex items-center justify-end gap-2 text-slate-500 text-xs font-medium pr-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'ru' ? 'Синхронизация активна' : 'Cloud Sync active'}</span>
          </div>
        </div>

        {activePanel === 'analytics' ? (
          (() => {
            const paidOrders = state.orders.filter(o => o.billPaid);
            const totalRevenue = paidOrders.reduce((sum, o) => {
              return sum + o.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
            }, 0);
            
            const activeOrdersCount = state.orders.filter(o => {
              const status = getOrderStatus(o);
              return status !== 'completed' && status !== 'cancelled';
            }).length;
            
            const aov = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
            
            // Calculate top performance dishes
            const dishSales: Record<string, { name: Record<Language, string>; qty: number; revenue: number; department: string }> = {};
            paidOrders.forEach(o => {
              o.items.forEach(item => {
                if (!dishSales[item.menuItemId]) {
                  const menuItem = MENU_ITEMS.find(m => m.id === item.menuItemId);
                  dishSales[item.menuItemId] = {
                    name: menuItem ? menuItem.name : { ru: item.name.ru || '', en: item.name.en || '', vi: item.name.vi || '' },
                    qty: 0,
                    revenue: 0,
                    department: item.department,
                  };
                }
                dishSales[item.menuItemId].qty += item.quantity;
                dishSales[item.menuItemId].revenue += item.price * item.quantity;
              });
            });
            
            const sortedDishes = Object.values(dishSales).sort((a, b) => b.qty - a.qty).slice(0, 5);
            const maxSalesQty = sortedDishes.length > 0 ? sortedDishes[0].qty : 1;
            
            // Calculate table revenue breakdown
            const tableSales: Record<string, { revenue: number; count: number }> = {};
            paidOrders.forEach(o => {
              const table = o.tableNumber || 'Table 1';
              if (!tableSales[table]) {
                tableSales[table] = { revenue: 0, count: 0 };
              }
              tableSales[table].revenue += o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              tableSales[table].count += 1;
            });
            
            // Calculate payment statistics
            const paymentStats = {
              vietqr: 0,
              card_terminal: 0,
              cash: 0,
            };
            paidOrders.forEach(o => {
              const method = o.paymentMethod || 'vietqr';
              const rev = o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              if (method === 'vietqr') paymentStats.vietqr += rev;
              else if (method === 'card_terminal') paymentStats.card_terminal += rev;
              else paymentStats.cash += rev;
            });
            
            const totalPaymentRev = (paymentStats.vietqr + paymentStats.card_terminal + paymentStats.cash) || 1;
            const vietqrPct = (paymentStats.vietqr / totalPaymentRev) * 100;
            const cardTerminalPct = (paymentStats.card_terminal / totalPaymentRev) * 100;
            const cashPct = (paymentStats.cash / totalPaymentRev) * 100;

            return (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs animate-fadeIn space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      {lang === 'ru' ? 'Аналитика Ресторана и Финансы' : 'Restaurant Performance & Revenue Analytics'}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {lang === 'ru' ? 'Реальное время • Статистика из локальной памяти' : 'Real-time state • Synthesized directly from localStorage'}
                    </p>
                  </div>
                  
                  <button
                    onClick={simulateMockSales}
                    className="self-start sm:self-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {lang === 'ru' ? 'Сгенерировать Продажи' : 'Simulate Sales Volume'}
                  </button>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-150 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'ru' ? 'Общая выручка' : 'Total Sales'}
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'ru' ? 'Средний чек' : 'Average Ticket'}
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono">${aov.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
                    <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'ru' ? 'Закрыто столов' : 'Tables Cleared'}
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono">{paidOrders.length}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
                    <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'ru' ? 'Активные столы' : 'Active Tables'}
                      </span>
                      <span className="text-lg font-black text-slate-900 font-mono">{activeOrdersCount}</span>
                    </div>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Popular Dishes Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      🔥 {lang === 'ru' ? 'Лидеры продаж (Топ 5 блюд)' : 'Top Performing Dishes (Sales Vol.)'}
                    </h3>
                    
                    {sortedDishes.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-8">
                        {lang === 'ru' ? 'Нет данных о продажах. Симулируйте продажи выше!' : 'No sales records yet. Click simulate sales volume above!'}
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {sortedDishes.map((dish, i) => {
                          const pct = (dish.qty / maxSalesQty) * 100;
                          return (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                  <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 font-bold">#{i + 1}</span>
                                  <span>{dish.name[lang]}</span>
                                  <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700">
                                    {dish.department}
                                  </span>
                                </div>
                                <span className="font-mono text-slate-500 font-extrabold">{dish.qty} pcs (${dish.revenue.toFixed(2)})</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Payment Methods Breakdown */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      📊 {lang === 'ru' ? 'Аналитика платежных каналов' : 'Preferred Payment Channels'}
                    </h3>

                    {paidOrders.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-8">
                        {lang === 'ru' ? 'Нет данных об оплате. Симулируйте продажи выше!' : 'No payment history yet. Click simulate sales volume above!'}
                      </p>
                    ) : (
                      <div className="space-y-5">
                        {/* VietQR stats */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-teal-800 flex items-center gap-1">📱 vietQR SBP</span>
                            <span className="font-mono text-slate-600 font-extrabold">${paymentStats.vietqr.toFixed(2)} ({vietqrPct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                              style={{ width: `${vietqrPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Card POS stats */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-indigo-800 flex items-center gap-1">💳 Card POS Terminal</span>
                            <span className="font-mono text-slate-600 font-extrabold">${paymentStats.card_terminal.toFixed(2)} ({cardTerminalPct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                              style={{ width: `${cardTerminalPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Cash stats */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-amber-800 flex items-center gap-1">💵 Cash / Наличные</span>
                            <span className="font-mono text-slate-600 font-extrabold">${paymentStats.cash.toFixed(2)} ({cashPct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                              style={{ width: `${cashPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Table Performance Row */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    🪑 {lang === 'ru' ? 'Обороты и нагрузка по столам' : 'Table Load Factor & Total Sales'}
                  </h3>

                  {Object.keys(tableSales).length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      {lang === 'ru' ? 'Нет данных о столах.' : 'No table data records.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
                      {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'].map((tableNum, idx) => {
                        const data = tableSales[tableNum] || { revenue: 0, count: 0 };
                        return (
                          <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center space-y-1">
                            <p className="text-xs font-extrabold text-slate-700">{tableNum}</p>
                            <p className="text-sm font-black text-slate-950 font-mono">${data.revenue.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">{data.count} {lang === 'ru' ? 'счетов' : 'tables'}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL: SERVICE ALERTS & ORDER LISTS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Live Service Alerts Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-amber-500" />
                {t.serviceRequests}
                {serviceAlerts.length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </h2>
              {serviceAlerts.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium py-2">{t.noAlerts}</p>
              ) : (
                <div className="space-y-3">
                  {serviceAlerts.map((alert, idx) => {
                    const alertOrder = state.orders.find(o => o.id === alert.orderId);
                    const isWaiter = alert.type === 'waiter';
                    return (
                      <div
                        id={`service-alert-card-${idx}`}
                        key={`${alert.orderId}_${alert.type}_${idx}`}
                        className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-sm flex flex-col gap-3 animate-fadeIn"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-amber-950 text-sm">{alert.tableNumber}</span>
                              {alertOrder && (
                                <span className="font-mono text-[9px] bg-amber-150 px-1.5 py-0.5 rounded text-amber-800">
                                  #{alertOrder.shortId}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-amber-800 font-bold uppercase mt-0.5 flex items-center gap-1">
                              {isWaiter ? '🛎️ ' + (lang === 'ru' ? 'ВЫЗОВ ОФИЦИАНТА' : 'WAITER NEEDED') : '💵 ' + (lang === 'ru' ? 'ЗАПРОС СЧЕТА' : 'BILL REQUESTED')}
                            </p>
                          </div>
                          
                          <button
                            id={`dismiss-alert-btn-${idx}`}
                            onClick={() => handleResolveAlert(alert.orderId, alert.type)}
                            className="text-amber-500 hover:text-amber-700 p-1 rounded-lg hover:bg-amber-100/50 transition-colors"
                            title={lang === 'ru' ? 'Закрыть уведомление' : 'Dismiss alert'}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Render payment details on BILL REQUEST */}
                        {!isWaiter && alertOrder && (
                          <div className="bg-white/80 p-2.5 border border-amber-100 rounded-lg space-y-1.5 text-xs text-slate-700 font-medium">
                            <div className="flex justify-between">
                              <span>{lang === 'ru' ? 'Итого к оплате:' : 'Total amount:'}</span>
                              <span className="font-bold text-slate-900 font-mono">${calculateOrderTotal(alertOrder).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>{lang === 'ru' ? 'Способ оплаты:' : 'Payment method:'}</span>
                              <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md text-[9px]">
                                {alertOrder.paymentMethod === 'vietqr' && (lang === 'ru' ? '📱 СБП / vietQR' : '📱 SBP / vietQR')}
                                {alertOrder.paymentMethod === 'card_terminal' && (lang === 'ru' ? '💳 Картой (терминал)' : '💳 POS Terminal')}
                                {alertOrder.paymentMethod === 'cash' && (lang === 'ru' ? '💵 Наличными' : '💵 Cash')}
                                {(alertOrder.paymentMethod === 'card' || !alertOrder.paymentMethod) && (lang === 'ru' ? '💳 Картой по QR' : '💳 Card via QR')}
                              </span>
                            </div>
                            {alertOrder.paymentMethod === 'cash' && alertOrder.changeRequestedFrom && (() => {
                              const total = calculateOrderTotal(alertOrder);
                              const parseDenomination = (val: string): number => {
                                const numericStr = val.replace(/[^0-9.]/g, '');
                                return parseFloat(numericStr) || 0;
                              };
                              const changeFromNum = parseDenomination(alertOrder.changeRequestedFrom);
                              const changeVal = changeFromNum > total ? changeFromNum - total : 0;
                              return (
                                <div className="border-t border-dashed border-amber-200/50 pt-1.5 space-y-0.5">
                                  <div className="flex justify-between items-center text-[10px] text-rose-800 font-bold">
                                    <span>{lang === 'ru' ? 'Сдача с купюры:' : 'Change from bill:'}</span>
                                    <span className="bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded font-mono text-[9px]">${changeFromNum.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] text-rose-950 font-black">
                                    <span>{lang === 'ru' ? 'СУММА СДАЧИ:' : 'CHANGE DUE:'}</span>
                                    <span className="bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-rose-700 animate-pulse">${changeVal.toFixed(2)}</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {isWaiter && alertOrder && (
                          <div className="bg-white/50 p-2 border border-amber-100 rounded-lg text-[11px] text-amber-900 font-medium leading-relaxed">
                            {lang === 'ru' ? 'Клиент ожидает обслуживания у стола.' : 'Client requests help at the table.'}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-1.5 w-full mt-1 border-t border-amber-200/50 pt-2 flex-wrap">
                          <button
                            id={`resolve-only-btn-${idx}`}
                            onClick={() => handleResolveAlert(alert.orderId, alert.type)}
                            className="flex-1 py-1 px-2 bg-white border border-amber-200 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md shadow-2xs transition-all"
                          >
                            {isWaiter 
                              ? (lang === 'ru' ? 'Подойти / Закрыть' : 'Serve / Resolve')
                              : (lang === 'ru' ? 'Сбросить запрос' : 'Reset request')}
                          </button>

                          {alertOrder && getOrderStatus(alertOrder) !== 'completed' && getOrderStatus(alertOrder) !== 'cancelled' && (
                            <button
                              id={`pay-close-btn-${idx}`}
                              onClick={() => handlePayAndClose(alert.orderId)}
                              className="flex-1.5 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-md shadow-xs transition-all flex items-center justify-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              {lang === 'ru' ? 'Оплатить и Закрыть' : 'Confirm Pay & Close'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Orders Feed */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.allOrders}</h2>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">
                  {state.orders.length} TOTAL
                </span>
              </div>

              {state.orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Clock className="h-10 w-10 stroke-1 mb-2 text-slate-300" />
                  <p className="text-xs font-medium">{t.noActiveOrder}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {/* ACTIVE GROUP */}
                  {activeOrders.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">{t.activeOrders}</span>
                      {activeOrders.map((order) => {
                        const isSelected = selectedOrder?.id === order.id;
                        const status = getOrderStatus(order);
                        return (
                          <div
                            id={`order-row-${order.id}`}
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50/50 border-indigo-200'
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">{order.tableNumber}</span>
                                <span className="font-mono text-xs text-slate-400">#{order.shortId}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {order.items.length} {t.itemsCount} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getStatusBadge(status)}`}>
                              {t[`status_${status}`]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* COMPLETED GROUP */}
                  {completedOrders.length > 0 && (
                    <div className="space-y-1 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {lang === 'ru' ? 'Архив / Отменено' : 'Completed / Cancelled'}
                      </span>
                      {completedOrders.map((order) => {
                        const isSelected = selectedOrder?.id === order.id;
                        const status = getOrderStatus(order);
                        return (
                          <div
                            id={`order-row-${order.id}`}
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer opacity-70 hover:opacity-100 transition-all ${
                              isSelected
                                ? 'bg-indigo-50/50 border-indigo-200'
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">{order.tableNumber}</span>
                                <span className="font-mono text-xs text-slate-400">#{order.shortId}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                ${calculateOrderTotal(order).toFixed(2)} • {status === 'cancelled' ? (lang === 'ru' ? 'ОТМЕНЕН' : 'CANCELLED') : 'PAID'}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getStatusBadge(status)}`}>
                              {t[`status_${status}`]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: SELECTED ORDER DETAIL VIEW */}
          <div className="lg:col-span-8">
            {selectedOrder ? (
              <div id="admin-detail-panel" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{selectedOrder.tableNumber} Order Details</h2>
                      <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 font-semibold">
                        #{selectedOrder.shortId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {t.timeLabel}: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Pay Bill quick action */}
                    {getOrderStatus(selectedOrder) !== 'completed' && getOrderStatus(selectedOrder) !== 'cancelled' && (
                      <button
                        id="pay-bill-action-btn"
                        onClick={() => handlePayBill(selectedOrder.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        {lang === 'ru' ? 'Закрыть и Оплатить' : 'Mark as Paid'}
                      </button>
                    )}
                    <button
                      id="delete-order-action-btn"
                      onClick={() => handleDeleteOrder(selectedOrder.id)}
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-colors"
                      title="Delete Order Record"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* PAYMENT SETTLEMENT SECTION */}
                {!selectedOrder.billPaid && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                      <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-amber-500" />
                        {lang === 'ru' ? 'Расчет и Оплата Заказа' : 'Payment & Settlement'}
                      </h3>
                      {selectedOrder.billRequested ? (
                        <span className="px-2 py-0.5 bg-amber-500/25 border border-amber-500/30 text-amber-900 text-[10px] font-black rounded-md animate-pulse">
                          {lang === 'ru' ? '🔔 СЧЕТ ЗАПРОШЕН' : '🔔 BILL REQUESTED'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700/80 font-bold">
                          {lang === 'ru' ? 'Ожидает оплаты' : 'Awaiting checkout'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {lang === 'ru' ? 'Выбранный способ:' : 'Selected Method:'}
                        </span>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          {selectedOrder.paymentMethod === 'vietqr' && (
                            <span className="inline-flex items-center gap-1 font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-lg text-xs">
                              📱 {lang === 'ru' ? 'СБП / vietQR' : 'SBP / vietQR'}
                            </span>
                          )}
                          {selectedOrder.paymentMethod === 'card_terminal' && (
                            <span className="inline-flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg text-xs">
                              💳 {lang === 'ru' ? 'Официант с терминалом' : 'Card POS Terminal'}
                            </span>
                          )}
                          {selectedOrder.paymentMethod === 'cash' && (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg text-xs">
                              💵 {lang === 'ru' ? 'Наличные' : 'Cash'}
                            </span>
                          )}
                          {(!selectedOrder.paymentMethod || selectedOrder.paymentMethod === 'card') && (
                            <span className="text-slate-400 italic text-xs font-semibold">
                              {lang === 'ru' ? 'Не выбран гостем' : 'Not selected by guest'}
                            </span>
                          )}
                        </div>

                        {selectedOrder.paymentMethod === 'cash' && selectedOrder.changeRequestedFrom && (() => {
                          const total = calculateOrderTotal(selectedOrder);
                          const parseDenomination = (val: string): number => {
                            const numericStr = val.replace(/[^0-9.]/g, '');
                            return parseFloat(numericStr) || 0;
                          };
                          const changeFromNum = parseDenomination(selectedOrder.changeRequestedFrom);
                          const changeVal = changeFromNum > total ? changeFromNum - total : 0;
                          return (
                            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-100 rounded-lg max-w-fit animate-fadeIn">
                              <p className="text-[11px] text-slate-700 font-bold">
                                {lang === 'ru' ? 'Расчет сдачи наличными:' : 'Cash Change Calculation:'}
                              </p>
                              <div className="flex gap-4 mt-1 font-mono text-[11px]">
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase font-bold block">{lang === 'ru' ? 'Купюра гостя' : 'Guest Bill'}</span>
                                  <span className="font-extrabold text-slate-800">${changeFromNum.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[9px] uppercase font-bold block">{lang === 'ru' ? 'Сумма заказа' : 'Order Total'}</span>
                                  <span className="font-extrabold text-slate-800">${total.toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="text-rose-500 text-[9px] uppercase font-black block animate-pulse">{lang === 'ru' ? 'СДАЧА' : 'CHANGE DUE'}</span>
                                  <span className="font-black text-rose-700 text-xs">${changeVal.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="flex flex-col justify-end gap-2">
                        {/* If guest hasn't requested or selected a method, manager can select it on their behalf! */}
                        {!selectedOrder.paymentMethod && (
                          <div className="flex gap-1.5 justify-start md:justify-end">
                            <button
                              onClick={() => store.requestBill(selectedOrder.id, true, 'vietqr')}
                              className="px-2 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              vietQR
                            </button>
                            <button
                              onClick={() => store.requestBill(selectedOrder.id, true, 'card_terminal')}
                              className="px-2 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              POS
                            </button>
                            <button
                              onClick={() => {
                                const changeVal = prompt(lang === 'ru' ? 'Сдача с какой купюры? (Опционально)' : 'Change from what bill? (Optional)');
                                store.requestBill(selectedOrder.id, true, 'cash', changeVal || undefined);
                              }}
                              className="px-2 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              {lang === 'ru' ? 'Наличные' : 'Cash'}
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            store.payBill(selectedOrder.id);
                            showToast(lang === 'ru' ? 'Оплата подтверждена! Заказ закрыт.' : 'Payment confirmed! Order archived.');
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                          {lang === 'ru' ? 'Подтвердить Оплату и Закрыть' : 'Confirm Payment & Close'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                 {/* ONE-CLICK ORDER ACTIONS (MANAGER OVERRIDES) */}
                 {getOrderStatus(selectedOrder) !== 'completed' && getOrderStatus(selectedOrder) !== 'cancelled' && (() => {
                   const hasPendingItems = selectedOrder.items.some(item => item.status === 'pending');
                   const hasPrepableItems = selectedOrder.items.some(item => ['pending', 'accepted'].includes(item.status));
                   const hasReadyableItems = selectedOrder.items.some(item => ['pending', 'accepted', 'preparing'].includes(item.status));
                   const hasServableItems = selectedOrder.items.some(item => !['served', 'cancelled'].includes(item.status));
                   const hasCancelableItems = selectedOrder.items.some(item => !['served', 'cancelled'].includes(item.status));

                   return (
                     <div className="bg-indigo-50/40 border border-indigo-100/80 rounded-xl p-4 animate-fadeIn">
                       <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                         <Sliders className="h-4 w-4" />
                         {lang === 'ru' ? 'Групповые операции (Одной кнопкой)' : 'One-Click Full Order Actions'}
                       </h3>
                       <div className="flex flex-wrap gap-2">
                         <button
                           onClick={() => {
                             store.updateOrderAllItemsStatus(selectedOrder.id, 'accepted');
                             showToast('Order Accepted!');
                           }}
                           disabled={!hasPendingItems}
                           className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                           <Check className="h-3.5 w-3.5" />
                           {lang === 'ru' ? 'Принять все' : 'Accept All'}
                         </button>

                         <button
                           onClick={() => {
                             store.updateOrderAllItemsStatus(selectedOrder.id, 'preparing');
                             showToast('Preparation Started!');
                           }}
                           disabled={!hasPrepableItems}
                           className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                           <Play className="h-3.5 w-3.5" />
                           {lang === 'ru' ? 'Начать готовку' : 'Start Preparing'}
                         </button>

                         <button
                           onClick={() => {
                             store.updateOrderAllItemsStatus(selectedOrder.id, 'ready');
                             showToast('All Items Ready!');
                           }}
                           disabled={!hasReadyableItems}
                           className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                           <CheckCircle2 className="h-3.5 w-3.5" />
                           {lang === 'ru' ? 'Все готово' : 'Ready All'}
                         </button>

                         <button
                           onClick={() => {
                             store.updateOrderAllItemsStatus(selectedOrder.id, 'served');
                             showToast(lang === 'ru' ? 'Все блюда поданы!' : 'All items served!');
                           }}
                           disabled={!hasServableItems}
                           className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                           <ShoppingBag className="h-3.5 w-3.5" />
                           {lang === 'ru' ? 'Подать все' : 'Serve All'}
                         </button>

                         <button
                           onClick={() => {
                             store.updateOrderAllItemsStatus(selectedOrder.id, 'cancelled');
                             showToast('Order Cancelled!');
                           }}
                           disabled={!hasCancelableItems}
                           className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                         >
                           <Ban className="h-3.5 w-3.5" />
                           {lang === 'ru' ? '❌ Отменить заказ' : '❌ Cancel Order'}
                         </button>
                       </div>
                     </div>
                   );
                 })()}

                {/* Grid layout of specifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Specifications</span>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {selectedOrder.notes ? `"${selectedOrder.notes}"` : 'No custom floor notes.'}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.orderTotal}</span>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      ${calculateOrderTotal(selectedOrder).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Items Queue and status modifiers */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Itemized Status</h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {selectedOrder.items.length === 0 ? (
                      <p className="text-sm text-slate-400 p-4 text-center italic">Service only ticket. No dishes selected.</p>
                    ) : (
                      selectedOrder.items.map((item) => (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950 text-sm">{item.quantity}x</span>
                              <span className="font-semibold text-slate-800 text-sm">{item.name[lang]}</span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                {item.department === 'kitchen' ? 'KITCHEN' : 'BAR'}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-amber-600 font-medium bg-amber-50/50 border border-amber-100 px-2 py-1 rounded-md max-w-fit">
                                Note: "{item.notes}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStatusBadge(item.status)}`}>
                              {t[`status_${item.status}`]}
                            </span>

                            {/* Waiter quick serve button */}
                            {!selectedOrder.billPaid && getOrderStatus(selectedOrder) !== 'completed' && getOrderStatus(selectedOrder) !== 'cancelled' && item.status !== 'served' && item.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  store.updateOrderItemStatus(selectedOrder.id, item.id, 'served');
                                  showToast(lang === 'ru' ? 'Блюдо подано!' : 'Item served!');
                                }}
                                className={`py-1 px-2.5 rounded-lg font-extrabold text-[11px] flex items-center gap-1 transition-all ${
                                  item.status === 'ready'
                                    ? 'bg-teal-600 hover:bg-teal-700 text-white border border-teal-500 shadow-md scale-105 active:scale-95'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                <Check className="h-3 w-3" />
                                {lang === 'ru' ? 'Подать' : 'Serve'}
                              </button>
                            )}

                            {/* Manual Override controls for Admin to directly adjust items */}
                            {!selectedOrder.billPaid && getOrderStatus(selectedOrder) !== 'completed' && getOrderStatus(selectedOrder) !== 'cancelled' && (
                              <select
                                value={item.status}
                                disabled={item.status === 'served' || item.status === 'cancelled'}
                                onChange={(e) => {
                                  store.updateOrderItemStatus(selectedOrder.id, item.id, e.target.value as ItemStatus);
                                }}
                                className="bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 text-[11px] font-bold py-1 px-2 rounded-lg text-slate-600 outline-none cursor-pointer"
                              >
                                <option value="pending" disabled={['accepted', 'preparing', 'ready', 'served', 'cancelled'].includes(item.status)}>Pending</option>
                                <option value="accepted" disabled={['preparing', 'ready', 'served', 'cancelled'].includes(item.status)}>Accepted</option>
                                <option value="preparing" disabled={['ready', 'served', 'cancelled'].includes(item.status)}>Preparing</option>
                                <option value="ready" disabled={['served', 'cancelled'].includes(item.status)}>Ready</option>
                                <option value="served" disabled={item.status === 'cancelled'}>Served</option>
                                <option value="cancelled" disabled={item.status === 'served'}>Cancelled</option>
                              </select>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Administrative shortcuts */}
                {!selectedOrder.billPaid && getOrderStatus(selectedOrder) !== 'completed' && getOrderStatus(selectedOrder) !== 'cancelled' && selectedOrder.items.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        store.advanceAllItemsForDepartment(selectedOrder.id, 'kitchen', 'ready');
                        showToast('Kitchen ready!');
                      }}
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-all shadow-xs"
                    >
                      🍳 {t.advanceKitchenStatus} → Ready
                    </button>
                    <button
                      onClick={() => {
                        store.advanceAllItemsForDepartment(selectedOrder.id, 'bar', 'ready');
                        showToast('Bar ready!');
                      }}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-all shadow-xs"
                    >
                      🍹 {t.advanceBarStatus} → Ready
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center text-center text-slate-400 min-h-[400px]">
                <Clock className="h-12 w-12 stroke-1 mb-3 text-slate-300" />
                <h3 className="font-bold text-slate-800 text-base">{t.noActiveOrder}</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Orders placed by guests or generated in Demo Mode will display administrative options here in real-time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
};
