/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Plus, Minus, Send, CheckCircle, Bell, Receipt, RefreshCw, Star, Flame, Salad, X, QrCode, CreditCard, Coins } from 'lucide-react';
import { AppState, CartItem, Language, MenuItem, Order, OrderItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MENU_ITEMS } from '../data/menu';
import { store, getOrderStatus } from '../state/Store';

interface GuestViewProps {
  state: AppState;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const GuestView: React.FC<GuestViewProps> = ({ state, lang, onLanguageChange }) => {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<{ [itemId: string]: string }>({});
  const [activeTable, setActiveTable] = useState<string>('Table 5');
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [chosenMethod, setChosenMethod] = useState<'vietqr' | 'card_terminal' | 'cash'>('vietqr');
  const [needChange, setNeedChange] = useState<boolean>(false);
  const [changeAmount, setChangeAmount] = useState<string>('');

  // Load table from state if synced
  useEffect(() => {
    if (state.activeTable) {
      setActiveTable(state.activeTable);
    }
  }, [state.activeTable]);

  // Find active orders for the current table
  const activeOrdersForTable = state.orders.filter(
    (o) => o.tableNumber === activeTable && !o.billPaid
  );
  
  // Get the most recent active order
  const activeOrder = activeOrdersForTable[0];

  // Find all completed/paid orders for the current table (Requirement 19)
  const paidOrdersForTable = state.orders.filter(
    (o) => o.tableNumber === activeTable && o.billPaid
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const getMenuItemPrice = (item: MenuItem) => {
    return state.menuModifiers?.[item.id]?.price ?? item.price;
  };

  const isMenuItemDisabled = (item: MenuItem) => {
    const mod = state.menuModifiers?.[item.id];
    if (!mod) return false;
    return mod.disabled || mod.stock <= 0;
  };

  const getMenuItemStock = (item: MenuItem) => {
    return state.menuModifiers?.[item.id]?.stock ?? 30;
  };

  const handleAddToCart = (item: MenuItem) => {
    const maxStock = getMenuItemStock(item);
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        if (existing.quantity >= maxStock) {
          return prev;
        }
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1, notes: '' }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const item = MENU_ITEMS.find((i) => i.id === itemId);
    const maxStock = item ? getMenuItemStock(item) : 999;
    setCart((prev) => {
      return prev
        .map((cartItem) => {
          if (cartItem.menuItem.id === itemId) {
            const newQty = cartItem.quantity + delta;
            if (newQty > maxStock) return cartItem;
            return { ...cartItem, quantity: newQty };
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const handleUpdateNotes = (itemId: string, text: string) => {
    setNotes((prev) => ({ ...prev, [itemId]: text }));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Attach custom notes and the latest prices
    const cartWithNotes = cart.map((item) => ({
      ...item,
      notes: notes[item.menuItem.id] || undefined,
    }));

    store.createOrder(activeTable, cartWithNotes);
    setCart([]);
    setNotes({});
    setCartOpen(false);
  };

  const handleCallWaiter = () => {
    if (activeOrder) {
      store.requestWaiter(activeOrder.id, !activeOrder.waiterRequested);
    } else {
      // Create a blank order just for the service request if no order exists!
      const blankOrder = store.createOrder(activeTable, []);
      store.requestWaiter(blankOrder.id, true);
    }
  };

  const handleRequestBill = () => {
    if (activeOrder) {
      if (activeOrder.billRequested) {
        store.requestBill(activeOrder.id, false);
      } else {
        setChosenMethod('vietqr');
        setNeedChange(false);
        setChangeAmount('');
        setPaymentModalOpen(true);
      }
    }
  };

  const handleConfirmBillRequest = () => {
    if (activeOrder) {
      const changeStr = (chosenMethod === 'cash' && needChange) ? changeAmount : undefined;
      store.requestBill(activeOrder.id, true, chosenMethod, changeStr);
      setPaymentModalOpen(false);
    }
  };

  const filteredMenuItems = selectedCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const cartTotal = cart.reduce((acc, item) => acc + getMenuItemPrice(item.menuItem) * item.quantity, 0);

  // Helper to calculate item status styles
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'accepted':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'preparing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ready':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200 animate-pulse';
      case 'served':
        return 'text-gray-500 bg-gray-50 border-gray-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Dynamic progress calculation
  const getOrderProgress = (order: Order) => {
    if (!order.items.length) return 0;
    const weights = { pending: 0, accepted: 25, preparing: 60, ready: 90, served: 100 };
    const totalWeight = order.items.reduce((acc, item) => acc + weights[item.status], 0);
    return Math.round(totalWeight / order.items.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* GUEST HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg tracking-wider">
              G
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 text-sm tracking-tight">{t.appName}</h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {t.table} {activeTable}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Table Selector */}
            <select
              value={activeTable}
              onChange={(e) => {
                const val = e.target.value;
                setActiveTable(val);
                store.updateState({ activeTable: val });
              }}
              className="bg-slate-100 border-none text-xs font-semibold py-1.5 px-2.5 rounded-lg text-slate-700 outline-none cursor-pointer"
            >
              <option value="Table 1">Table 1</option>
              <option value="Table 2">Table 2</option>
              <option value="Table 3">Table 3</option>
              <option value="Table 4">Table 4</option>
              <option value="Table 5">Table 5</option>
            </select>

            {/* Language Selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['en', 'ru', 'vi'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLanguageChange(l)}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                    lang === l
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Shopping Bag Icon */}
            <button
              id="guest-cart-toggle"
              onClick={() => setCartOpen(true)}
              className="relative p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ACTIVE ORDER PROGRESS SCREEN */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white px-4 py-6 shadow-md border-b border-emerald-800">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-md">
                    LIVE
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    {t.orderIdLabel}: <span className="text-white font-mono">{activeOrder.shortId}</span>
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight mt-1 flex items-center gap-2">
                  {t.orderStatus}: {t[`status_${getOrderStatus(activeOrder)}`]}
                </h2>
              </div>

              {/* Service alerts trigger */}
              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <button
                  id="call-waiter-btn"
                  onClick={handleCallWaiter}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    activeOrder.waiterRequested
                      ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                  {activeOrder.waiterRequested ? t.waiterRequested : t.callWaiter}
                </button>
                <button
                  id="request-bill-btn"
                  onClick={handleRequestBill}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    activeOrder.billRequested
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <Receipt className="h-3.5 w-3.5" />
                  {activeOrder.billRequested ? t.billRequested : t.requestBill}
                </button>
              </div>
            </div>

            {/* Interactive Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Cooking Progress</span>
                <span className="font-bold text-white">{getOrderProgress(activeOrder)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getOrderProgress(activeOrder)}%` }}
                />
              </div>
            </div>

            {/* REAL-TIME SERVICE & PAYMENT FEEDBACK STATUS (Requirement 17) */}
            {(activeOrder.billRequested || activeOrder.waiterRequested) && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4.5 space-y-3.5 mt-2 animate-fadeIn">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <RefreshCw className="h-3 w-3 animate-spin text-emerald-400" />
                  {lang === 'ru' ? 'Статус обработки запроса' : 'Real-Time Request Status'}
                </h4>

                <div className="space-y-3 divide-y divide-white/5">
                  {activeOrder.waiterRequested && (
                    <div className="flex items-start gap-3 pt-0">
                      <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 animate-pulse">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          {lang === 'ru' ? '🛎️ Официант вызван к столу' : '🛎️ Waiter has been summoned'}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {lang === 'ru'
                            ? 'Наш сотрудник принял вызов и уже спешит к вам. Пожалуйста, ожидайте.'
                            : 'Our server received your ping and is coming to your table shortly. Hang tight!'}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeOrder.billRequested && (
                    <div className={`flex items-start gap-3 ${activeOrder.waiterRequested ? 'pt-3' : 'pt-0'}`}>
                      <div className="p-2 bg-teal-500/20 text-teal-300 rounded-lg border border-teal-500/30 animate-pulse">
                        {activeOrder.paymentMethod === 'vietqr' && <QrCode className="h-4 w-4" />}
                        {activeOrder.paymentMethod === 'card_terminal' && <CreditCard className="h-4 w-4" />}
                        {activeOrder.paymentMethod === 'cash' && <Coins className="h-4 w-4" />}
                        {!activeOrder.paymentMethod && <Receipt className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-white">
                            {lang === 'ru' ? '📱 Ожидаем подтверждения оплаты' : '📱 Awaiting Payment Confirmation'}
                          </p>
                          <span className="text-[9px] font-extrabold bg-teal-500/25 border border-teal-500/30 text-teal-200 px-1.5 py-0.5 rounded-md uppercase animate-pulse">
                            {activeOrder.paymentMethod === 'vietqr' && (lang === 'ru' ? 'СБП / vietQR' : 'SBP / vietQR')}
                            {activeOrder.paymentMethod === 'card_terminal' && (lang === 'ru' ? 'Терминал' : 'POS Terminal')}
                            {activeOrder.paymentMethod === 'cash' && (lang === 'ru' ? 'Наличные' : 'Cash')}
                            {(!activeOrder.paymentMethod || activeOrder.paymentMethod === 'card') && (lang === 'ru' ? 'Картой' : 'Card')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          {activeOrder.paymentMethod === 'vietqr' && (
                            lang === 'ru'
                              ? 'Пожалуйста, отсканируйте QR-код для перевода. Как только менеджер подтвердит получение, ваш счет закроется.'
                              : 'Scan the QR code and transfer the amount. The manager is waiting to confirm your deposit.'
                          )}
                          {activeOrder.paymentMethod === 'card_terminal' && (
                            lang === 'ru'
                              ? 'Запрос передан на терминал. Официант несет переносной банковский терминал к вашему столу.'
                              : 'POS card terminal requested. Our server is bringing the electronic terminal to your table.'
                          )}
                          {activeOrder.paymentMethod === 'cash' && (
                            lang === 'ru'
                              ? `Выбран расчет наличными. Официант несет расчетную книжку ${activeOrder.changeRequestedFrom ? `и сдачу с ${activeOrder.changeRequestedFrom}` : ''}.`
                              : `Cash payment selected. Waiter is coming to your table ${activeOrder.changeRequestedFrom ? `with change from ${activeOrder.changeRequestedFrom}` : ''}.`
                          )}
                          {(!activeOrder.paymentMethod || activeOrder.paymentMethod === 'card') && (
                            lang === 'ru'
                              ? 'Запрос счета отправлен. Официант скоро подойдет.'
                              : 'Checkout request sent. Waiter will be with you shortly.'
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXPRESS CHECKOUT CALLOUT (Requirement 13) */}
            {!activeOrder.billRequested && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-emerald-500/30 transition-all duration-300">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black tracking-wider text-emerald-400 uppercase bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {lang === 'ru' ? 'БЫСТРАЯ ОПЛАТА' : 'EXPRESS CHECKOUT'}
                    </span>
                    {getOrderStatus(activeOrder) === 'completed' && (
                      <span className="text-[9px] font-black tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/20 animate-pulse">
                        {lang === 'ru' ? 'ВСЕ ПОДАНО' : 'ALL SERVED'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'ru' 
                      ? 'Оплатите счет моментально через СБП/vietQR, картой или наличными.' 
                      : 'Settle your check instantly via instant QR transfer, card POS terminal, or cash.'}
                  </p>
                </div>
                <button
                  onClick={handleRequestBill}
                  className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs px-4 py-2 rounded-lg shrink-0 transition-all shadow-md flex items-center justify-center gap-1.5 group cursor-pointer border border-emerald-400"
                >
                  <Receipt className="h-4 w-4 text-slate-950 group-hover:rotate-6 transition-transform" />
                  {lang === 'ru' ? 'Оплатить заказ' : 'Pay Bill Now'}
                </button>
              </div>
            )}

            {/* Individual Item Statuses list */}
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mt-2">
              <div className="px-3.5 py-2.5 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs text-slate-300 font-medium">
                <span>{t.orderSummary}</span>
                <span className="font-mono text-[10px] opacity-75">{activeTable}</span>
              </div>
              <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto">
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-slate-100">
                          {item.name[lang]}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-amber-300 mt-0.5">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${getStatusColor(item.status)}`}>
                      {t[`status_${item.status}`]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES SELECTION */}
      <section className="bg-white border-b border-slate-200 py-3 overflow-x-auto scrollbar-none px-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          {[
            { id: 'all', label: t.categoryAll },
            { id: 'italian_coffee', label: t.categoryItalianCoffee },
            { id: 'vietnamese_coffee', label: t.categoryVietnameseCoffee },
            { id: 'matcha', label: t.categoryMatcha },
            { id: 'tea', label: t.categoryTea },
            { id: 'milk_tea', label: t.categoryMilkTea },
            { id: 'non_coffee', label: t.categoryNonCoffee },
            { id: 'smoothies', label: t.categorySmoothies },
            { id: 'ice_blended', label: t.categoryIceBlended },
            { id: 'toppings', label: t.categoryToppings },
          ].map((cat) => (
            <button
              id={`cat-tab-${cat.id}`}
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* DISHES LIST */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {/* TABLE ORDER HISTORY (Requirement 19) */}
        {paidOrdersForTable.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-emerald-600 animate-pulse" />
                {lang === 'ru' ? 'История заказов стола' : 'Table Order History'}
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-md font-extrabold">
                  {paidOrdersForTable.length} {lang === 'ru' ? 'оплачено' : 'paid'}
                </span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                {activeTable}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[180px] overflow-y-auto pr-1">
              {paidOrdersForTable.map((pastOrder) => {
                const total = pastOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return (
                  <div key={pastOrder.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-800 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">#{pastOrder.shortId}</span>
                        <span className="text-[10px] font-medium">• {new Date(pastOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="font-bold text-emerald-600 font-mono">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium pl-3 border-l-2 border-emerald-200">
                      {pastOrder.items.map((item, i) => (
                        <span key={item.id} className="inline-block mr-3">
                          {item.quantity}x {item.name[lang]}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 group"
            >
              {/* Image and Badges */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name[lang]}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    isMenuItemDisabled(item) ? 'grayscale opacity-60' : ''
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  {item.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                      <Star className="h-3 w-3 fill-white" />
                      {t.popular}
                    </span>
                  )}
                  {item.spicy && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white shadow-sm">
                      <Flame className="h-3 w-3 fill-white animate-bounce" />
                      {t.spicy}
                    </span>
                  )}
                  {item.vegan && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                      <Salad className="h-3 w-3 fill-white" />
                      {t.vegan}
                    </span>
                  )}
                  {isMenuItemDisabled(item) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-600 text-white shadow-sm uppercase tracking-wider">
                      {getMenuItemStock(item) <= 0 ? 'Out of stock' : 'Unavailable'}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-extrabold bg-slate-900/85 text-white backdrop-blur-xs font-mono">
                  ${getMenuItemPrice(item).toFixed(2)}
                </div>
              </div>

              {/* Text Information */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                    {item.name[lang]}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description[lang]}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.department === 'kitchen' ? t.kitchen : t.bar}
                    </span>
                    <span className={`text-[10px] font-semibold mt-0.5 ${getMenuItemStock(item) <= 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {getMenuItemStock(item) <= 0 ? (lang === 'ru' ? 'Нет в наличии' : 'Sold Out') : (lang === 'ru' ? 'В наличии' : 'Available')}
                    </span>
                  </div>
                  <button
                    id={`add-to-cart-${item.id}`}
                    onClick={() => !isMenuItemDisabled(item) && handleAddToCart(item)}
                    disabled={isMenuItemDisabled(item)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-all ${
                      isMenuItemDisabled(item)
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white hover:shadow-sm'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isMenuItemDisabled(item)
                      ? getMenuItemStock(item) <= 0
                        ? 'Out of Stock'
                        : 'Unavailable'
                      : t.addToCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CART OVERLAY / SLIDE IN DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slideLeft">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-base">
                  {t.cart} ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <ShoppingBag className="h-12 w-12 stroke-1 mb-3 text-slate-300" />
                  <p className="text-sm font-medium">{t.emptyCart}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.menuItem.id} className="pb-4 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.menuItem.name[lang]}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          ${(getMenuItemPrice(item.menuItem) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder={t.notesPlaceholder}
                      value={notes[item.menuItem.id] || ''}
                      onChange={(e) => handleUpdateNotes(item.menuItem.id, e.target.value)}
                      className="w-full mt-2 text-xs border border-slate-200/80 rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none text-slate-700 bg-slate-50/50"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-3">
                  <span>{t.orderTotal}</span>
                  <span className="font-bold text-slate-900 text-lg font-mono">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  id="submit-order-btn"
                  onClick={handlePlaceOrder}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all text-sm"
                >
                  <Send className="h-4 w-4" />
                  {t.placeOrder}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* PAYMENT MODAL */}
      {paymentModalOpen && activeOrder && (
        <div id="payment-modal" className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            id="payment-modal-backdrop"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setPaymentModalOpen(false)}
          />
          <div
            id="payment-modal-container"
            className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl z-10 flex flex-col p-5 border border-slate-200 animate-zoomIn"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 id="payment-modal-title" className="font-bold text-slate-900 text-sm">
                {lang === 'ru' ? 'Выбор способа оплаты' : 'Choose Payment Method'}
              </h3>
              <button
                id="close-payment-modal-btn"
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div id="payment-total-box" className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'ru' ? 'Сумма к оплате' : 'Total Bill Amount'}
                </span>
                <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">
                  ${activeOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </span>
              </div>

              {/* Selection Options */}
              <div className="flex flex-col gap-2">
                {/* VietQR option */}
                <button
                  id="pay-method-vietqr"
                  type="button"
                  onClick={() => setChosenMethod('vietqr')}
                  className={`p-2.5 border rounded-xl flex items-center gap-3 font-bold text-xs transition-all text-left ${
                    chosenMethod === 'vietqr'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${chosenMethod === 'vietqr' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{lang === 'ru' ? 'Оплата по QR (vietQR)' : 'Pay via QR (vietQR)'}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {lang === 'ru' ? 'Можно молча оплатить и уйти' : 'Pay silently and leave anytime'}
                    </p>
                  </div>
                </button>

                {/* Card Terminal option */}
                <button
                  id="pay-method-card-terminal"
                  type="button"
                  onClick={() => setChosenMethod('card_terminal')}
                  className={`p-2.5 border rounded-xl flex items-center gap-3 font-bold text-xs transition-all text-left ${
                    chosenMethod === 'card_terminal'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${chosenMethod === 'card_terminal' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{lang === 'ru' ? 'Официант с терминалом' : 'Card via Terminal'}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {lang === 'ru' ? 'Официант подойдет с терминалом' : 'Waiter will bring POS terminal'}
                    </p>
                  </div>
                </button>

                {/* Cash option */}
                <button
                  id="pay-method-cash"
                  type="button"
                  onClick={() => setChosenMethod('cash')}
                  className={`p-2.5 border rounded-xl flex items-center gap-3 font-bold text-xs transition-all text-left ${
                    chosenMethod === 'cash'
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${chosenMethod === 'cash' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{lang === 'ru' ? 'Наличные со сдачей' : 'Cash with Change'}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {lang === 'ru' ? 'Официант принесет сдачу' : 'Waiter will bring change'}
                    </p>
                  </div>
                </button>
              </div>

              {/* QR-Code scan info for vietqr payments */}
              {chosenMethod === 'vietqr' && (
                <div id="payment-qr-info" className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl flex flex-col items-center text-center">
                  <div className="h-28 w-28 bg-white rounded-lg border border-slate-200 p-1.5 flex items-center justify-center shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`payment_order_${activeOrder.id}`)}`}
                      alt="Payment QR"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-2 max-w-[220px] leading-relaxed">
                    {lang === 'ru'
                      ? 'Отсканируйте код для бесконтактной оплаты по vietQR. Официант увидит платеж и закроет ваш счет.'
                      : 'Scan the VietQR code to transfer. Once paid, the waiter will confirm and close the table.'}
                  </p>
                </div>
              )}

              {/* POS Terminal selection message */}
              {chosenMethod === 'card_terminal' && (
                <div id="payment-terminal-info" className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-blue-600 shrink-0 stroke-1.5 animate-pulse" />
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {lang === 'ru'
                      ? 'Выбран терминал. Официант скоро подойдет к вашему столу с переносным терминалом.'
                      : 'Card terminal selected. The waiter will come to your table with the POS device shortly.'}
                  </p>
                </div>
              )}

              {/* Change request info for cash payments */}
              {chosenMethod === 'cash' && (
                <div id="payment-change-info" className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="need-change-checkbox"
                      type="checkbox"
                      checked={needChange}
                      onChange={(e) => setNeedChange(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700 select-none">
                      {lang === 'ru' ? 'Нужна сдача?' : 'Do you need change?'}
                    </span>
                  </label>

                  {needChange && (
                    <div className="space-y-2 animate-slideDown">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'ru' ? 'Сдача с какой суммы?' : 'Change from what bill?'}
                      </span>
                      <div className="grid grid-cols-4 gap-1">
                        {['$10', '$20', '$50', '$100'].map((denom) => (
                          <button
                            id={`denom-btn-${denom}`}
                            key={denom}
                            type="button"
                            onClick={() => setChangeAmount(denom)}
                            className={`py-1.5 border rounded-lg text-xs font-mono font-bold transition-all ${
                              changeAmount === denom
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            {denom}
                          </button>
                        ))}
                      </div>
                      <input
                        id="custom-change-amount-input"
                        type="text"
                        placeholder={lang === 'ru' ? 'Другая сумма...' : 'Custom amount...'}
                        value={changeAmount}
                        onChange={(e) => setChangeAmount(e.target.value)}
                        className="w-full text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none text-slate-800 bg-white focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                id="submit-bill-confirmation-btn"
                onClick={handleConfirmBillRequest}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                {lang === 'ru' ? 'Запросить счет и оплатить' : 'Submit Bill & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
