/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // STARTERS (Kitchen)
  {
    id: 'starter_rolls',
    name: {
      en: 'Crispy Imperial Rolls',
      ru: 'Хрустящие Императорские Рулетики',
      vi: 'Chả Giò Hoàng Gia'
    },
    description: {
      en: 'Crispy fried rolls filled with wild mushrooms, glass noodles, fresh herbs, served with sweet chili dipping sauce.',
      ru: 'Хрустящие обжаренные рулетики с дикими грибами, стеклянной лапшой и свежей зеленью, подаются со сладким соусом чили.',
      vi: 'Chả giò chiên giòn rụm với nhân nấm rừng, miến, rau thơm, dùng kèm nước chấm chua ngọt.'
    },
    price: 8.5,
    category: 'starters',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    popular: true,
    vegan: true
  },
  {
    id: 'starter_tartare',
    name: {
      en: 'Zesty Tuna Tartare',
      ru: 'Тартар из Тунца с Цитрусом',
      vi: 'Tartare Cá Ngừ Sốt Chanh'
    },
    description: {
      en: 'Premium yellowfin tuna, fresh avocado mousse, citrus ponzu, black sesame, and crisp lotus root chips.',
      ru: 'Филе тунца премиум-класса, мусс из спелого авокадо, цитрусовый соус понзу, чёрный кунжут и чипсы из корня лотоса.',
      vi: 'Cá ngừ vây vàng cao cấp, sốt bơ mịn, ponzu cam chanh, mè đen và bánh phồng củ sen giòn.'
    },
    price: 14.0,
    category: 'starters',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    spicy: true
  },
  {
    id: 'starter_bruschetta',
    name: {
      en: 'Heritage Tomato Bruschetta',
      ru: 'Брускетта с Томатами Черри',
      vi: 'Bánh Mì Bruschetta Cà Chua'
    },
    description: {
      en: 'Toasted sourdough bread rubbed with garlic, topped with heirloom cherry tomatoes, fresh basil, and aged balsamic glaze.',
      ru: 'Поджаренный бездрожжевой хлеб с чесноком, фермерскими томатами черри, свежим базиликом и выдержанным бальзамическим соусом.',
      vi: 'Bánh mì nướng tỏi, phủ cà chua cherry hữu cơ, húng tây tươi và sốt balsamic hảo hạng.'
    },
    price: 7.5,
    category: 'starters',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
    vegan: true
  },

  // MAINS (Kitchen)
  {
    id: 'main_steak',
    name: {
      en: 'Prime Black Angus Ribeye',
      ru: 'Рибай Стейк Блэк Ангус',
      vi: 'Thịt Thăn Ngoại Bò Angus'
    },
    description: {
      en: '300g premium wood-fired steak served with roasted garlic baby potatoes, asparagus, and signature chimichurri sauce.',
      ru: '300-граммовый сочный рибай на гриле с запечённым чесночным мини-картофелем, спаржей и пикантным соусом чимичурри.',
      vi: '300g bò thăn ngoại nướng than hồng, kèm khoai tây bi đút lò, măng tây và sốt chimichurri đặc sản.'
    },
    price: 32.0,
    category: 'mains',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'main_salmon',
    name: {
      en: 'Pan-Seared Atlantic Salmon',
      ru: 'Филе Атлантического Лосося',
      vi: 'Cá Hồi Đại Tây Dương Áp Chảo'
    },
    description: {
      en: 'Crispy skin salmon over creamy saffron risotto, edamame beans, and a delicate lemon-herb butter broth.',
      ru: 'Лосось с хрустящей корочкой на подушке из шафранового ризотто с бобами эдамаме и нежным лимонно-травяным соусом.',
      vi: 'Cá hồi áp chảo giòn da dùng kèm cơm Ý saffron béo ngậy, đậu nành Nhật và sốt bơ chanh thảo mộc.'
    },
    price: 24.5,
    category: 'mains',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'main_risotto',
    name: {
      en: 'Truffle Wild Mushroom Risotto',
      ru: 'Ризотто с Трюфелем и Грибами',
      vi: 'Cơm Ý Risotto Nấm Truffle'
    },
    description: {
      en: 'Arborio rice slowly simmered with mixed wild forest mushrooms, finished with black truffle paste and grated parmigiano.',
      ru: 'Итальянский рис арборио, томлёный с лесными грибами, с добавлением пасты из чёрного трюфеля и пармезана.',
      vi: 'Cơm Ý Arborio ninh nhừ với nấm rừng tổng hợp, hòa quyện sốt nấm truffle đen và phô mai parmigiano bào.'
    },
    price: 19.0,
    category: 'mains',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80',
    vegan: false,
    popular: true
  },

  // DESSERTS (Kitchen)
  {
    id: 'dessert_lava',
    name: {
      en: 'Dark Chocolate Lava Cake',
      ru: 'Шоколадный Фондан',
      vi: 'Bánh Chocolate Lava Chảy'
    },
    description: {
      en: 'Warm Belgian chocolate cake with a molten center, served with Madagascan vanilla bean gelato.',
      ru: 'Тёплый шоколадный кекс с жидкой сердцевиной из бельгийского шоколада, подаётся с шариком ванильного джелато.',
      vi: 'Bánh chocolate Bỉ nướng ấm với nhân lỏng tan chảy, kèm một viên kem gelato vani Madagascar.'
    },
    price: 9.0,
    category: 'desserts',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dessert_tiramisu',
    name: {
      en: 'Uji Matcha Tiramisu',
      ru: 'Тирамису с Зелёным Чаем Матча',
      vi: 'Tiramisu Trà Xanh Uji Matcha'
    },
    description: {
      en: 'Light mascarpone cream layered with sponge fingers soaked in premium Japanese Uji matcha and dark rum.',
      ru: 'Лёгкий крем маскарпоне, слои нежного бисквита, пропитанные отборным японским чаем матча и тёмным ромом.',
      vi: 'Kem mascarpone bông nhẹ xen kẽ các lớp bánh sampa thấm đẫm trà xanh Uji Nhật Bản và rượu rum sẫm màu.'
    },
    price: 8.5,
    category: 'desserts',
    department: 'kitchen',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // NON-ALCOHOLIC DRINKS (Bar)
  {
    id: 'drink_lemonade',
    name: {
      en: 'Fresh Lime Mint Elixir',
      ru: 'Освежающий Лимонад Лайм-Мята',
      vi: 'Nước Chanh Đậu Biếc Bạc Hà'
    },
    description: {
      en: 'Cold pressed lime juice, fresh garden mint, organic cane syrup, sparkling mountain water, topped with butterfly pea flower tea.',
      ru: 'Свежевыжатый сок лайма, мята из нашего сада, тростниковый сироп, газированная вода и настой анчана для цвета.',
      vi: 'Nước cốt chanh tươi ép lạnh, lá bạc hà, siro mía hữu cơ, nước khoáng có ga và hoa đậu biếc tạo màu.'
    },
    price: 5.5,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    vegan: true
  },
  {
    id: 'drink_viet_coffee',
    name: {
      en: 'Phin Coconut Coffee',
      ru: 'Вьетнамский Кофе с Кокосом',
      vi: 'Cà Phê Sữa Đá Cốt Dừa'
    },
    description: {
      en: 'Traditional slow-dripped Robusta coffee sweetened with condensed milk and blended with frozen coconut cream.',
      ru: 'Традиционный вьетнамский крепкий кофе робуста медленного заваривания со сгущенным молоком и взбитыми кокосовыми сливками.',
      vi: 'Cà phê Robusta phin truyền thống đậm đà, hòa quyện cùng sữa đặc và kem dừa tuyết mịn.'
    },
    price: 6.0,
    category: 'drinks',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    popular: true
  },

  // ALCOHOL (Bar)
  {
    id: 'alcohol_martini',
    name: {
      en: 'Smoky Passion Fruit Martini',
      ru: 'Маракуйевый Мартини с Дымком',
      vi: 'Passion Fruit Martini Khói'
    },
    description: {
      en: 'Vodka infused with fresh vanilla pods, passion fruit puree, lime juice, accompanied by a shot of Prosecco.',
      ru: 'Водка на стручках ванили, пюре спелой маракуйи, сок лайма, подаётся с шотом игристого просекко.',
      vi: 'Rượu vodka ngâm vani, thịt chanh dây tươi, nước cốt chanh, kèm một ly Prosecco sủi tăm.'
    },
    price: 13.5,
    category: 'alcohol',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    popular: true
  },
  {
    id: 'alcohol_beer',
    name: {
      en: 'Local Craft Pale Ale',
      ru: 'Локальный Крафтовый Эль',
      vi: 'Bia Thủ Công Pale Ale'
    },
    description: {
      en: 'Crisp, citrusy pale ale brewed locally with Citra hops, displaying tropical fruit notes and a clean, refreshing finish.',
      ru: 'Свежий цитрусовый светлый эль местного производства, сваренный на хмеле Citra, с нотками тропических фруктов.',
      vi: 'Bia Pale Ale thủ công tươi mát, ủ bằng hoa bia Citra địa phương, mang hương vị trái cây nhiệt đới thơm tho.'
    },
    price: 7.0,
    category: 'alcohol',
    department: 'bar',
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=600&q=80'
  }
];
