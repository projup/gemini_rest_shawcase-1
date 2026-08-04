/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Save, RefreshCw, Eye, EyeOff, Plus, Minus, DollarSign, Package, Check, X } from 'lucide-react';
import { AppState, Language, MenuItem, MenuModifier } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MENU_ITEMS } from '../data/menu';
import { store } from '../state/Store';

interface AdminMenuViewProps {
  state: AppState;
  lang: Language;
}

export const AdminMenuView: React.FC<AdminMenuViewProps> = ({ state, lang }) => {
  const t = TRANSLATIONS[lang];
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getModifier = (itemId: string): MenuModifier => {
    return state.menuModifiers?.[itemId] || {
      price: MENU_ITEMS.find(i => i.id === itemId)?.price ?? 0,
      stock: 30,
      disabled: false
    };
  };

  const handleUpdatePrice = (itemId: string, newPrice: number) => {
    if (newPrice < 0) return;
    store.updateMenuModifier(itemId, { price: parseFloat(newPrice.toFixed(2)) });
    showToast('Price updated!');
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    if (newStock < 0) return;
    store.updateMenuModifier(itemId, { stock: Math.max(0, Math.floor(newStock)) });
    showToast('Inventory updated!');
  };

  const handleToggleDisabled = (itemId: string) => {
    const current = getModifier(itemId);
    store.updateMenuModifier(itemId, { disabled: !current.disabled });
    showToast(current.disabled ? 'Item enabled!' : 'Item disabled!');
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleRestoreDefaults = () => {
    if (confirm(lang === 'ru' ? 'Сбросить все настройки меню и запасов?' : 'Reset all pricing and stock modifications?')) {
      const resetModifiers: Record<string, MenuModifier> = {};
      MENU_ITEMS.forEach(item => {
        resetModifiers[item.id] = {
          price: item.price,
          stock: 30,
          disabled: false
        };
      });
      store.updateState({ menuModifiers: resetModifiers });
      showToast('Defaults restored!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
              🛠️
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {lang === 'ru' ? 'Панель Администратора (Меню)' : 'Admin Menu Panel'}
              </h1>
              <p className="text-xs text-slate-500">
                {lang === 'ru' 
                  ? 'Управление ценами, уровнем запасов и доступностью блюд.' 
                  : 'Adjust catalog prices, stock thresholds, and toggle temporary menu item lockouts.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {lang === 'ru' ? 'Сбросить настройки' : 'Restore Defaults'}
          </button>
        </div>

        {/* TOAST NOTIFICATION */}
        {successMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn border border-slate-800">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MENU ITEMS GRID */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {lang === 'ru' ? 'Каталог Блюд и Напитков' : 'Menu Catalog Management'}
            </h2>
            <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-full font-bold text-slate-500">
              {MENU_ITEMS.length} ITEMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MENU_ITEMS.map((item) => {
              const modifier = getModifier(item.id);
              const isActive = !modifier.disabled && modifier.stock > 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-xl flex gap-4 transition-all ${
                    modifier.disabled 
                      ? 'bg-slate-50/50 border-slate-200 opacity-75' 
                      : modifier.stock === 0 
                        ? 'bg-rose-50/30 border-rose-200' 
                        : 'bg-white border-slate-150 hover:border-slate-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      className={`w-full h-full object-cover ${!isActive ? 'grayscale opacity-50' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white px-1 py-0.5 bg-slate-900/80 rounded">
                          {modifier.disabled 
                            ? (lang === 'ru' ? 'Выкл' : 'Disabled') 
                            : (lang === 'ru' ? 'Нет запаса' : 'Out of stock')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info and modifiers */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-950 text-sm leading-tight">
                            {item.name[lang]}
                          </h3>
                          <span className="inline-block text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            {item.department === 'kitchen' ? 'Kitchen' : 'Bar'}
                          </span>
                        </div>

                        {/* Enable / Disable toggle button */}
                        <button
                          onClick={() => handleToggleDisabled(item.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            modifier.disabled
                              ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                          title={modifier.disabled ? 'Enable Item' : 'Disable Item (keep in menu but lock ordering)'}
                        >
                          {modifier.disabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Editor Inputs */}
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                      {/* Price input */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {lang === 'ru' ? 'Цена ($)' : 'Price ($)'}
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUpdatePrice(item.id, modifier.price - 1)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 active:scale-90"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            step="0.1"
                            value={modifier.price}
                            onChange={(e) => handleUpdatePrice(item.id, parseFloat(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-center font-mono border border-slate-200 rounded py-1 px-1 outline-none text-slate-800 bg-slate-50/50 focus:border-slate-450"
                          />
                          <button
                            onClick={() => handleUpdatePrice(item.id, modifier.price + 1)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 active:scale-90"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Stock input */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {lang === 'ru' ? 'Запасы' : 'Stock Level'}
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleUpdateStock(item.id, modifier.stock - 5)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 active:scale-90"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            value={modifier.stock}
                            onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
                            className={`w-full text-xs font-bold text-center font-mono border rounded py-1 px-1 outline-none bg-slate-50/50 ${
                              modifier.stock === 0 
                                ? 'border-rose-300 text-rose-600 font-extrabold bg-rose-50/50' 
                                : 'border-slate-200 text-slate-800 focus:border-slate-450'
                            }`}
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id, modifier.stock + 5)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 active:scale-90"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
