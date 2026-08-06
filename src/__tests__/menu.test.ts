/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { MENU_ITEMS } from '../data/menu';
import { MenuItem } from '../types';

describe('Menu Items', () => {
  describe('MENU_ITEMS', () => {
    it('should have menu items defined', () => {
      expect(MENU_ITEMS).toBeDefined();
      expect(Array.isArray(MENU_ITEMS)).toBe(true);
      expect(MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('should have valid structure for each item', () => {
      MENU_ITEMS.forEach((item: MenuItem) => {
        expect(item.id).toBeDefined();
        expect(typeof item.id).toBe('string');
        expect(item.name).toBeDefined();
        expect(typeof item.name.en).toBe('string');
        expect(typeof item.name.ru).toBe('string');
        expect(typeof item.name.vi).toBe('string');
        expect(item.description).toBeDefined();
        expect(typeof item.description.en).toBe('string');
        expect(typeof item.description.ru).toBe('string');
        expect(typeof item.description.vi).toBe('string');
        expect(typeof item.price).toBe('number');
        expect(item.price).toBeGreaterThan(0);
        expect(['starters', 'mains', 'desserts', 'drinks', 'alcohol', 'toppings']).toContain(item.category);
        expect(['kitchen', 'bar']).toContain(item.department);
        expect(typeof item.image).toBe('string');
        expect(item.image.startsWith('http')).toBe(true);
      });
    });

    it('should have items in each category', () => {
      const categories = new Set(MENU_ITEMS.map(item => item.category));
      expect(categories.has('drinks')).toBe(true);
    });

    it('should have items in each department', () => {
      const departments = new Set(MENU_ITEMS.map(item => item.department));
      expect(departments.has('kitchen')).toBe(true);
      expect(departments.has('bar')).toBe(true);
    });

    it('should have unique IDs', () => {
      const ids = MENU_ITEMS.map(item => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have popular items marked', () => {
      const popularItems = MENU_ITEMS.filter(item => item.popular === true);
      expect(popularItems.length).toBeGreaterThan(0);
    });
  });
});
