/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../data/translations';

describe('Translations', () => {
  describe('TRANSLATIONS', () => {
    it('should have translations for all supported languages', () => {
      expect(TRANSLATIONS).toBeDefined();
      expect(TRANSLATIONS.en).toBeDefined();
      expect(TRANSLATIONS.ru).toBeDefined();
      expect(TRANSLATIONS.vi).toBeDefined();
    });

    it('should have required keys in English', () => {
      const en = TRANSLATIONS.en;
      expect(en.appName).toBeDefined();
      expect(en.guest).toBeDefined();
      expect(en.admin).toBeDefined();
      expect(en.kitchen).toBeDefined();
      expect(en.bar).toBeDefined();
      expect(en.demoMode).toBeDefined();
      expect(en.startDemo).toBeDefined();
      expect(en.stopDemo).toBeDefined();
    });

    it('should have required keys in Russian', () => {
      const ru = TRANSLATIONS.ru;
      expect(ru.appName).toBeDefined();
      expect(ru.guest).toBeDefined();
      expect(ru.admin).toBeDefined();
      expect(ru.kitchen).toBeDefined();
      expect(ru.bar).toBeDefined();
      expect(ru.demoMode).toBeDefined();
      expect(ru.startDemo).toBeDefined();
      expect(ru.stopDemo).toBeDefined();
    });

    it('should have required keys in Vietnamese', () => {
      const vi = TRANSLATIONS.vi;
      expect(vi.appName).toBeDefined();
      expect(vi.guest).toBeDefined();
      expect(vi.admin).toBeDefined();
      expect(vi.kitchen).toBeDefined();
      expect(vi.bar).toBeDefined();
      expect(vi.demoMode).toBeDefined();
      expect(vi.startDemo).toBeDefined();
      expect(vi.stopDemo).toBeDefined();
    });

    it('should have consistent keys across all languages', () => {
      const enKeys = Object.keys(TRANSLATIONS.en);
      const ruKeys = Object.keys(TRANSLATIONS.ru);
      const viKeys = Object.keys(TRANSLATIONS.vi);

      enKeys.forEach(key => {
        expect(ruKeys).toContain(key);
        expect(viKeys).toContain(key);
      });
    });

    it('should have status translations', () => {
      const statuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];
      statuses.forEach(status => {
        const key = `status_${status}` as keyof typeof TRANSLATIONS.en;
        expect(TRANSLATIONS.en[key]).toBeDefined();
        expect(TRANSLATIONS.ru[key]).toBeDefined();
        expect(TRANSLATIONS.vi[key]).toBeDefined();
      });
    });
  });
});
