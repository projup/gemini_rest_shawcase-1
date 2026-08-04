/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // ITALIAN COFFEE
  {
    id: 'espresso',
    name: {
      en: 'Espresso – Café Ý',
      ru: 'Эспрессо – Café Ý',
      vi: 'Espresso – Café Ý'
    },
    description: {
      en: 'Arabica, sugar (Hot / Cold)',
      ru: 'Арабика, сахар (Горячий / Холодный)',
      vi: 'Arabica, đường (Nóng / Lạnh)'
    },
    price: 30,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'double_espresso',
    name: {
      en: 'Double Espresso',
      ru: 'Двойной Эспрессо',
      vi: 'Double Espresso'
    },
    description: {
      en: 'Arabica, sugar (Hot / Cold)',
      ru: 'Арабика, сахар (Горячий / Холодный)',
      vi: 'Arabica, đường (Nóng / Lạnh)'
    },
    price: 40,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'capuchino',
    name: {
      en: 'Capuchino',
      ru: 'Капучино',
      vi: 'Capuchino'
    },
    description: {
      en: 'Arabica, fresh milk, sugar (Hot / Cold)',
      ru: 'Арабика, свежее молоко, сахар (Горячий / Холодный)',
      vi: 'Arabica, sữa tươi, đường (Nóng / Lạnh)'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'latte',
    name: {
      en: 'Latte',
      ru: 'Латте',
      vi: 'Latte'
    },
    description: {
      en: 'Arabica, fresh milk, sugar (Hot / Cold)',
      ru: 'Арабика, свежее молоко, сахар (Горячий / Холодный)',
      vi: 'Arabica, sữa tươi, đường (Nóng / Lạnh)'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1570968992193-d6ea04ddaca5?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'americano',
    name: {
      en: 'Americano',
      ru: 'Американо',
      vi: 'Americano'
    },
    description: {
      en: 'Arabica, water',
      ru: 'Арабика, вода',
      vi: 'Arabica, nước'
    },
    price: 30,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'egg_coffee',
    name: {
      en: 'Cà phê trứng – Egg Coffee',
      ru: 'Кофе с яйцом – Egg Coffee',
      vi: 'Cà phê trứng – Egg Coffee'
    },
    description: {
      en: 'Arabica, cream, egg yolks (Hot) ⭐',
      ru: 'Арабика, крем, яичные желтки (Горячий) ⭐',
      vi: 'Arabica, kem, lòng đỏ trứng (Nóng) ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'affogato',
    name: {
      en: 'Cà phê Kem – Affogato',
      ru: 'Кофе с мороженым – Affogato',
      vi: 'Cà phê Kem – Affogato'
    },
    description: {
      en: 'Arabica, vanilla ice-cream ⭐',
      ru: 'Арабика, ванильное мороженое ⭐',
      vi: 'Arabica, kem vani ⭐'
    },
    price: 55,
    category: 'desserts',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'oat_latte',
    name: {
      en: 'Oat-Milk Latte',
      ru: 'Латте на овсяном молоке',
      vi: 'Oat-Milk Latte'
    },
    description: {
      en: 'Arabica, oat milk (Hot / Cold)',
      ru: 'Арабика, овсяное молоко (Горячий / Холодный)',
      vi: 'Arabica, sữa yến mạch (Nóng / Lạnh)'
    },
    price: 50,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1570968992193-d6ea04ddaca5?auto=format&fit=crop&w=600&q=80',
    popular: false
  },

  // VIETNAMESE COFFEE
  {
    id: 'milk_coffee',
    name: {
      en: 'Cà phê Sữa – Milk Coffee',
      ru: 'Кофе с молоком – Milk Coffee',
      vi: 'Cà phê Sữa – Milk Coffee'
    },
    description: {
      en: 'Robusta, Condensed Milk (Hot / Cold)',
      ru: 'Робуста, сгущенное молоко (Горячий / Холодный)',
      vi: 'Robusta, sữa đặc (Nóng / Lạnh)'
    },
    price: 35,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'black_coffee',
    name: {
      en: 'Cà phê Đen – Black Coffee',
      ru: 'Черный кофе – Black Coffee',
      vi: 'Cà phê Đen – Black Coffee'
    },
    description: {
      en: 'Robusta, sugar (Hot / Cold)',
      ru: 'Робуста, сахар (Горячий / Холодный)',
      vi: 'Robusta, đường (Nóng / Lạnh)'
    },
    price: 25,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'bac_xiu',
    name: {
      en: 'Bạc xỉu – Vietnamese Latte',
      ru: 'Бак сыу – Вьетнамский Латте',
      vi: 'Bạc xỉu – Vietnamese Latte'
    },
    description: {
      en: 'Robusta, Fresh Milk, Condensed Milk, Coffee Jelly (Hot / Cold) ⭐',
      ru: 'Робуста, свежее молоко, сгущенка, кофейное желе (Горячий / Холодный) ⭐',
      vi: 'Robusta, sữa tươi, sữa đặc, thạch cà phê (Nóng / Lạnh) ⭐'
    },
    price: 35,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1570968992193-d6ea04ddaca5?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'bac_xiu_coconut',
    name: {
      en: 'Bạc xỉu dừa – Coco Viet Latte',
      ru: 'Бак сыу кокосовый – Coco Viet Latte',
      vi: 'Bạc xỉu dừa – Coco Viet Latte'
    },
    description: {
      en: 'Robusta, Coconut Milk, Fresh Milk, Condensed Milk',
      ru: 'Робуста, кокосовое молоко, свежее молоко, сгущенка',
      vi: 'Robusta, sữa dừa, sữa tươi, sữa đặc'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1570968992193-d6ea04ddaca5?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'bac_xiu_custard',
    name: {
      en: 'Bạc xỉu kem trứng nướng – Custard Viet Latte',
      ru: 'Бак сыу с заварным кремом – Custard Viet Latte',
      vi: 'Bạc xỉu kem trứng nướng – Custard Viet Latte'
    },
    description: {
      en: 'Robusta, Fresh Milk, Condensed Milk, Egg Cream ⭐',
      ru: 'Робуста, свежее молоко, сгущенка, яичный крем ⭐',
      vi: 'Robusta, sữa tươi, sữa đặc, kem trứng ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'salty_coffee',
    name: {
      en: 'Cà Phê Muối – Salty Coffee',
      ru: 'Соленый кофе – Salty Coffee',
      vi: 'Cà Phê Muối – Salty Coffee'
    },
    description: {
      en: 'Robusta, Condensed Milk, Salt-Cream ⭐',
      ru: 'Робуста, сгущенное молоко, соленый крем ⭐',
      vi: 'Robusta, sữa đặc, kem muối ⭐'
    },
    price: 35,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // MATCHA
  {
    id: 'matcha_latte',
    name: {
      en: 'Matcha Latte Fresh Milk / Oat milk',
      ru: 'Матча Латте на свежем / овсяном молоке',
      vi: 'Matcha Latte Sữa Tươi / Sữa yến mạch'
    },
    description: {
      en: 'Premium Japanese Matcha, Condensed Milk (Hot / Cold)',
      ru: 'Премиум японская Матча, сгущенное молоко (Горячий / Холодный)',
      vi: 'Matcha Nhật cao cấp, sữa đặc (Nóng / Lạnh)'
    },
    price: 55,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1515823664972-6d6689c0f3ca?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'matcha_oreo',
    name: {
      en: 'Matcha Oreo',
      ru: 'Матча Орео',
      vi: 'Matcha Oreo'
    },
    description: {
      en: 'Premium Japanese Matcha, Condensed Milk, Oreo',
      ru: 'Премиум японская Матча, сгущенное молоко, Oreo',
      vi: 'Matcha Nhật cao cấp, sữa đặc, Oreo'
    },
    price: 59,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1515823664972-6d6689c0f3ca?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'cococha',
    name: {
      en: 'Cococha – Matcha Nước Dừa',
      ru: 'Кокоча – Матча с кокосовой водой',
      vi: 'Cococha – Matcha Nước Dừa'
    },
    description: {
      en: 'Coconut, Premium Japanese Matcha ⭐',
      ru: 'Кокос, премиум японская Матча ⭐',
      vi: 'Dừa, Matcha Nhật cao cấp ⭐'
    },
    price: 60,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1515823664972-6d6689c0f3ca?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'matcha_blended',
    name: {
      en: 'Matcha Đá Xay',
      ru: 'Матча фраппе',
      vi: 'Matcha Đá Xay'
    },
    description: {
      en: 'Premium Japanese Matcha, Sugar, Condensed Milk, Fresh Milk',
      ru: 'Премиум японская Матча, сахар, сгущенное молоко, свежее молоко',
      vi: 'Matcha Nhật cao cấp, đường, sữa đặc, sữa tươi'
    },
    price: 60,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1515823664972-6d6689c0f3ca?auto=format&fit=crop&w=600&q=80',
    popular: false
  },

  // TEA
  {
    id: 'lotus_tea',
    name: {
      en: 'Trà Sen Milkfoam – Lotus Oolong tea Macchiato',
      ru: 'Чай с лотосом Milkfoam – Lotus Oolong tea Macchiato',
      vi: 'Trà Sen Milkfoam – Lotus Oolong tea Macchiato'
    },
    description: {
      en: 'Lotus seed, Lotus Oolong Tea, Sugar, Macchiato, Water Chestnut Jelly',
      ru: 'Семена лотоса, чай Улун с лотосом, сахар, Макиато, желе из водяного ореха',
      vi: 'Hạt sen, trà Oolong sen, đường, Macchiato, thạch củ năng'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'lemongrass_peach',
    name: {
      en: 'Trà Đào Cam Sả – Lemongrass peach tea',
      ru: 'Персиковый чай с лемонграссом – Lemongrass peach tea',
      vi: 'Trà Đào Cam Sả – Lemongrass peach tea'
    },
    description: {
      en: 'Peach tea, Peach, Lemon, Sugar, Lemongrass ⭐',
      ru: 'Персиковый чай, персик, лимон, сахар, лемонграсс ⭐',
      vi: 'Trà đào, đào, chanh, đường, sả ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'jasmine_apricot',
    name: {
      en: 'Trà Mơ Xí Muội – Jasmine Tea, Apricot, Dried Prune',
      ru: 'Жасминовый чай с абрикосом и черносливом – Jasmine Tea, Apricot, Dried Prune',
      vi: 'Trà Mơ Xí Muội – Jasmine Tea, Apricot, Dried Prune'
    },
    description: {
      en: 'Jasmine, Apricot, Dried Prune, Sugar, Lemon ⭐',
      ru: 'Жасмин, абрикос, чернослив, сахар, лимон ⭐',
      vi: 'Nhài, mơ, mận khô, đường, chanh ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'tamarind_tea',
    name: {
      en: 'Trà Me Muối Ớt',
      ru: 'Чай с тамариндом и солью-чили',
      vi: 'Trà Me Muối Ớt'
    },
    description: {
      en: 'Oolong tea, Tamarind, Tamarind Topping ⭐',
      ru: 'Улун чай, тамаринд, топпинг из тамаринда ⭐',
      vi: 'Trà Oolong, me, topping me ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'lychee_butterfly',
    name: {
      en: 'Trà Vải Hoa Đậu Biếc – Butter Pea Lychee Tea',
      ru: 'Чай с личи и цветами клитории – Butter Pea Lychee Tea',
      vi: 'Trà Vải Hoa Đậu Biếc – Butter Pea Lychee Tea'
    },
    description: {
      en: 'Jasmine, Butterfly Pea, Lychee, Sugar, Lemon ⭐',
      ru: 'Жасмин, цветы клитории, личи, сахар, лимон ⭐',
      vi: 'Nhài, đậu biếc, vải, đường, chanh ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'lychee_macchiato',
    name: {
      en: 'Trà Thạch Vải Kem Mặn',
      ru: 'Чай с личи и соленым кремом',
      vi: 'Trà Thạch Vải Kem Mặn'
    },
    description: {
      en: 'Jasmine, Lychee, Macchiato, Sugar, Lychee Jelly',
      ru: 'Жасмин, личи, Макиато, сахар, желе из личи',
      vi: 'Nhài, vải, Macchiato, đường, thạch vải'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'mulberry_oolong',
    name: {
      en: 'Trà Olong Dâu Tầm Hạt Đắc',
      ru: 'Улун с шелковицей и аренгой',
      vi: 'Trà Olong Dâu Tầm Hạt Đắc'
    },
    description: {
      en: 'Olong, Mulberry, Arenga, Pinnatia, Kumquat ⭐',
      ru: 'Улун, шелковица, аренга, пиннатия, кумкват ⭐',
      vi: 'Olong, dâu tằm, hạt đắc, quất ⭐'
    },
    price: 42,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'soursop_tea',
    name: {
      en: 'Trà Mãng Cầu',
      ru: 'Чай с сметанной яблоком',
      vi: 'Trà Mãng Cầu'
    },
    description: {
      en: 'Jasmine Tea, Soursop ⭐',
      ru: 'Жасминовый чай, сметанное яблоко ⭐',
      vi: 'Trà nhài, mãng cầu ⭐'
    },
    price: 40,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // MILK-TEA
  {
    id: 'custard_milktea',
    name: {
      en: 'Trà Sữa Kem Trứng Nướng',
      ru: 'Молочный чай с заварным кремом',
      vi: 'Trà Sữa Kem Trứng Nướng'
    },
    description: {
      en: 'Black Tea, Thai Red Tea, Black Pearl, Agar jelly ⭐',
      ru: 'Черный чай, тайский красный чай, черная тапиока, агаровое желе ⭐',
      vi: 'Trà đen, trà đỏ Thái, trân châu đen, thạch agar ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4268?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'green_rice_milktea',
    name: {
      en: 'Trà Nhài Sữa Cốm Non',
      ru: 'Жасминовый молочный чай с молодым рисом',
      vi: 'Trà Nhài Sữa Cốm Non'
    },
    description: {
      en: 'Jasmine Milktea, Green rice',
      ru: 'Жасминовый молочный чай, зеленый рис',
      vi: 'Trà sữa nhài, cốm non'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4268?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'chocolate_milktea',
    name: {
      en: 'Trà Sữa Socola Kem Flan',
      ru: 'Шоколадный молочный чай с кремом флан',
      vi: 'Trà Sữa Socola Kem Flan'
    },
    description: {
      en: 'Chocolate, Black Tea',
      ru: 'Шоколад, черный чай',
      vi: 'Socola, trà đen'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4268?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'jasmine_oolong_milktea',
    name: {
      en: 'Trà sữa Ô Long Nhài',
      ru: 'Молочный чай Улун Жасмин',
      vi: 'Trà sữa Ô Long Nhài'
    },
    description: {
      en: 'Jasmine Oolong, Oolong Pearl ⭐',
      ru: 'Жасминовый Улун, жемчуг Улун ⭐',
      vi: 'Ô Long nhài, trân châu Ô Long ⭐'
    },
    price: 40,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4268?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // NON-COFFEE
  {
    id: 'yogurt_tropical',
    name: {
      en: 'Sữa chua trái cây nhiệt đới',
      ru: 'Йогурт с тропическими фруктами',
      vi: 'Sữa chua trái cây nhiệt đới'
    },
    description: {
      en: 'Tropical Fruit, Yogurt',
      ru: 'Тропические фрукты, йогурт',
      vi: 'Trái cây nhiệt đới, sữa chua'
    },
    price: 45,
    category: 'desserts',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'coconut_sugarcane',
    name: {
      en: 'Mía dừa',
      ru: 'Сахарный тростник с кокосом',
      vi: 'Mía dừa'
    },
    description: {
      en: 'Coconut, Sugarcane',
      ru: 'Кокос, сахарный тростник',
      vi: 'Dừa, mía'
    },
    price: 40,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'sugarcane_kumquat',
    name: {
      en: 'Mía tắc sả',
      ru: 'Сахарный тростник с кумкватом и лемонграссом',
      vi: 'Mía tắc sả'
    },
    description: {
      en: 'Sugarcane, Lemongrass, Kumquat ⭐',
      ru: 'Сахарный тростник, лемонграсс, кумкват ⭐',
      vi: 'Mía, sả, tắc ⭐'
    },
    price: 40,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'hot_coconut_cocoa',
    name: {
      en: 'Cacao Dừa Nóng – Hot Coconut Cocoa',
      ru: 'Горячий кокосовый какао – Hot Coconut Cocoa',
      vi: 'Cacao Dừa Nóng – Hot Coconut Cocoa'
    },
    description: {
      en: 'Cocoa, Coconut, Condensed Milk, Fresh Milk',
      ru: 'Какао, кокос, сгущенное молоко, свежее молоко',
      vi: 'Ca cao, dừa, sữa đặc, sữa tươi'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'iced_chocolate_macchiato',
    name: {
      en: 'Iced Chocolate Macchiato',
      ru: 'Холодный шоколадный Макиато',
      vi: 'Iced Chocolate Macchiato'
    },
    description: {
      en: 'Chocolate, Robusta, Sugar, Condensed Milk, Fresh Milk ⭐',
      ru: 'Шоколад, робуста, сахар, сгущенное молоко, свежее молоко ⭐',
      vi: 'Socola, Robusta, đường, sữa đặc, sữa tươi ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // SMOOTHIES
  {
    id: 'mango_milkfoam',
    name: {
      en: 'Xoài Milkfoam',
      ru: 'Манго Milkfoam',
      vi: 'Xoài Milkfoam'
    },
    description: {
      en: 'Mango, Milkfoam, Sugar, Condensed Milk ⭐',
      ru: 'Манго, молочная пена, сахар, сгущенное молоко ⭐',
      vi: 'Xoài, milkfoam, đường, sữa đặc ⭐'
    },
    price: 49,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'banana_mango_passion',
    name: {
      en: 'Chuối – Xoài – Chanh dây',
      ru: 'Банан – Манго – Маракуйя',
      vi: 'Chuối – Xoài – Chanh dây'
    },
    description: {
      en: 'Banana, Mango, Passion Fruit, Sugar, Condensed Milk ⭐',
      ru: 'Банан, манго, маракуйя, сахар, сгущенное молоко ⭐',
      vi: 'Chuối, xoài, chanh dây, đường, sữa đặc ⭐'
    },
    price: 49,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'dragon_peach',
    name: {
      en: 'Thanh Long Đỏ – Đào',
      ru: 'Красный драконий фрукт – Персик',
      vi: 'Thanh Long Đỏ – Đào'
    },
    description: {
      en: 'Dragon Fruit, Peach, Sugar',
      ru: 'Драконий фрукт, персик, сахар',
      vi: 'Thanh long, đào, đường'
    },
    price: 49,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'mango_orange',
    name: {
      en: 'Xoài – Cam Vàng',
      ru: 'Манго – Желтый апельсин',
      vi: 'Xoài – Cam Vàng'
    },
    description: {
      en: 'Mango, Yellow Orange, Sugar, Condensed Milk',
      ru: 'Манго, желтый апельсин, сахар, сгущенное молоко',
      vi: 'Xoài, cam vàng, đường, sữa đặc'
    },
    price: 49,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    popular: false
  },

  // ICE BLENDED
  {
    id: 'lemon_prune_blended',
    name: {
      en: 'Chanh Đá Xay Xí Muội – Ice Blended Lemon & Dried Prune',
      ru: 'Лимонный фраппе с черносливом – Ice Blended Lemon & Dried Prune',
      vi: 'Chanh Đá Xay Xí Muội – Ice Blended Lemon & Dried Prune'
    },
    description: {
      en: 'Lemon, Dried Prune, Sugar',
      ru: 'Лимон, чернослив, сахар',
      vi: 'Chanh, mận khô, đường'
    },
    price: 40,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'coconut_coffee_blended',
    name: {
      en: 'Cà Phê Dừa – Coconut Coffee',
      ru: 'Кокосовый кофе – Coconut Coffee',
      vi: 'Cà Phê Dừa – Coconut Coffee'
    },
    description: {
      en: 'Robusta, Coconut, Condensed Milk ⭐',
      ru: 'Робуста, кокос, сгущенное молоко ⭐',
      vi: 'Robusta, dừa, sữa đặc ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'chocolate_blended',
    name: {
      en: 'Socola Đá Xay',
      ru: 'Шоколадный фраппе',
      vi: 'Socola Đá Xay'
    },
    description: {
      en: 'Chocolate, Sugar, Condensed Milk, Fresh Milk',
      ru: 'Шоколад, сахар, сгущенное молоко, свежее молоко',
      vi: 'Socola, đường, sữa đặc, sữa tươi'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    popular: false
  },
  {
    id: 'cheese_popcorn_coffee',
    name: {
      en: 'Cà Phê Phomai Bắp Rang',
      ru: 'Кофе с сырным порошком и попкорном',
      vi: 'Cà Phê Phomai Bắp Rang'
    },
    description: {
      en: 'Robusta, Cheese Powder, Condensed Milk, Fresh Milk, Popcorn ⭐',
      ru: 'Робуста, сырный порошок, сгущенное молоко, свежее молоко, попкорн ⭐',
      vi: 'Robusta, bột phô mai, sữa đặc, sữa tươi, bắp rang ⭐'
    },
    price: 45,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    popular: true
  }
];
