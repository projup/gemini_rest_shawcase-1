/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, ShieldAlert, ChefHat, GlassWater, ExternalLink, QrCode, Copy, Check, X, Sliders, Shield } from 'lucide-react';
import { AppState, Language, Role } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RoleSwitcherProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  state: AppState;
  lang: Language;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onChangeRole,
  state,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [activeQrTab, setActiveQrTab] = useState<'tables' | 'roles'>('tables');

  // Active Manager orders count
  const activeOrdersCount = state.orders.filter((order) => {
    const statuses = order.items.map((item) => item.status);
    return statuses.some((s) => s !== 'served' && s !== 'cancelled');
  }).length;

  // Active Kitchen items count
  const activeKitchenCount = state.orders.reduce((acc, order) => {
    return (
      acc +
      order.items.filter(
        (item) =>
          item.department === 'kitchen' &&
          ['pending', 'accepted', 'preparing'].includes(item.status)
      ).length
    );
  }, 0);

  // Active Bar items count
  const activeBarCount = state.orders.reduce((acc, order) => {
    return (
      acc +
      order.items.filter(
        (item) =>
          item.department === 'bar' &&
          ['pending', 'accepted', 'preparing'].includes(item.status)
      ).length
    );
  }, 0);

  const rolesConfig: { id: Role; label: string; icon: React.ReactNode; badge?: number; color: string; description: string }[] = [
    {
      id: 'guest',
      label: t.guest,
      icon: <User className="h-4 w-4" />,
      color: 'bg-emerald-500',
      description: lang === 'ru' ? 'Заказ у столика' : 'Table Ordering',
    },
    {
      id: 'manager',
      label: lang === 'ru' ? 'Менеджер' : 'Manager',
      icon: <Sliders className="h-4 w-4" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      color: 'bg-indigo-500',
      description: lang === 'ru' ? 'Управление залом' : 'Floor Operations',
    },
    {
      id: 'kitchen',
      label: t.kitchen,
      icon: <ChefHat className="h-4 w-4" />,
      badge: activeKitchenCount > 0 ? activeKitchenCount : undefined,
      color: 'bg-orange-500',
      description: lang === 'ru' ? 'Экран поваров' : 'Chef Monitor',
    },
    {
      id: 'bar',
      label: t.bar,
      icon: <GlassWater className="h-4 w-4" />,
      badge: activeBarCount > 0 ? activeBarCount : undefined,
      color: 'bg-blue-500',
      description: lang === 'ru' ? 'Экран бармена' : 'Beverage Queues',
    },
    {
      id: 'admin',
      label: lang === 'ru' ? 'Админ (Меню)' : 'Admin (Menu)',
      icon: <Shield className="h-4 w-4" />,
      color: 'bg-slate-900',
      description: lang === 'ru' ? 'Настройка блюд/запасов' : 'Catalog Controls',
    },
  ];

  const getRoleUrl = (roleId: Role, table?: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    let query = `?role=${roleId}`;
    if (roleId === 'guest' && table) {
      query += `&table=${encodeURIComponent(table)}`;
    }
    return `${origin}${path}${query}`;
  };

  const handleLaunchTab = (roleId: Role, table?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = getRoleUrl(roleId, table);
    window.open(url, '_blank');
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const tablesList = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'ru' ? 'Переключатель Терминалов' : 'Role Terminals'}
          </span>
          <button
            onClick={() => setQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] rounded-lg shadow-sm transition-all"
          >
            <QrCode className="h-3.5 w-3.5" />
            {lang === 'ru' ? 'Показать QR-коды для столов' : 'Get QR Sheets'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {rolesConfig.map((role) => {
            const isActive = currentRole === role.id;
            return (
              <div
                id={`role-btn-${role.id}`}
                key={role.id}
                onClick={() => onChangeRole(role.id)}
                className={`relative flex flex-col justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none ${
                  isActive
                    ? 'border-slate-900 bg-slate-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <div className={`p-1.5 rounded-md text-white ${isActive ? role.color : 'bg-slate-400'}`}>
                      {role.icon}
                    </div>
                    {role.badge !== undefined && (
                      <span className={`h-4.5 min-w-[18px] px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse ${role.color}`}>
                        {role.badge}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xs font-bold mt-2 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {role.label}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    {role.description}
                  </p>
                </div>

                <div className="flex justify-end mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => handleLaunchTab(role.id, undefined, e)}
                    title={t.launchNewTab}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR MODAL DIALOG */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setQrModalOpen(false)} />

          {/* Dialog Card */}
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-zoomIn border border-slate-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    {lang === 'ru' ? 'QR-коды для Меню и Персонала' : 'Scan & Place Orders (QR sheets)'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {lang === 'ru' ? 'Покажите или распечатайте эти QR-коды для мгновенного доступа к системе' : 'Display or print these dynamic codes to access real-time synchronized nodes.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-slate-100 px-5 py-2 bg-slate-50/50 gap-2">
              <button
                onClick={() => setActiveQrTab('tables')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeQrTab === 'tables' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-200/50 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ru' ? 'QR-коды для Столов (Гости)' : 'Table Guest QR Codes'}
              </button>
              <button
                onClick={() => setActiveQrTab('roles')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeQrTab === 'roles' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-200/50 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ru' ? 'QR-коды для Персонала (Роли)' : 'Service Dashboard QR Codes'}
              </button>
            </div>

            {/* CONTENT SCROLLABLE AREA */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeQrTab === 'tables' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tablesList.map((table) => {
                    const url = getRoleUrl('guest', table);
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                    const isCopied = copiedUrl === url;

                    return (
                      <div key={table} className="border border-slate-150 rounded-xl p-4 flex flex-col items-center text-center bg-slate-50/50 hover:bg-white transition-colors group">
                        <span className="text-sm font-extrabold text-slate-900 mb-1">{table}</span>
                        <p className="text-[9px] text-slate-400 mb-3">{lang === 'ru' ? 'QR-код для гостя стола' : 'Scan for table-specific menu'}</p>
                        
                        {/* QR Image Canvas */}
                        <div className="h-32 w-32 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner p-1">
                          <img src={qrUrl} alt={table} className="h-full w-full object-contain" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 mt-3 w-full">
                          <button
                            onClick={() => handleCopy(url)}
                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                              isCopied 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {isCopied ? 'Copied!' : 'Copy Link'}
                          </button>
                          <button
                            onClick={() => handleLaunchTab('guest', table)}
                            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                            title="Launch View"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {rolesConfig.map((role) => {
                    const url = getRoleUrl(role.id);
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                    const isCopied = copiedUrl === url;

                    return (
                      <div key={role.id} className="border border-slate-150 rounded-xl p-4 flex flex-col items-center text-center bg-slate-50/50 hover:bg-white transition-colors group">
                        <span className="text-xs font-extrabold text-slate-900 mb-1">{role.label}</span>
                        <p className="text-[9px] text-slate-400 mb-3">{role.description}</p>
                        
                        {/* QR Image Canvas */}
                        <div className="h-32 w-32 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner p-1">
                          <img src={qrUrl} alt={role.label} className="h-full w-full object-contain" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 mt-3 w-full">
                          <button
                            onClick={() => handleCopy(url)}
                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                              isCopied 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {isCopied ? 'Copied!' : 'Copy Link'}
                          </button>
                          <button
                            onClick={() => handleLaunchTab(role.id)}
                            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                            title="Launch View"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {lang === 'ru' ? 'Интеграция куаркодов активна' : 'QR code integration active'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
