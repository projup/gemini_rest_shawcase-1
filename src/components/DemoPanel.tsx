/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Square, Loader2, Sparkles } from 'lucide-react';
import { AppState, Language } from '../types';
import { store } from '../state/Store';
import { TRANSLATIONS } from '../data/translations';

interface DemoPanelProps {
  state: AppState;
  lang: Language;
}

export const DemoPanel: React.FC<DemoPanelProps> = ({ state, lang }) => {
  const t = TRANSLATIONS[lang];
  const { demoActive, demoStep } = state;

  const handleStartDemo = () => {
    store.startDemo();
  };

  const handleStopDemo = () => {
    store.stopDemo();
  };

  const getStepText = () => {
    switch (demoStep) {
      case 1:
        return t.demoStep1;
      case 2:
        return t.demoStep2;
      case 3:
        return t.demoStep3;
      case 4:
        return t.demoStep4;
      case 5:
        return t.demoStep5;
      case 6:
        return t.demoStep6;
      case 7:
        return t.demoStep7;
      default:
        return t.demoRunning;
    }
  };

  return (
    <div id="demo-panel" className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg flex-shrink-0 ${demoActive ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-gray-50 text-gray-500'}`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {demoActive ? t.demoMode : t.manualMode}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${demoActive ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                {demoActive ? 'AUTO' : 'MANUAL'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {demoActive ? t.demoRunning : 'Interact manually with Guest, Admin, Kitchen, and Bar screens below.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!demoActive ? (
            <button
              id="start-demo-btn"
              onClick={handleStartDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Play className="h-4 w-4" />
              {t.startDemo}
            </button>
          ) : (
            <button
              id="stop-demo-btn"
              onClick={handleStopDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Square className="h-4 w-4 fill-white" />
              {t.stopDemo}
            </button>
          )}
        </div>
      </div>

      {demoActive && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2.5 animate-fadeIn">
          <Loader2 className="h-4 w-4 text-amber-600 animate-spin flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium text-amber-800">
            {getStepText()}
          </span>
        </div>
      )}
    </div>
  );
};
