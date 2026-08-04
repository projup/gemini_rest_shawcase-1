/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ChefHat, ShieldAlert, User, GlassWater, ArrowLeft, RefreshCw, Layers, Sliders, Shield } from 'lucide-react';
import { store } from './state/Store';
import { AppState, Language, Role } from './types';
import { TRANSLATIONS } from './data/translations';
import { DemoPanel } from './components/DemoPanel';
import { RoleSwitcher } from './components/RoleSwitcher';
import { GuestView } from './components/GuestView';
import { AdminView } from './components/AdminView';
import { KitchenView } from './components/KitchenView';
import { BarView } from './components/BarView';
import { AdminMenuView } from './components/AdminMenuView';

export default function App() {
  const [state, setState] = useState<AppState>(store.getState());
  const [currentRole, setCurrentRole] = useState<Role>('guest');
  const [lang, setLang] = useState<Language>('en');
  const [lockedRole, setLockedRole] = useState<Role | null>(null);

  useEffect(() => {
    // Check if the role is locked via URL parameters for dedicated terminals (tabs)
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role') as Role;
    if (roleParam && ['guest', 'manager', 'kitchen', 'bar', 'admin'].includes(roleParam)) {
      setLockedRole(roleParam);
      setCurrentRole(roleParam);
    }

    const tableParam = params.get('table');
    if (tableParam) {
      store.updateState({ activeTable: tableParam });
    }

    // Subscribe to reactive state updates (covers BroadcastChannel from other tabs too!)
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    // Auto-update state's active table to sync guest table context if switched to guest
    if (newRole === 'guest') {
      store.updateState({ activeTable: 'Table 5' });
    }
  };

  const handleUnlockRole = () => {
    // Remove query parameter and unlock
    window.history.pushState({}, '', window.location.pathname);
    setLockedRole(null);
    setCurrentRole('guest');
  };

  const renderActiveView = () => {
    switch (currentRole) {
      case 'guest':
        return (
          <GuestView
            state={state}
            lang={lang}
            onLanguageChange={setLang}
          />
        );
      case 'manager':
        return <AdminView state={state} lang={lang} />;
      case 'admin':
        return <AdminMenuView state={state} lang={lang} />;
      case 'kitchen':
        return <KitchenView state={state} lang={lang} />;
      case 'bar':
        return <BarView state={state} lang={lang} />;
      default:
        return <GuestView state={state} lang={lang} onLanguageChange={setLang} />;
    }
  };

  const getRoleIconAndBadge = (role: Role) => {
    const iconSize = "h-4 w-4";
    switch (role) {
      case 'guest':
        return { icon: <User className={iconSize} />, bg: 'bg-emerald-600', label: TRANSLATIONS[lang].guest };
      case 'manager':
        return { icon: <Sliders className={iconSize} />, bg: 'bg-indigo-600', label: lang === 'ru' ? 'Менеджер' : 'Manager' };
      case 'kitchen':
        return { icon: <ChefHat className={iconSize} />, bg: 'bg-orange-600', label: TRANSLATIONS[lang].kitchen };
      case 'bar':
        return { icon: <GlassWater className={iconSize} />, bg: 'bg-blue-600', label: TRANSLATIONS[lang].bar };
      case 'admin':
        return { icon: <Shield className={iconSize} />, bg: 'bg-slate-900', label: lang === 'ru' ? 'Админ' : 'Admin' };
    }
  };

  const currentCfg = getRoleIconAndBadge(currentRole);

  // If a role is locked (dedicated tab), we do not render the global demo manager or switcher.
  // This is a dedicated terminal! But we provide a sleek, subtle exit banner so they can return to developer mode.
  if (lockedRole) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Subtle top banner indicating locked screen */}
        <div className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 py-1.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Dedicated Terminal: <strong className="text-white uppercase font-bold">{currentCfg.label}</strong>
          </div>
          <button
            onClick={handleUnlockRole}
            className="hover:text-white font-bold transition-colors inline-flex items-center gap-1 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-md"
          >
            <ArrowLeft className="h-3 w-3" />
            Exit Terminal Mode
          </button>
        </div>
        {/* Render only the screen */}
        <div className="flex-1">
          {renderActiveView()}
        </div>
      </div>
    );
  }

  // Normal mode: full-featured interactive Demo and local role navigation frame
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* GLOBAL BANNER HEADER */}
      <header className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5.5 w-5.5 text-gray-900" />
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
              {TRANSLATIONS[lang].appName}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {TRANSLATIONS[lang].tagline} — Commercial Pilot MVP
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Indicators */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Tabs Connected
          </div>
        </div>
      </header>

      {/* AUTOPILOT DEMO PANEL */}
      <DemoPanel state={state} lang={lang} />

      {/* MULTI-ROLE SWITCHER DOCK */}
      <RoleSwitcher
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        state={state}
        lang={lang}
      />

      {/* ROLE SCREEN WORKSPACE */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-[500px] animate-fadeIn">
        {/* Small Active View Header */}
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md text-white ${currentCfg.bg}`}>
              {currentCfg.icon}
            </div>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              {currentCfg.label} Workspace
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
            <RefreshCw className="h-3 w-3 animate-spin text-gray-300" />
            Synced
          </div>
        </div>

        {/* View Component container */}
        <div className="flex-1 flex flex-col">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}
