/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ChefHat, Check, Play, Hourglass, Package, CheckSquare, BellRing } from 'lucide-react';
import { AppState, Language, Order, OrderItem, ItemStatus } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { store } from '../state/Store';

interface KitchenViewProps {
  state: AppState;
  lang: Language;
}

export const KitchenView: React.FC<KitchenViewProps> = ({ state, lang }) => {
  const t = TRANSLATIONS[lang];
  const [time, setTime] = useState<number>(Date.now());

  // Tick timer to update elapsed times in real-time
  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter orders that contain kitchen items that are active (not completely served)
  const activeKitchenTickets = state.orders
    .map((order) => {
      const kitchenItems = order.items.filter(
        (item) => item.department === 'kitchen' && item.status !== 'served' && item.status !== 'cancelled'
      );
      return {
        ...order,
        items: kitchenItems,
      };
    })
    .filter((order) => order.items.length > 0);

  const handleAdvanceStatus = (orderId: string, item: OrderItem) => {
    let nextStatus: ItemStatus = 'pending';
    switch (item.status) {
      case 'pending':
        nextStatus = 'accepted';
        break;
      case 'accepted':
        nextStatus = 'preparing';
        break;
      case 'preparing':
        nextStatus = 'ready';
        break;
      default:
        return;
    }
    store.updateOrderItemStatus(orderId, item.id, nextStatus);
  };

  const getStatusButtonText = (status: ItemStatus) => {
    switch (status) {
      case 'pending':
        return t.acceptItem;
      case 'accepted':
        return t.startPreparing;
      case 'preparing':
        return t.finishPreparing;
      default:
        return '';
    }
  };

  const getStatusIconAndStyle = (status: ItemStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Hourglass className="h-3.5 w-3.5" />,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
        };
      case 'accepted':
        return {
          icon: <CheckSquare className="h-3.5 w-3.5" />,
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
        };
      case 'preparing':
        return {
          icon: <Play className="h-3.5 w-3.5 animate-spin" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          btnColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
        };
      case 'ready':
        return {
          icon: <Check className="h-3.5 w-3.5" />,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse',
          btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
        };
      default:
        return {
          icon: <Check className="h-3.5 w-3.5" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          btnColor: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
    }
  };

  const getElapsedTime = (createdTime: string) => {
    const diffMs = Date.now() - new Date(createdTime).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    return `${diffMins}m ago`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              🍳
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {t.kitchenDashboard}
                <span className="text-xs font-semibold px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-md border border-orange-500/20">
                  {t.foodOnly}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Tactile kitchen display for chef-managed meal preparation cycles.</p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            {activeKitchenTickets.length} ACTIVE ORDERS
          </div>
        </div>

        {/* TICKETS CONTAINER GRID */}
        {activeKitchenTickets.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-16 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
            <ChefHat className="h-14 w-14 stroke-1 mb-4 text-slate-700" />
            <h3 className="font-bold text-slate-300 text-lg">{t.noTasks}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">When food orders are placed, they immediately load here as tactile culinary cards.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeKitchenTickets.map((ticket) => {
              const age = getElapsedTime(ticket.createdAt);
              const isOverdue = Date.now() - new Date(ticket.createdAt).getTime() > 600000; // 10 mins threshold
              
              return (
                <div
                  id={`kitchen-ticket-${ticket.id}`}
                  key={ticket.id}
                  className="bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative animate-fadeIn"
                >
                  {/* Overdue alert line */}
                  {isOverdue && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
                  )}

                  {/* Ticket Header */}
                  <div className="px-5 py-4 bg-slate-800 border-b border-slate-700/40 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-white tracking-tight">
                        {ticket.tableNumber}
                      </span>
                      <p className="font-mono text-xs text-slate-500 mt-0.5 font-semibold">
                        #{ticket.shortId}
                      </p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                      isOverdue ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-slate-700/50 text-slate-300 border-slate-600/30'
                    }`}>
                      {age}
                    </div>
                  </div>

                  {/* Ticket Items List */}
                  <div className="p-5 flex-1 space-y-4">
                    {ticket.items.map((item) => {
                      const cfg = getStatusIconAndStyle(item.status);
                      return (
                        <div key={item.id} className="pb-3.5 border-b border-slate-700/20 last:border-b-0 last:pb-0 flex flex-col justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="h-6 min-w-[24px] px-1.5 bg-orange-600/10 border border-orange-500/15 text-orange-400 font-extrabold text-sm rounded-md flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-sm">{item.name[lang]}</h4>
                              {item.notes && (
                                <p className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                                  ⚠️ "{item.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pl-9 mt-1">
                            {/* Current Item Status badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${cfg.color}`}>
                              {cfg.icon}
                              {t[`status_${item.status}`]}
                            </span>

                            {/* Touch status advancement button */}
                            {item.status !== 'ready' ? (
                              <button
                                id={`kitchen-advance-btn-${item.id}`}
                                onClick={() => handleAdvanceStatus(ticket.id, item)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer select-none transition-all ${cfg.btnColor}`}
                              >
                                {getStatusButtonText(item.status)}
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700/60 px-2 py-1 rounded-md animate-pulse">
                                {lang === 'ru' ? '🛎️ ОЖИДАЕТ ПОДАЧИ' : '🛎️ WAITING FOR WAITER'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer order footer */}
                  {ticket.notes && (
                    <div className="px-5 py-3 bg-slate-800/40 border-t border-slate-700/30 text-xs text-slate-400 italic">
                      " {ticket.notes} "
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
