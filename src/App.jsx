import { useEffect, useMemo, useRef, useState } from "react";


import { hasSupabase, supabase } from "./lib/supabase";

const STORAGE = {
  cart: "optimall-candy-cart",
  theme: "optimall-candy-theme",
  lang: "optimall-candy-lang",
  products: "optimall-candy-products",
  categories: "optimall-candy-categories",
};

const ADMIN_ID = import.meta.env.VITE_ADMIN_TELEGRAM_ID ?? "PLACEHOLDER";

const i18n = {
  uz: {
    welcome: "Mini App do'kon",
    heroBadge: "24/7 buyurtma",
    heroTitle: "Shirinliklar va o'yinchoqlar bir joyda",
    heroText: "Telegram ichida ishlaydigan tezkor, chiroyli va qulay online store.",
    catalog: "Katalog",
    buyNow: "Hoziroq tanlang",
    cart: "Savat",
    details: "Batafsil",
    addToCart: "Savatga qo'shish",
    added: "Mahsulot savatga qo'shildi",
    emptyCart: "Savat bo'sh",
    emptyCartText: "Mahsulot tanlang va buyurtmani boshlang.",
    total: "Jami",
    checkout: "Buyurtma berish",
    cancel: "Bekor qilish",
    remove: "O'chirish",
    phone: "Telefon raqami",
    deliveryType: "Yetkazish turi",
    delivery: "Yetkazib berish",
    pickup: "Olib ketish",
    location: "Manzil",
    locateMe: "Joylashuvni olish",
    noteLocation: "Manzil yoki mo'ljalni yozing",
    placing: "Yuborilmoqda...",
    orderSuccess: "Buyurtma adminga yuborildi",
    orderError: "Buyurtmani yuborib bo'lmadi",
    needPhone: "Telefon kiriting",
    needLocation: "Manzil kiriting",
    skeletonTitle: "Mahsulotlar yuklanmoqda",
    telegramOnly: "Telegram uchun moslashtirilgan",
    light: "Kunduz",
    dark: "Tun",
    adminPanel: "Admin panel",
    adminHint: "Faqat admin ko'radi",
    addProduct: "Mahsulot qo'shish",
    editProduct: "Tahrirlash",
    deleteProduct: "O'chirish",
    adminProducts: "Mahsulotlar",
    adminCategoriesTab: "Kategoriyalar",
    adminStats: "Statistika",
    searchProduct: "Mahsulot qidirish",
    totalProducts: "Jami mahsulot",
    totalCategories: "Jami kategoriya",
    featuredProducts: "Badge borlari",
    noProductsYet: "Mahsulotlar topilmadi",
    adminSort: "Saralash",
    newestFirst: "Avval yangilari",
    priceHigh: "Narx: yuqoridan",
    priceLow: "Narx: pastdan",
    nameAZ: "Nom: A-Z",
    removeCategory: "Kategoriyani o'chirish",
    categoryUsed: "ishlatilgan",
    imagesReady: "rasm",
    productName: "Nomi",
    price: "Narxi",
    description: "Tavsif",
    category: "Kategoriya",
    badge: "Badge",
    save: "Saqlash",
    noBadge: "Badge yo'q",
    uploadImage: "Rasm yuklash",
    categories: "Kategoriyalar",
    addCategory: "Kategoriya qo'shish",
    categorySaved: "Kategoriya saqlandi",
    categoryDeleted: "Kategoriya o'chirildi",
    productSaved: "Mahsulot saqlandi",
  },
  ru: {
    welcome: "Магазин Mini App",
    heroBadge: "24/7 заказы",
    heroTitle: "Сладости и игрушки в одном месте",
    heroText: "Быстрый, красивый и удобный онлайн-магазин, который работает внутри Telegram.",
    catalog: "Каталог",
    buyNow: "Выберите сейчас",
    cart: "Корзина",
    details: "Подробнее",
    addToCart: "В корзину",
    added: "Товар добавлен в корзину",
    emptyCart: "Корзина пуста",
    emptyCartText: "Выберите товары и начните оформление заказа.",
    total: "Итого",
    checkout: "Оформить заказ",
    cancel: "Отмена",
    remove: "Удалить",
    phone: "Номер телефона",
    deliveryType: "Способ получения",
    delivery: "Доставка",
    pickup: "Самовывоз",
    location: "Адрес",
    locateMe: "Определить местоположение",
    noteLocation: "Укажите адрес или ориентир",
    placing: "Отправка...",
    orderSuccess: "Заказ отправлен администратору",
    orderError: "Не удалось отправить заказ",
    needPhone: "Введите номер телефона",
    needLocation: "Введите адрес",
    skeletonTitle: "Товары загружаются",
    telegramOnly: "Оптимизировано для Telegram",
    light: "День",
    dark: "Ночь",
    adminPanel: "Панель администратора",
    adminHint: "Видно только администратору",
    addProduct: "Добавить товар",
    editProduct: "Редактировать",
    deleteProduct: "Удалить",
    adminProducts: "Товары",
    adminCategoriesTab: "Категории",
    adminStats: "Статистика",
    searchProduct: "Поиск товара",
    totalProducts: "Всего товаров",
    totalCategories: "Всего категорий",
    featuredProducts: "С бейджем",
    noProductsYet: "Товары не найдены",
    adminSort: "Сортировка",
    newestFirst: "Сначала новые",
    priceHigh: "Цена: выше",
    priceLow: "Цена: ниже",
    nameAZ: "Название: A-Z",
    removeCategory: "Удалить категорию",
    categoryUsed: "используется",
    imagesReady: "фото",
    productName: "Название",
    price: "Цена",
    description: "Описание",
    category: "Категория",
    badge: "Бейдж",
    save: "Сохранить",
    noBadge: "Без бейджа",
    uploadImage: "Загрузить изображение",
    categories: "Категории",
    addCategory: "Добавить категорию",
    categorySaved: "Категория сохранена",
    categoryDeleted: "Категория удалена",
    productSaved: "Товар сохранен",
  },
};

const baseCategories = [
  { id: "all", name: { uz: "Barchasi", ru: "Все" } },
  { id: "Shirinliklar", name: { uz: "Shirinliklar", ru: "Сладости" } },
  { id: "O'yinchoqlar", name: { uz: "O'yinchoqlar", ru: "Игрушки" } },
];

const svgData = (label, from, to, accent) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${from}" offset="0%"/><stop stop-color="${to}" offset="100%"/></linearGradient></defs>
      <rect width="640" height="480" rx="40" fill="url(#g)"/>
      <circle cx="124" cy="116" r="80" fill="${accent}" opacity="0.25"/>
      <circle cx="530" cy="346" r="96" fill="#fff" opacity="0.16"/>
      <path d="M162 262c58-88 130-116 216-84 36 14 72 48 106 92" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity="0.5"/>
      <text x="50%" y="52%" text-anchor="middle" font-size="50" font-family="Arial, sans-serif" font-weight="700" fill="#fff">${label}</text>
    </svg>
  `)}`;

const galleryFromSeed = (label, palette) =>
  palette.map(([from, to, accent], index) =>
    svgData(`${label} ${index + 1}`, from, to, accent),
  );

const bubbleArt = (kind, from, to) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="140" height="140" rx="70" fill="url(#bg)"/>
      ${kind === "candy" ? `
        <circle cx="70" cy="72" r="24" fill="#fff4f8"/>
        <path d="M36 72l12-12v24z" fill="#ffd1e3"/>
        <path d="M104 72l-12-12v24z" fill="#ffd1e3"/>
        <path d="M58 62c8-6 16-6 24 0" stroke="#ff7aa8" stroke-width="5" fill="none" stroke-linecap="round"/>
      ` : ""}
      ${kind === "lollipop" ? `
        <circle cx="72" cy="56" r="24" fill="#fff3d6"/>
        <path d="M56 56c10-14 28-14 32 0c-4 14-22 18-32 0z" fill="#ff92b8"/>
        <path d="M72 80v24" stroke="#fff7ef" stroke-width="6" stroke-linecap="round"/>
      ` : ""}
      ${kind === "donut" ? `
        <circle cx="70" cy="70" r="28" fill="#ffd8a8"/>
        <circle cx="70" cy="70" r="12" fill="url(#bg)"/>
        <path d="M48 64c8-12 36-14 44 4" stroke="#ff8dc1" stroke-width="10" stroke-linecap="round" fill="none"/>
      ` : ""}
      ${kind === "bear" ? `
        <circle cx="48" cy="46" r="12" fill="#ffe7c6"/>
        <circle cx="92" cy="46" r="12" fill="#ffe7c6"/>
        <circle cx="70" cy="72" r="34" fill="#ffe7c6"/>
        <circle cx="58" cy="68" r="4" fill="#7f5b4d"/>
        <circle cx="82" cy="68" r="4" fill="#7f5b4d"/>
        <ellipse cx="70" cy="82" rx="10" ry="8" fill="#fff5ea"/>
      ` : ""}
      ${kind === "car" ? `
        <path d="M34 82h72l-8-18H56z" fill="#fff2db"/>
        <circle cx="52" cy="88" r="10" fill="#2d2f48"/>
        <circle cx="88" cy="88" r="10" fill="#2d2f48"/>
        <path d="M58 64h28l8 12H50z" fill="#82deff"/>
      ` : ""}
      ${kind === "gift" ? `
        <rect x="42" y="54" width="56" height="46" rx="10" fill="#fff4ea"/>
        <rect x="66" y="54" width="8" height="46" fill="#ff7aa8"/>
        <rect x="42" y="68" width="56" height="8" fill="#ff7aa8"/>
        <path d="M70 54c-10-12-20-12-20-2c0 8 10 10 20 2z" fill="#ffd16e"/>
        <path d="M70 54c10-12 20-12 20-2c0 8-10 10-20 2z" fill="#ffd16e"/>
      ` : ""}
      ${kind === "cube" ? `
        <rect x="42" y="44" width="56" height="56" rx="14" fill="#fff4ff"/>
        <circle cx="58" cy="60" r="7" fill="#ff95c5"/>
        <circle cx="82" cy="60" r="7" fill="#8fd8ff"/>
        <circle cx="58" cy="84" r="7" fill="#ffd17b"/>
        <circle cx="82" cy="84" r="7" fill="#98f0cf"/>
      ` : ""}
      ${kind === "ball" ? `
        <circle cx="70" cy="70" r="30" fill="#fff3ea"/>
        <path d="M44 70h52" stroke="#ff89b5" stroke-width="8" stroke-linecap="round"/>
        <path d="M70 44v52" stroke="#7ed7ff" stroke-width="8" stroke-linecap="round"/>
      ` : ""}
    </svg>
  `)}`;

const baseProducts = [
  {
    id: "sweet-box",
    name: "Sweet Box Berry",
    category: "Shirinliklar",
    image: svgData("Berry Box", "#ff7aa8", "#ffb97e", "#ffe0ec"),
    images: galleryFromSeed("Berry Box", [
      ["#ff7aa8", "#ffb97e", "#ffe0ec"],
      ["#ff8fb6", "#ffd07a", "#fff4d9"],
      ["#ff6c9d", "#ffb2c8", "#fff0f4"],
      ["#ff9d84", "#ffc16c", "#fff1de"],
    ]),
    price: 79000,
    description: "Premium sovg'a qutisi, rang-barang konfetlar va berry ta'mlari bilan.",
    badge: "NEW",
  },
  {
    id: "marshmallow-cloud",
    name: "Marshmallow Cloud",
    category: "Shirinliklar",
    image: svgData("Cloud", "#8d76ff", "#ff89b3", "#fff8cf"),
    images: galleryFromSeed("Cloud", [
      ["#8d76ff", "#ff89b3", "#fff8cf"],
      ["#6ca4ff", "#96e5ff", "#fff8cf"],
      ["#a088ff", "#ffc0dd", "#fff2cf"],
      ["#7f82ff", "#ff9fc5", "#ffeccb"],
    ]),
    price: 42000,
    description: "Yumshoq marshmallow to'plami, choy va sovg'a uchun mos.",
    badge: "HIT",
  },
  {
    id: "joy-bear",
    name: "Joy Bear",
    category: "O'yinchoqlar",
    image: svgData("Joy Bear", "#ff986f", "#ffc977", "#fff6d2"),
    images: galleryFromSeed("Joy Bear", [
      ["#ff986f", "#ffc977", "#fff6d2"],
      ["#ffb57b", "#ffd885", "#fff4de"],
      ["#e58a68", "#ffc7a1", "#ffeed9"],
      ["#ffa870", "#ffd066", "#fff7d4"],
    ]),
    price: 119000,
    description: "Yumshoq ayiqcha va sovg'aga tayyor qadoq.",
    badge: "HIT",
  },
  {
    id: "magic-pop-it",
    name: "Magic Pop It",
    category: "O'yinchoqlar",
    image: svgData("Pop It", "#5f70ff", "#75d7ff", "#ffd6e7"),
    images: galleryFromSeed("Pop It", [
      ["#5f70ff", "#75d7ff", "#ffd6e7"],
      ["#7f67ff", "#ff94d9", "#ffe1a6"],
      ["#56a0ff", "#93ebff", "#ffd8f0"],
      ["#5862ff", "#9fa3ff", "#ffe5a8"],
    ]),
    price: 36000,
    description: "Stress relief uchun rangli pop-it o'yinchoq.",
    badge: "",
  },
];

const heroBubbleItems = [
  { id: "b1", image: bubbleArt("candy", "#ff8fb6", "#ffc186"), size: "lg", top: "6%", left: "12%", delay: "0s", duration: "10s" },
  { id: "b2", image: bubbleArt("bear", "#ffb287", "#ffd88d"), size: "md", top: "18%", left: "56%", delay: "0.8s", duration: "12s" },
  { id: "b3", image: bubbleArt("lollipop", "#87a0ff", "#ffc8e4"), size: "sm", top: "28%", left: "28%", delay: "1.4s", duration: "9.5s" },
  { id: "b4", image: bubbleArt("gift", "#7adfff", "#8b83ff"), size: "lg", top: "38%", left: "66%", delay: "0.3s", duration: "11.5s" },
  { id: "b5", image: bubbleArt("donut", "#ffb38d", "#ff8fbb"), size: "md", top: "54%", left: "10%", delay: "1.1s", duration: "10.5s" },
  { id: "b6", image: bubbleArt("car", "#83dbff", "#6d7fff"), size: "sm", top: "60%", left: "44%", delay: "0.6s", duration: "9s" },
  { id: "b7", image: bubbleArt("cube", "#ff98cd", "#94c9ff"), size: "md", top: "72%", left: "72%", delay: "1.7s", duration: "12.5s" },
  { id: "b8", image: bubbleArt("ball", "#ffcf96", "#ff99ba"), size: "sm", top: "78%", left: "24%", delay: "0.4s", duration: "8.8s" },
];

const ensureProductGallery = (product) => {
  if (product.images?.length) {
    return { ...product, image: product.image || product.images[0], images: product.images.slice(0, 4) };
  }

  if (product.image?.startsWith("data:image/svg+xml")) {
    return {
      ...product,
      images: [product.image, product.image, product.image, product.image],
    };
  }

  return {
    ...product,
    images: product.image ? [product.image, product.image, product.image, product.image] : [],
  };
};

const compactProductsForStorage = (products) =>
  products.map(({ images, ...product }) => ({
    ...product,
    image: product.image || images?.[0] || "",
  }));

const categoryFromRow = (row) => ({
  id: row.id,
  name: {
    uz: row.name_uz,
    ru: row.name_ru,
  },
});

const productToRow = (product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: Number(product.price) || 0,
  description: product.description || "",
  badge: product.badge || "",
  image: product.image || product.images?.[0] || "",
  images: product.images?.filter(Boolean).slice(0, 4) || [],
});

const productFromRow = (row) =>
  ensureProductGallery({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description,
    badge: row.badge,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
  });

const randomBubbleMotion = () => ({
  driftX: `${-30 + Math.random() * 60}px`,
  driftY: `${-26 + Math.random() * 20}px`,
  driftMidX: `${-34 + Math.random() * 68}px`,
  driftMidY: `${-38 + Math.random() * 28}px`,
});

const backgroundButterflies = [
  { id: "bf-1", left: "25%", top: "44%", scale: 0.92, delay: "0s", duration: "12.8s", hue: 0, wing: "#ff9ccc", wing2: "#ffd57d", mode: "fly" },
  { id: "bf-2", left: "69%", top: "42%", scale: 0.98, delay: "2.2s", duration: "14.4s", hue: 18, wing: "#9fe1ff", wing2: "#c8a7ff", mode: "fly" },
  { id: "bf-3", left: "35%", top: "34%", scale: 0.78, delay: "1.1s", duration: "13.8s", hue: -12, wing: "#ffe39a", wing2: "#ff96b6", mode: "fly" },
  { id: "bf-4", left: "60%", top: "32%", scale: 0.86, delay: "3.4s", duration: "15.5s", hue: 14, wing: "#9ff0d5", wing2: "#7fc6ff", mode: "fly" },
  { id: "bf-5", left: "49%", top: "48%", scale: 0.74, delay: "4.1s", duration: "12.2s", hue: -18, wing: "#ffb7df", wing2: "#fff0a1", mode: "fly" },
  { id: "bf-6", left: "18%", top: "57%", scale: 0.74, delay: "0.8s", duration: "14.2s", hue: 8, wing: "#ffd0ec", wing2: "#a6d8ff", mode: "fly" },
  { id: "bf-7", left: "78%", top: "56%", scale: 0.8, delay: "2.9s", duration: "13.4s", hue: -10, wing: "#fff0a8", wing2: "#ff9fca", mode: "fly" },
  { id: "bf-8", left: "31%", top: "59%", scale: 0.66, delay: "1.7s", duration: "11.8s", hue: 22, wing: "#b8fff1", wing2: "#7ec8ff", mode: "perch" },
  { id: "bf-9", left: "63%", top: "58%", scale: 0.72, delay: "4.8s", duration: "12.9s", hue: -22, wing: "#ffc0de", wing2: "#ffe694", mode: "perch" },
  { id: "bf-10", left: "41%", top: "66%", scale: 0.7, delay: "5.1s", duration: "15s", hue: 12, wing: "#c7b4ff", wing2: "#8fe9ff", mode: "perch" },
  { id: "bf-11", left: "54%", top: "64%", scale: 0.76, delay: "3.8s", duration: "14.2s", hue: -6, wing: "#ffb4d2", wing2: "#fff1ad", mode: "perch" },
  { id: "bf-12", left: "47%", top: "38%", scale: 0.62, delay: "6.2s", duration: "11.6s", hue: 16, wing: "#ffddb3", wing2: "#b2fff0", mode: "fly" },
];

const price = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} so'm`;
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const normalized = digits.startsWith("998") ? digits : `998${digits.slice(0, 9)}`;
  const trimmed = normalized.slice(0, 12);
  const parts = [
    trimmed.slice(0, 3),
    trimmed.slice(3, 5),
    trimmed.slice(5, 8),
    trimmed.slice(8, 10),
    trimmed.slice(10, 12),
  ].filter(Boolean);
  return parts.length ? `+${parts.join(" ")}` : "+998";
};
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (key === STORAGE.products) {
      try {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(compactProductsForStorage(value)));
        return;
      } catch {
        try {
          localStorage.removeItem(key);
        } catch {
          // ignore storage cleanup failure
        }
      }
    }

    console.warn("Storage write skipped", error);
  }
};
const tg = () => window.Telegram?.WebApp;
const getTelegramUser = () => {
  const webApp = tg();
  const unsafeUser = webApp?.initDataUnsafe?.user;
  if (unsafeUser?.id) return unsafeUser;

  const initData = webApp?.initData;
  if (!initData) return null;

  try {
    const params = new URLSearchParams(initData);
    const rawUser = params.get("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};
const slug = (v) => v.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function Modal({ children, onClose, bottom = false }) {
  return (
    <div className={`fixed inset-0 z-50 flex bg-candy-ink/45 px-4 backdrop-blur-sm ${bottom ? "items-end justify-center" : "items-center justify-center pt-20"}`}>
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
      <div
        className={`relative z-10 w-full max-w-md animate-rise ${bottom ? "mt-auto" : ""}`}
        style={bottom ? { marginBottom: "calc(1rem + var(--tg-safe-bottom))" } : { marginTop: "max(1rem, env(safe-area-inset-top))", marginBottom: "1rem" }}
      >
        {children}
      </div>
    </div>
  );
}

const randomConfettiPiece = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  left: `${8 + Math.random() * 84}%`,
  delay: `${Math.random() * 0.8}s`,
  duration: `${2.8 + Math.random() * 1.2}s`,
  rotate: `${-80 + Math.random() * 160}deg`,
  color: ["#ff7ab6", "#ffd266", "#7fddff", "#9ee632", "#c790ff"][Math.floor(Math.random() * 5)],
});

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border-0 bg-candy-ink/[0.05] px-4 py-3 text-sm outline-none placeholder:text-candy-ink/35 dark:bg-white/6 dark:placeholder:text-white/35" />
    </label>
  );
}

const avatarSvg = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#ff89b9"/>
          <stop offset="48%" stop-color="#ffc86f"/>
          <stop offset="100%" stop-color="#7edcff"/>
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill="url(#g)"/>
      <circle cx="48" cy="48" r="40" fill="rgba(255,255,255,0.16)"/>
      <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="#ffffff">${label}</text>
    </svg>
  `)}`;

function UserAvatar({ user }) {
  const initials = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const fallbackAvatar = avatarSvg(initials || "U");

  return (
    <img
      src={user?.photo_url || fallbackAvatar}
      alt={user?.first_name ?? "User"}
      className="h-10 w-10 rounded-full border border-white/30 object-cover shadow-card"
    />
  );
}

function BrandLogo() {
  return (
    <svg viewBox="0 0 380 128" className="h-14 w-[11.5rem] overflow-visible" aria-label="Optimall Candy">
      <defs>
        <linearGradient id="logoPink" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff95c1" />
          <stop offset="100%" stopColor="#ff5b96" />
        </linearGradient>
        <linearGradient id="logoGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffe68d" />
          <stop offset="100%" stopColor="#ffb233" />
        </linearGradient>
        <linearGradient id="logoBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#8de5ff" />
          <stop offset="100%" stopColor="#63b8ff" />
        </linearGradient>
        <linearGradient id="logoGreen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#dfff8f" />
          <stop offset="100%" stopColor="#8fdb1f" />
        </linearGradient>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#4c1570" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#logoShadow)" stroke="#4b146f" strokeWidth="8" strokeLinejoin="round" paintOrder="stroke fill">
        <text x="10" y="52" fontSize="52" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoPink)">OPTI</text>
        <text x="152" y="52" fontSize="52" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoGold)">MAL</text>
        <text x="280" y="52" fontSize="52" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoBlue)">L</text>
        <text x="48" y="106" fontSize="56" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoPink)">C</text>
        <text x="92" y="106" fontSize="56" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoGold)">A</text>
        <text x="138" y="106" fontSize="56" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoGreen)">N</text>
        <text x="190" y="106" fontSize="56" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoBlue)">D</text>
        <text x="242" y="106" fontSize="56" fontWeight="900" fontFamily="Arial, sans-serif" fill="url(#logoPink)">Y</text>
      </g>
      <g opacity="0.96">
        <circle cx="330" cy="20" r="16" fill="#ff77b8" />
        <path d="M330 37v12" stroke="#fff2f7" strokeWidth="5" strokeLinecap="round" />
        <path d="M318 14c0-8 8-12 12-6c4-6 12-2 12 6c0 8-8 13-12 16c-4-3-12-8-12-16Z" fill="#ffd1ea" />
        <circle cx="26" cy="18" r="10" fill="#ffd86d" />
        <path d="M15 18l-8-5v10Z" fill="#ff91be" />
        <path d="M37 18l8-5v10Z" fill="#ff91be" />
      </g>
    </svg>
  );
}

function ZoomableGallery({ product }) {
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const pinchRef = useRef(null);

  useEffect(() => {
    setActiveImage(0);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pinchRef.current = null;
  }, [product]);

  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pinchRef.current = null;
  };

  const getDistance = (touches) => {
    const [first, second] = touches;
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
  };

  const getCenter = (touches) => {
    const [first, second] = touches;
    return {
      x: (first.clientX + second.clientX) / 2,
      y: (first.clientY + second.clientY) / 2,
    };
  };

  const onTouchStart = (event) => {
    if (event.touches.length !== 2) return;
    const center = getCenter(event.touches);
    pinchRef.current = {
      distance: getDistance(event.touches),
      scale,
      center,
      translate,
    };
  };

  const onTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    event.preventDefault();
    const distance = getDistance(event.touches);
    const center = getCenter(event.touches);
    const nextScale = Math.min(3, Math.max(1, pinchRef.current.scale * (distance / pinchRef.current.distance)));
    setScale(nextScale);
    setTranslate({
      x: pinchRef.current.translate.x + (center.x - pinchRef.current.center.x) * 0.35,
      y: pinchRef.current.translate.y + (center.y - pinchRef.current.center.y) * 0.35,
    });
  };

  const onTouchEnd = () => {
    if (scale <= 1.02) {
      resetZoom();
      return;
    }
    pinchRef.current = null;
  };

  return (
    <div>
      <div
        className="product-zoom-shell relative overflow-hidden rounded-[24px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[activeImage]}
          alt={product.name}
          className="product-zoom-image h-60 w-full object-cover"
          style={{ transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})` }}
        />
        <button
          type="button"
          onClick={resetZoom}
          className="glass-pill absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
        >
          Zoom
        </button>
        <div className="glass-pill absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white">
          2 barmoq bilan yaqinlashtiring
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={`${product.id}-${index}`}
            type="button"
            onClick={() => {
              setActiveImage(index);
              resetZoom();
            }}
            className={`overflow-hidden rounded-[18px] border ${activeImage === index ? "border-candy-pink shadow-card" : "border-white/20"}`}
          >
            <img src={image} alt={`${product.name} ${index + 1}`} className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminPanel({ t, products, categories, setEditing, onDeleteProduct, addCategory, deleteCategory }) {
  const [uz, setUz] = useState("");
  const [ru, setRu] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const stats = [
    { id: "products", label: t.totalProducts ?? "Jami mahsulot", value: products.length },
    { id: "categories", label: t.totalCategories ?? "Jami kategoriya", value: categories.length },
    { id: "featured", label: t.featuredProducts ?? "Badge borlari", value: products.filter((item) => item.badge).length },
  ];
  const filteredProducts = products
    .filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()))
    .sort((left, right) => {
      if (sortBy === "price-high") return right.price - left.price;
      if (sortBy === "price-low") return left.price - right.price;
      if (sortBy === "name") return left.name.localeCompare(right.name);
      return 0;
    });

  return (
    <section className="glass-panel mt-8 animate-rise rounded-[32px] px-4 py-5 text-white shadow-float">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">{t.adminHint}</p>
          <h2 className="mt-1 text-2xl font-black">{t.adminPanel}</h2>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({
              id: "",
              name: "",
              category: categories[0]?.id ?? "Shirinliklar",
              image: "",
              images: ["", "", "", ""],
              price: "",
              description: "",
              badge: "",
            })
          }
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-candy-ink"
        >
          {t.addProduct}
        </button>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "products", label: t.adminProducts ?? "Mahsulotlar" },
          { id: "categories", label: t.adminCategoriesTab ?? "Kategoriyalar" },
          { id: "stats", label: t.adminStats ?? "Statistika" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === tab.id ? "bg-white text-candy-ink" : "glass-pill text-white/82"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "stats" ? (
        <div className="mt-5 grid grid-cols-3 gap-3">
          {stats.map((item) => (
            <div key={item.id} className="glass-pill rounded-[24px] p-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/62">{item.label}</p>
              <p className="mt-2 text-2xl font-black">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "categories" ? (
        <div className="glass-pill mt-5 rounded-[26px] p-4">
          <p className="text-sm font-bold">{t.categories}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input value={uz} onChange={(e) => setUz(e.target.value)} placeholder="Uzbek" className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/45 backdrop-blur" />
            <input value={ru} onChange={(e) => setRu(e.target.value)} placeholder="Russian" className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/45 backdrop-blur" />
          </div>
          <button type="button" onClick={() => { addCategory(uz, ru); setUz(""); setRu(""); }} className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-candy-ink">{t.addCategory}</button>
          <div className="mt-4 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="glass-pill flex items-center justify-between gap-3 rounded-[20px] px-3 py-2 text-xs font-semibold text-white">
                <div>
                  <p>{category.name.uz}</p>
                  <p className="mt-0.5 text-[10px] text-white/62">{category.name.ru}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/72">
                    {products.filter((item) => item.category === category.id).length} {t.categoryUsed}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    disabled={products.some((item) => item.category === category.id)}
                    className="rounded-full bg-[#ffc2d8]/14 px-2.5 py-1 text-[10px] font-bold text-[#ffe1ea] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t.deleteProduct}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "products" ? (
        <div className="mt-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="glass-pill rounded-[24px] p-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchProduct ?? "Mahsulot qidirish"}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 backdrop-blur"
              />
            </div>
            <div className="glass-pill rounded-[24px] p-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="newest">{t.adminSort}: {t.newestFirst}</option>
                <option value="price-high">{t.adminSort}: {t.priceHigh}</option>
                <option value="price-low">{t.adminSort}: {t.priceLow}</option>
                <option value="name">{t.adminSort}: {t.nameAZ}</option>
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="glass-pill rounded-[24px] p-4 text-center text-sm text-white/75">
                {t.noProductsYet ?? "Mahsulotlar topilmadi"}
              </div>
            ) : null}
            {filteredProducts.map((product) => (
              <div key={product.id} className="glass-pill flex items-center gap-3 rounded-[24px] p-3">
                <img src={product.image} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  <p className="text-xs text-white/72">{product.category} · {price(product.price)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/52">{product.images?.filter(Boolean).length || 1} {t.imagesReady}</p>
                </div>
                <button type="button" onClick={() => setEditing(product)} className="rounded-full bg-white/12 px-3 py-2 text-xs font-semibold text-white">{t.editProduct}</button>
                <button type="button" onClick={() => onDeleteProduct(product.id)} className="rounded-full bg-[#ffc2d8]/14 px-3 py-2 text-xs font-semibold text-[#ffe1ea]">{t.deleteProduct}</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProductEditor({ t, product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product);
  useEffect(() => setForm(product), [product]);
  if (!form) return null;
  const imageSlots = Array.from({ length: 4 }, (_, index) => form.images?.[index] || (index === 0 ? form.image || "" : ""));

  return (
    <Modal onClose={onClose}>
      <div className="glass-panel rounded-[30px] p-4 text-candy-ink shadow-float dark:text-white">
        <h3 className="text-xl font-black">{form.id ? t.editProduct : t.addProduct}</h3>
        <div className="mt-4 space-y-3">
          <Field label={t.productName} value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <div>
            <p className="mb-2 text-sm font-semibold">{t.category}</p>
            <select value={form.category} onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))} className="w-full rounded-2xl border-0 bg-candy-ink/[0.05] px-4 py-3 text-sm dark:bg-white/6">
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name.uz} / {category.name.ru}</option>)}
            </select>
          </div>
          <Field label={t.price} type="number" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: value }))} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t.description}</span>
            <textarea value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} rows={4} className="w-full rounded-2xl border-0 bg-candy-ink/[0.05] px-4 py-3 text-sm outline-none dark:bg-white/6" />
          </label>
          <div>
            <p className="mb-2 text-sm font-semibold">{t.badge}</p>
            <select value={form.badge} onChange={(e) => setForm((current) => ({ ...current, badge: e.target.value }))} className="w-full rounded-2xl border-0 bg-candy-ink/[0.05] px-4 py-3 text-sm dark:bg-white/6">
              <option value="">{t.noBadge}</option>
              <option value="NEW">NEW</option>
              <option value="HIT">HIT</option>
            </select>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{t.uploadImage} 1-4</p>
            <div className="grid grid-cols-2 gap-3">
              {imageSlots.map((image, index) => (
                <label key={`image-slot-${index}`} className="block">
                  <span className="mb-2 block text-xs font-semibold opacity-75">Rasm {index + 1}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const nextImage = await toDataUrl(file);
                      setForm((current) => {
                        const nextImages = Array.from({ length: 4 }, (_, slot) => current.images?.[slot] || (slot === 0 ? current.image || "" : ""));
                        nextImages[index] = nextImage;
                        const cleanedImages = nextImages.map((item) => item || "").filter(Boolean);
                        return {
                          ...current,
                          image: nextImages[0] || cleanedImages[0] || "",
                          images: nextImages,
                        };
                      });
                    }}
                  />
                  {image ? <img src={image} alt={`${form.name || "preview"} ${index + 1}`} className="mt-3 h-24 w-full rounded-2xl object-cover" /> : <div className="mt-3 flex h-24 items-center justify-center rounded-2xl border border-dashed border-candy-ink/15 bg-candy-ink/[0.04] text-xs opacity-60 dark:border-white/12 dark:bg-white/6">Preview {index + 1}</div>}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={() => onSave(form)} className="flex-1 rounded-2xl bg-candy-ink px-4 py-3 font-semibold text-white dark:bg-white dark:text-candy-ink">{t.save}</button>
          <button type="button" onClick={onClose} className="rounded-2xl bg-candy-ink/[0.05] px-4 py-3 font-semibold dark:bg-white/6">{t.cancel}</button>
        </div>
      </div>
    </Modal>
  );
}

function FloralBackground() {
  const lightModeButterflies =
    typeof window !== "undefined" && !window.Telegram?.WebApp
      ? backgroundButterflies.slice(0, 6)
      : backgroundButterflies;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="butterfly-scene" aria-hidden="true">
        {lightModeButterflies.map((butterfly) => (
          <div
            key={butterfly.id}
            className={`butterfly butterfly-${butterfly.mode || "fly"}`}
            style={{
              left: butterfly.left,
              top: butterfly.top,
              "--butterfly-scale": butterfly.scale,
              "--butterfly-delay": butterfly.delay,
              "--butterfly-duration": butterfly.duration,
              "--butterfly-hue": `${butterfly.hue}deg`,
            }}
          >
            <div className="butterfly-body" />
            <div className="butterfly-wing butterfly-wing-left" style={{ "--butterfly-wing": butterfly.wing, "--butterfly-wing-2": butterfly.wing2 }} />
            <div className="butterfly-wing butterfly-wing-right" style={{ "--butterfly-wing": butterfly.wing2, "--butterfly-wing-2": butterfly.wing }} />
          </div>
        ))}
      </div>
      <svg
        viewBox="0 0 430 932"
        className="absolute inset-x-0 bottom-0 h-[88vh] w-full opacity-[0.92] dark:opacity-85"
        aria-hidden="true"
      >
          <g className="flower-grow-delayed origin-bottom">
          <path
            d="M215 890 C 196 804, 160 726, 112 636 C 86 586, 66 486, 70 366"
            fill="none"
            stroke="#35c7cf"
            strokeWidth="2.6"
            strokeLinecap="round"
            className="flower-stem"
          />
          <path
            d="M215 890 C 234 804, 270 726, 318 636 C 344 586, 364 486, 360 366"
            fill="none"
            stroke="#35c7cf"
            strokeWidth="2.6"
            strokeLinecap="round"
            className="flower-stem"
          />

          <path
            d="M156 720 C 132 708, 118 708, 100 724 C 120 744, 138 746, 160 732"
            fill="#82e7de"
            className="leaf-bloom"
          />
            <path
              d="M274 720 C 298 708, 312 708, 330 724 C 310 744, 292 746, 270 732"
            fill="#82e7de"
            className="leaf-bloom"
            style={{ animationDelay: "1s" }}
          />
          <path
            d="M122 784 C 94 776, 78 778, 62 794 C 84 812, 104 814, 128 800"
            fill="#82e7de"
            className="leaf-bloom"
            style={{ animationDelay: "1.15s" }}
          />
            <path
              d="M308 784 C 336 776, 352 778, 368 794 C 346 812, 326 814, 302 800"
              fill="#82e7de"
              className="leaf-bloom"
              style={{ animationDelay: "1.15s" }}
            />
            <path
              d="M196 742 C 182 734, 174 734, 164 744 C 176 756, 188 758, 200 750"
              fill="#9cefe6"
              className="leaf-bloom"
              style={{ animationDelay: "1.05s" }}
            />
            <path
              d="M234 742 C 248 734, 256 734, 266 744 C 254 756, 242 758, 230 750"
              fill="#9cefe6"
              className="leaf-bloom"
              style={{ animationDelay: "1.05s" }}
            />
            <path
              d="M172 676 C 154 666, 144 666, 132 678 C 146 692, 160 694, 176 684"
              fill="#7fe8dc"
              className="leaf-bloom"
              style={{ animationDelay: "1.22s" }}
            />
            <path
              d="M258 676 C 276 666, 286 666, 298 678 C 284 692, 270 694, 254 684"
              fill="#7fe8dc"
              className="leaf-bloom"
              style={{ animationDelay: "1.22s" }}
            />

          <g className="flower-sway-left">
            <g className="petal-bloom" style={{ transformOrigin: "82px 366px", animationDelay: "1.35s" }}>
              <path d="M76 402 C 46 376, 40 336, 64 308 C 82 334, 88 364, 84 402" fill="#ffd4cb" />
              <path d="M82 402 C 98 364, 98 328, 82 294 C 66 328, 66 364, 82 402" fill="#ffcfba" />
              <path d="M88 402 C 116 376, 122 336, 98 308 C 82 334, 76 364, 80 402" fill="#ffe2da" />
              <path d="M82 404 C 92 420, 94 438, 88 466 C 78 462, 72 440, 74 408" fill="#35c7cf" />
              <circle cx="82" cy="308" r="7" fill="#ffb184" />
            </g>
            <g className="petal-bloom" style={{ transformOrigin: "122px 446px", animationDelay: "1.72s" }}>
              <path d="M118 464 C 104 452, 102 432, 114 420 C 124 432, 126 446, 124 464" fill="#ffe1d7" />
              <path d="M122 464 C 130 446, 130 430, 122 414 C 114 430, 114 446, 122 464" fill="#ffd1c3" />
              <path d="M126 464 C 140 452, 142 432, 130 420 C 120 432, 118 446, 120 464" fill="#fff0ea" />
              <path d="M122 466 C 128 474, 128 486, 124 500 C 118 498, 116 486, 118 468" fill="#35c7cf" />
            </g>
          </g>

          <g className="flower-sway-right">
            <g className="petal-bloom" style={{ transformOrigin: "348px 366px", animationDelay: "1.5s" }}>
              <path d="M342 402 C 312 376, 306 336, 330 308 C 348 334, 354 364, 350 402" fill="#ffd4cb" />
              <path d="M348 402 C 364 364, 364 328, 348 294 C 332 328, 332 364, 348 402" fill="#ffcfba" />
              <path d="M354 402 C 382 376, 388 336, 364 308 C 348 334, 342 364, 346 402" fill="#ffe2da" />
              <path d="M348 404 C 358 420, 360 438, 354 466 C 344 462, 338 440, 340 408" fill="#35c7cf" />
              <circle cx="348" cy="308" r="7" fill="#ffb184" />
            </g>
            <g className="petal-bloom" style={{ transformOrigin: "308px 446px", animationDelay: "1.86s" }}>
              <path d="M304 464 C 290 452, 288 432, 300 420 C 310 432, 312 446, 310 464" fill="#ffe1d7" />
              <path d="M308 464 C 316 446, 316 430, 308 414 C 300 430, 300 446, 308 464" fill="#ffd1c3" />
              <path d="M312 464 C 326 452, 328 432, 316 420 C 306 432, 304 446, 306 464" fill="#fff0ea" />
              <path d="M308 466 C 314 474, 314 486, 310 500 C 304 498, 302 486, 304 468" fill="#35c7cf" />
            </g>
          </g>

          <g className="flower-sway-center">
            <g className="petal-bloom" style={{ transformOrigin: "215px 566px", animationDelay: "1.62s" }}>
              <path d="M208 594 C 188 578, 184 550, 200 532 C 214 548, 218 570, 216 594" fill="#ffd8cf" />
              <path d="M215 594 C 226 568, 226 544, 215 520 C 204 544, 204 568, 215 594" fill="#ffcbb7" />
              <path d="M222 594 C 242 578, 246 550, 230 532 C 216 548, 212 570, 214 594" fill="#ffe7df" />
              <path d="M215 596 C 222 608, 224 624, 220 646 C 210 642, 206 624, 208 600" fill="#35c7cf" />
              <circle cx="215" cy="532" r="6" fill="#ffb184" />
            </g>
          </g>

          <path
            d="M168 816 C 146 800, 142 780, 150 748"
            fill="none"
            stroke="#35c7cf"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="flower-accent"
          />
          <path
            d="M262 816 C 284 800, 288 780, 280 748"
            fill="none"
            stroke="#35c7cf"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="flower-accent"
            style={{ animationDelay: "1.2s" }}
          />
          <path
            d="M215 780 C 205 762, 205 734, 215 704"
            fill="none"
            stroke="#35c7cf"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="flower-accent"
            style={{ animationDelay: "1.36s" }}
          />
          <path
            d="M96 742 C 112 726, 124 718, 140 714"
            fill="none"
            stroke="#71dfe1"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="flower-accent"
            style={{ animationDelay: "1.48s" }}
          />
          <path
            d="M334 742 C 318 726, 306 718, 290 714"
            fill="none"
            stroke="#71dfe1"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="flower-accent"
            style={{ animationDelay: "1.48s" }}
          />
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => read(STORAGE.theme, "light"));
  const [lang, setLang] = useState(() => read(STORAGE.lang, "uz"));
  const [products, setProducts] = useState(() =>
    read(STORAGE.products, baseProducts).map(ensureProductGallery),
  );
  const [categories, setCategories] = useState(() => read(STORAGE.categories, baseCategories));
  const [cart, setCart] = useState(() => read(STORAGE.cart, []));
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [flyers, setFlyers] = useState([]);
  const [bubbleBursts, setBubbleBursts] = useState([]);
  const [orderCelebration, setOrderCelebration] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [checkout, setCheckout] = useState({ phone: "", deliveryType: "delivery", location: "", giftWrap: false });
  const [luckyReward, setLuckyReward] = useState(null);
  const [heroBubbles, setHeroBubbles] = useState(() =>
    heroBubbleItems.map((item, index) => ({
      ...item,
      ...randomBubbleMotion(),
      key: `${item.id}-${index}`,
      popped: false,
    })),
  );
  const t = i18n[lang];
  const cartButtonRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    write(STORAGE.theme, theme);
  }, [theme]);
  useEffect(() => write(STORAGE.lang, lang), [lang]);
  useEffect(() => write(STORAGE.products, compactProductsForStorage(products)), [products]);
  useEffect(() => write(STORAGE.categories, categories), [categories]);
  useEffect(() => write(STORAGE.cart, cart), [cart]);
  useEffect(() => {
    if (!hasSupabase || !supabase) return undefined;

    let alive = true;

    const syncFromSupabase = async () => {
      const [{ data: categoryRows, error: categoryError }, { data: productRows, error: productError }] = await Promise.all([
        supabase.from("categories").select("*").order("created_at", { ascending: true }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
      ]);

      if (!alive) return;

      if (!categoryError && Array.isArray(categoryRows) && categoryRows.length) {
        setCategories([baseCategories[0], ...categoryRows.map(categoryFromRow)]);
      }

      if (!productError && Array.isArray(productRows) && productRows.length) {
        setProducts(productRows.map(productFromRow));
      }
    };

    syncFromSupabase();

    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    const webApp = tg();
    webApp?.ready?.();
    webApp?.expand?.();

    const syncUser = () => {
      const nextUser = getTelegramUser();
      if (nextUser?.id) {
        setUser(nextUser);
        return true;
      }
      return false;
    };

    if (syncUser()) return undefined;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (syncUser() || attempts >= 12) {
        window.clearInterval(timer);
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setProducts((current) => current.map(ensureProductGallery));
  }, []);

  const visibleProducts = useMemo(
    () => (filter === "all" ? products : products.filter((item) => item.category === filter)),
    [filter, products],
  );
  const totalCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.id);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [cart, products],
  );
  const currentTelegramUser = user ?? getTelegramUser();
  const adminDebug =
    typeof window !== "undefined" && window.Telegram?.WebApp
      ? `TG: ${currentTelegramUser?.id ?? "none"} | ENV: ${String(ADMIN_ID ?? "").trim() || "none"}`
      : "";
  const admin =
    String(currentTelegramUser?.id ?? "").trim() === String(ADMIN_ID ?? "").trim() ||
    (typeof window !== "undefined" && ["localhost", "127.0.0.1", "192.168.1.5"].includes(window.location.hostname));
  const relatedProducts = useMemo(() => {
    if (!selected) return [];
    return products
      .filter((item) => item.id !== selected.id && item.category === selected.category)
      .slice(0, 4);
  }, [products, selected]);

  const openProduct = (product, originElement) => {
    if (originElement) {
      const rect = originElement.getBoundingClientRect();
      setSelectedOrigin({
        dx: rect.left + rect.width / 2 - window.innerWidth / 2,
        dy: rect.top + rect.height / 2 - window.innerHeight / 2,
        scale: Math.max(0.46, Math.min(0.88, rect.width / 360)),
      });
    } else {
      setSelectedOrigin(null);
    }
    setSelected(product);
  };

  const animateFlyToCart = (image, sourceElement) => {
    if (!image || !sourceElement || !cartButtonRef.current) return;
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartRect = cartButtonRef.current.getBoundingClientRect();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setFlyers((current) => [
      ...current,
      {
        id,
        image,
        startX: sourceRect.left + sourceRect.width / 2 - 28,
        startY: sourceRect.top + sourceRect.height / 2 - 28,
        endX: cartRect.left + cartRect.width / 2 - 16,
        endY: cartRect.top + cartRect.height / 2 - 16,
      },
    ]);
    window.setTimeout(() => {
      setFlyers((current) => current.filter((item) => item.id !== id));
    }, 760);
  };

  const popBubble = (id, bubbleElement) => {
    if (bubbleElement) {
      const rect = bubbleElement.getBoundingClientRect();
      const burstId = `${id}-${Date.now()}`;
      const particles = Array.from({ length: 8 }).map((_, index) => ({
        id: `${burstId}-${index}`,
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
        angle: `${index * 45}deg`,
      }));
      setBubbleBursts((current) => [...current, ...particles]);
      window.setTimeout(() => {
        setBubbleBursts((current) => current.filter((item) => !item.id.startsWith(burstId)));
      }, 720);
    }

    setHeroBubbles((current) =>
      current.map((item) => (item.key === id ? { ...item, popped: true } : item)),
    );

    window.setTimeout(() => {
      setHeroBubbles((current) =>
        current.map((item) => {
          if (item.key !== id) return item;
          const enterFromRight = Math.random() > 0.5;
          return {
            ...item,
            ...randomBubbleMotion(),
            top: `${8 + Math.random() * 72}%`,
            left: enterFromRight ? "92%" : "-4%",
            duration: `${8.5 + Math.random() * 4}s`,
            delay: "0s",
            popped: false,
            key: `${item.id}-${Date.now()}`,
          };
        }),
      );
    }, 420);
  };

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { id: product.id, quantity: 1 }];
    });
    tg()?.HapticFeedback?.impactOccurred?.("light");
    setToast(t.added);
  };

  const openLuckyBox = () => {
    const rewards =
      lang === "ru"
        ? [
            "Бонусный стикер в подарок",
            "Подарочная упаковка бесплатно",
            "Сладкий мини-бонус к заказу",
            "Приоритетная сборка заказа",
          ]
        : [
            "Sovg'a stiker bonus",
            "Bepul gift wrap",
            "Buyurtmaga shirin mini-bonus",
            "Buyurtmani tezroq tayyorlash",
          ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setLuckyReward(reward);
    setToast(reward);
  };

  const addToCartFromElement = (product, sourceElement) => {
    addToCart(product);
    animateFlyToCart(product.image, sourceElement);
  };

  const updateQty = (id, quantity) => {
    if (quantity <= 0) return setCart((current) => current.filter((item) => item.id !== id));
    setCart((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const requestLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setCheckout((current) => ({
          ...current,
          location: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
        })),
      () => setToast(t.noteLocation),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submitOrder = async () => {
    if (!checkout.phone.trim()) return setToast(t.needPhone);
    if (checkout.deliveryType === "delivery" && !checkout.location.trim()) {
      return setToast(t.needLocation);
    }
    setSubmitting(true);
    try {
      const items = cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          return product
            ? { id: product.id, name: product.name, price: product.price, quantity: item.quantity }
            : null;
        })
        .filter(Boolean);
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          phone: checkout.phone,
          deliveryType: checkout.deliveryType,
          location: checkout.deliveryType === "delivery" ? checkout.location : "",
          products: items,
          totalPrice,
          giftWrap: checkout.giftWrap,
          luckyReward,
          date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("request failed");

      if (hasSupabase && supabase) {
        await supabase.from("orders").insert({
          telegram_id: String(user?.id ?? ""),
          user_name: [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "",
          username: user?.username || "",
          phone: checkout.phone,
          delivery_type: checkout.deliveryType,
          location: checkout.deliveryType === "delivery" ? checkout.location : "",
          total_price: totalPrice,
          products: items,
        });
      }

      tg()?.HapticFeedback?.notificationOccurred?.("success");
      setCart([]);
      setCheckout({ phone: "", deliveryType: "delivery", location: "", giftWrap: false });
      setCheckoutOpen(false);
      setCartOpen(false);
      setLuckyReward(null);
      setToast(t.orderSuccess);
      setOrderCelebration({
        title: lang === "ru" ? "Заказ отправлен" : "Buyurtma yuborildi",
        text: lang === "ru" ? "Администратор уже получил вашу заявку." : "Adminga buyurtma muvaffaqiyatli yuborildi.",
        confetti: Array.from({ length: 18 }).map(randomConfettiPiece),
      });
    } catch (error) {
      console.error(error);
      tg()?.HapticFeedback?.notificationOccurred?.("error");
      setToast(t.orderError);
    } finally {
      setSubmitting(false);
    }
  };

  const saveProduct = async (form) => {
    const uploadedImages = form.images?.map((item) => item?.trim?.() ?? item).filter(Boolean) ?? [];
    const gallery = uploadedImages.length
      ? uploadedImages.slice(0, 4)
      : form.image
        ? [form.image, form.image, form.image, form.image]
        : galleryFromSeed(form.name, [
            ["#ff7aa8", "#8d76ff", "#fff6d2"],
            ["#ff9d84", "#ffc16c", "#fff1de"],
            ["#76b3ff", "#8ce4ff", "#ffe3f1"],
            ["#ff7fa3", "#ffbf90", "#fff7d4"],
          ]);
    const payload = {
      id: form.id || slug(form.name),
      name: form.name,
      category: form.category,
      image: form.image || gallery[0] || svgData(form.name, "#ff7aa8", "#8d76ff", "#fff6d2"),
      images: gallery,
      price: Number(form.price),
      description: form.description,
      badge: form.badge,
    };

    if (hasSupabase && supabase) {
      const { data, error } = await supabase
        .from("products")
        .upsert(productToRow(payload))
        .select()
        .single();

      if (error) {
        setToast(t.orderError);
        return;
      }

      const savedProduct = productFromRow(data);
      setProducts((current) =>
        current.some((item) => item.id === savedProduct.id)
          ? current.map((item) => (item.id === savedProduct.id ? savedProduct : item))
          : [savedProduct, ...current],
      );
    } else {
      setProducts((current) =>
        current.some((item) => item.id === payload.id)
          ? current.map((item) => (item.id === payload.id ? payload : item))
          : [payload, ...current],
      );
    }

    setEditing(null);
    setToast(t.productSaved);
  };

  const addCategory = async (uz, ru) => {
    const id = uz.trim() || ru.trim();
    if (!id || categories.some((item) => item.id === id)) return;

    const nextCategory = { id, name: { uz: uz || id, ru: ru || id } };

    if (hasSupabase && supabase) {
      const { data, error } = await supabase
        .from("categories")
        .upsert({
          id,
          name_uz: nextCategory.name.uz,
          name_ru: nextCategory.name.ru,
        })
        .select()
        .single();

      if (error) {
        setToast(t.orderError);
        return;
      }

      setCategories((current) => [...current, categoryFromRow(data)]);
    } else {
      setCategories((current) => [...current, nextCategory]);
    }

    setToast(t.categorySaved);
  };

  const deleteCategory = async (categoryId) => {
    if (products.some((item) => item.category === categoryId)) return;

    if (hasSupabase && supabase) {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId);
      if (error) {
        setToast(t.orderError);
        return;
      }
    }

    setCategories((current) => current.filter((item) => item.id !== categoryId));
    setToast(t.categoryDeleted);
  };

  const deleteProduct = async (productId) => {
    if (hasSupabase && supabase) {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) {
        setToast(t.orderError);
        return;
      }
    }

    setProducts((current) => current.filter((item) => item.id !== productId));
    setCart((current) => current.filter((item) => item.id !== productId));
  };
  useEffect(() => {
    const webApp = tg();
    const mainButton = webApp?.MainButton;
    if (!mainButton) return;

    if (checkoutOpen && cart.length > 0) {
      mainButton.setParams({
        text: submitting ? t.placing : `${t.checkout} - ${price(totalPrice)}`,
        is_visible: true,
        is_active: !submitting,
      });
      mainButton.onClick(submitOrder);
      mainButton.show();
    } else {
      mainButton.hide();
    }

    return () => {
      mainButton.offClick?.(submitOrder);
      if (!checkoutOpen) {
        mainButton.hide();
      }
    };
  }, [checkoutOpen, cart.length, submitting, totalPrice, t.checkout, t.placing, submitOrder]);
  useEffect(() => {
    if (!orderCelebration) return;
    const timer = window.setTimeout(() => setOrderCelebration(null), 2400);
    return () => clearTimeout(timer);
  }, [orderCelebration]);

  return (
    <div className="min-h-screen pb-36 text-candy-ink dark:text-white">
      <FloralBackground />
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-6 pt-4">


          <header className="glass header-shell sticky top-0 z-20 overflow-hidden rounded-[28px] border border-white/60 px-4 py-3 shadow-card dark:border-white/10">
            <div className="header-salute pointer-events-none absolute inset-0">
              <span className="header-salute-orb header-salute-orb-pink" />
              <span className="header-salute-orb header-salute-orb-gold" />
              <span className="header-salute-orb header-salute-orb-blue" />
              <span className="header-salute-candy header-salute-candy-1" />
              <span className="header-salute-candy header-salute-candy-2" />
              <span className="header-salute-candy header-salute-candy-3" />
              <span className="header-salute-candy header-salute-candy-4" />
              <span className="header-salute-candy header-salute-candy-5" />
              <span className="header-salute-candy header-salute-candy-6" />
              <span className="header-salute-candy header-salute-candy-7" />
              <span className="header-salute-star header-salute-star-1" />
              <span className="header-salute-star header-salute-star-2" />
              <span className="header-salute-star header-salute-star-3" />
              <span className="header-salute-star header-salute-star-4" />
              <span className="header-salute-star header-salute-star-5" />
              <span className="header-salute-star header-salute-star-6" />
              <span className="header-salute-star header-salute-star-7" />
            </div>
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <span className="logo-shine pointer-events-none absolute left-8 top-4 h-10 w-36" />
                <img
                  src="/logo-transparent.png"
                  alt="Optimall Candy"
                  className="h-24 w-auto max-w-[15rem] object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-full bg-white/80 p-1 shadow-card dark:bg-white/10">
                  {["uz", "ru"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${lang === code ? "bg-candy-ink text-white dark:bg-white dark:text-candy-ink" : "text-candy-ink/70 dark:text-white/70"}`}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-card dark:bg-white/10"
                aria-label={theme === "light" ? t.dark : t.light}
              >
                {theme === "light" ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ffb648]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
                    <path d="M12 2.4v2.2M12 19.4v2.2M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2.4 12h2.2M19.4 12h2.2M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M14.7 2.7a1 1 0 0 0-1.38 1.1A8.1 8.1 0 0 1 5.2 14.1a8 8 0 0 1-1.87-.22a1 1 0 0 0-1.05 1.53A10.2 10.2 0 1 0 14.7 2.7Z" />
                  </svg>
                )}
              </button>
              </div>
            </div>
            <div className="relative mt-3 flex items-center justify-end gap-3">
              {admin ? (
                <button
                  type="button"
                  onClick={() => setAdminOpen(true)}
                  className="glass-pill rounded-full px-3 py-2 text-xs font-bold text-candy-ink shadow-card dark:text-white"
                >
                  {t.adminPanel}
                </button>
              ) : null}
              {!admin && adminDebug ? (
                <div className="glass-pill rounded-full px-3 py-2 text-[10px] font-bold text-candy-ink/75 shadow-card dark:text-white/75">
                  {adminDebug}
                </div>
              ) : null}
              <div className="glass-pill flex h-11 w-11 items-center justify-center rounded-full p-0.5">
                <UserAvatar user={user} />
              </div>
            </div>
          </header>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-candy-pink/80">{t.catalog}</p>
              <h2 className="mt-1 text-2xl font-bold">{t.buyNow}</h2>
            </div>
            <div className="glass-pill rounded-full px-3 py-1 text-xs font-semibold shadow-card">{visibleProducts.length}</div>
          </div>

          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${filter === category.id ? "bg-candy-ink/90 text-white shadow-card backdrop-blur dark:bg-white dark:text-candy-ink" : "glass-pill text-candy-ink/80 shadow-card dark:text-white/80"}`}
              >
                {category.name?.[lang] ?? category.id}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-candy-ink/60 dark:text-white/60">{t.skeletonTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="glass-panel animate-pulseSoft rounded-[28px] p-3 shadow-card">
                    <div className="h-28 rounded-2xl bg-white/45 dark:bg-white/10" />
                    <div className="mt-3 h-4 w-20 rounded-full bg-white/45 dark:bg-white/10" />
                    <div className="mt-2 h-3 w-16 rounded-full bg-white/45 dark:bg-white/10" />
                    <div className="mt-4 h-10 rounded-2xl bg-white/45 dark:bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {visibleProducts.map((product, index) => (
                <article
                  key={product.id}
                  role="button"
                  tabIndex={0}
                  onClick={(event) => openProduct(product, event.currentTarget)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProduct(product, event.currentTarget);
                    }
                  }}
                  className="product-card glass-panel animate-rise rounded-[28px] p-3 shadow-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="relative overflow-hidden rounded-[24px]">
                    <img src={product.image} alt={product.name} className="h-32 w-full object-cover" loading="lazy" />
                    {product.badge ? <span className={`badge-premium absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${product.badge === "HIT" ? "badge-hit" : "badge-new"}`}>{product.badge}</span> : null}
                    <span className="glass-pill absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white">
                      4 ta rasm
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="truncate text-sm font-bold">{product.name}</h3>
                    <p className="mt-1 text-lg font-black">{price(product.price)}</p>
                    <span className="mt-2 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-candy-ink shadow-card dark:bg-white dark:text-candy-ink">
                      {t.details}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        const sourceImage = event.currentTarget.closest("article")?.querySelector("img");
                        addToCartFromElement(product, sourceImage);
                      }}
                      className="mt-3 w-full rounded-2xl bg-candy-ink px-3 py-3 text-sm font-semibold text-white dark:bg-white dark:text-candy-ink"
                    >
                      {t.addToCart}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel relative mt-5 overflow-hidden rounded-[32px] px-5 py-6 text-white shadow-float">
          <div className="absolute inset-0 bg-gradient-to-br from-candy-pink/70 via-candy-coral/55 to-candy-peach/45" />
          <div className="hero-light-sweep absolute inset-y-0 -left-1/3 w-1/2 rounded-full" />
          <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-white/20 blur-xl" />
          <div className="absolute -bottom-12 left-0 h-28 w-28 rounded-full bg-candy-plum/30 blur-xl" />
          <div className="hero-sparkles absolute inset-0">
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className="hero-sparkle absolute rounded-full"
                style={{
                  top: `${12 + (index * 8) % 72}%`,
                  left: `${8 + (index * 11) % 82}%`,
                  animationDelay: `${index * 0.35}s`,
                }}
              />
            ))}
          </div>
          <div className="hero-bubble-scene absolute inset-0">
            {heroBubbles.map((item) => (
              <div
                key={item.key}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    popBubble(item.key, event.currentTarget);
                  }
                }}
                onPointerDown={(event) => popBubble(item.key, event.currentTarget)}
                className={`hero-bubble hero-bubble-${item.size} absolute flex items-center justify-center rounded-full text-white ${item.popped ? "hero-bubble-pop" : ""}`}
                style={{
                  top: item.top,
                  left: item.left,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                  "--bubble-drift-x": item.driftX,
                  "--bubble-drift-y": item.driftY,
                  "--bubble-drift-mid-x": item.driftMidX,
                  "--bubble-drift-mid-y": item.driftMidY,
                }}
              >
                <span className="hero-bubble-glow absolute inset-[12%] rounded-full" />
                <span className="hero-bubble-core relative">
                  <img src={item.image} alt="" className="h-full w-full rounded-full object-cover" />
                </span>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="glass-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-white" />
              {t.heroBadge}
            </div>
            <h2 className="mt-4 text-[30px] font-black leading-[1.05]">{t.heroTitle}</h2>
            <p className="mt-3 max-w-[18rem] text-sm leading-6 text-white/88">{t.heroText}</p>
          </div>
        </section>

        <div className="mt-auto px-2 pb-4 pt-8 text-center">
          <div className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-candy-ink/55 backdrop-blur dark:text-white/55">
            Crafted by Optimall Company
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        ref={cartButtonRef}
        className="cart-liquid fixed left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[26px] px-5 py-4 text-white shadow-float"
        style={{ bottom: "calc(1.25rem + var(--tg-safe-bottom))" }}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="cart-liquid-badge inline-flex h-8 w-8 items-center justify-center rounded-full text-xs">{totalCount}</span>
          {t.cart}
        </span>
        <span className="text-sm font-black">{price(totalPrice)}</span>
      </button>

      {selected ? (
        <Modal onClose={() => setSelected(null)}>
          <div
            className="glass-panel product-modal-card-zoom flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-[30px] text-candy-ink shadow-float dark:text-white"
            style={{
              "--modal-origin-x": `${selectedOrigin?.dx ?? 0}px`,
              "--modal-origin-y": `${selectedOrigin?.dy ?? 0}px`,
              "--modal-origin-scale": selectedOrigin?.scale ?? 0.7,
              marginBottom: "calc(1rem + var(--tg-safe-bottom))",
            }}
          >
            <div className="modal-scroll-area flex-1 overflow-y-auto px-4 pb-4 pt-4">
            <ZoomableGallery product={selected} />
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-black">{selected.name}</h3>
                {selected.badge ? <span className={`badge-premium rounded-full px-3 py-1 text-xs font-bold ${selected.badge === "HIT" ? "badge-hit" : "badge-new"}`}>{selected.badge}</span> : null}
              </div>
              <p className="mt-2 rounded-[22px] bg-white/92 px-4 py-3 text-sm leading-6 text-candy-ink shadow-card dark:bg-white dark:text-candy-ink">
                {selected.description}
              </p>
              <p className="mt-4 text-2xl font-black">{price(selected.price)}</p>
              <div className="glass-pill mt-4 rounded-[22px] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-candy-pink">
                      {lang === "ru" ? "Lucky Box" : "Lucky Box"}
                    </p>
                    <p className="mt-1 text-xs text-candy-ink/65 dark:text-white/70">
                      {luckyReward ?? (lang === "ru" ? "Откройте и получите маленький бонус к заказу" : "Ochib ko'ring, buyurtmaga kichik bonus chiqadi")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openLuckyBox}
                    className="rounded-full bg-white px-3 py-2 text-xs font-bold text-candy-ink shadow-card"
                  >
                    {lang === "ru" ? "Открыть" : "Ochish"}
                  </button>
                </div>
              </div>
              {relatedProducts.length ? (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-candy-ink/55 dark:text-white/55">
                    {lang === "ru" ? "Похожие товары" : "O'xshash mahsulotlar"}
                  </p>
                  <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                    {relatedProducts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openProduct(item)}
                        className="glass-pill min-w-[110px] rounded-[20px] p-2 text-left"
                      >
                        <img src={item.image} alt={item.name} className="h-16 w-full rounded-2xl object-cover" />
                        <p className="mt-2 truncate text-xs font-bold text-candy-ink dark:text-white">{item.name}</p>
                        <p className="text-[11px] font-semibold text-candy-pink">{price(item.price)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            </div>
            <div className="border-t border-white/12 bg-white/72 px-4 pb-[calc(1rem+var(--tg-safe-bottom))] pt-3 backdrop-blur-xl dark:bg-candy-ink/58">
              <button
                type="button"
                onClick={(event) => {
                  const sourceImage = event.currentTarget.closest(".product-modal-card-zoom")?.querySelector(".product-zoom-image");
                  addToCartFromElement(selected, sourceImage);
                  setSelected(null);
                }}
                className="w-full rounded-2xl bg-candy-ink px-4 py-3 font-semibold text-white dark:bg-white dark:text-candy-ink"
              >
                {t.addToCart}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {cartOpen ? (
        <Modal onClose={() => setCartOpen(false)} bottom>
          <div className="glass-panel rounded-t-[34px] p-4 text-candy-ink shadow-float dark:text-white">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-candy-ink/12 dark:bg-white/18" />
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">{t.cart}</h3>
              <button type="button" onClick={() => setCartOpen(false)} className="text-sm font-semibold">{t.cancel}</button>
            </div>
            {cart.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-candy-pink/10 text-3xl">+</div>
                <p className="mt-4 text-lg font-bold">{t.emptyCart}</p>
                <p className="mt-2 text-sm text-candy-ink/60 dark:text-white/60">{t.emptyCartText}</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {cart.map((item) => {
                  const product = products.find((entry) => entry.id === item.id);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="glass-pill flex items-center gap-3 rounded-[24px] p-3">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold">{product.name}</h4>
                        <p className="mt-1 text-sm font-semibold">{price(product.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button type="button" onClick={() => updateQty(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full bg-white text-base shadow-card dark:bg-white/10">-</button>
                          <span className="min-w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full bg-white text-base shadow-card dark:bg-white/10">+</button>
                        </div>
                      </div>
                      <button type="button" onClick={() => setCart((current) => current.filter((entry) => entry.id !== item.id))} className="text-xs font-semibold text-candy-pink">{t.remove}</button>
                    </div>
                  );
                })}
                <div className="glass-pill rounded-[24px] px-4 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.total}</span>
                    <span className="text-lg font-black">{price(totalPrice)}</span>
                  </div>
                  <button type="button" onClick={() => setCheckoutOpen(true)} className="mt-4 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-candy-ink dark:bg-candy-ink dark:text-white">{t.checkout}</button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      ) : null}

      {checkoutOpen ? (
        <Modal onClose={() => setCheckoutOpen(false)}>
          <div className="glass-panel rounded-[30px] p-4 text-candy-ink shadow-float dark:text-white">
            <h3 className="text-xl font-black">{t.checkout}</h3>
            <div className="mt-4 space-y-3">
              <Field label={t.phone} value={checkout.phone} onChange={(value) => setCheckout((current) => ({ ...current, phone: formatPhone(value) }))} placeholder="+998 90 123 45 67" />
              <div>
                <p className="mb-2 text-sm font-semibold">{t.deliveryType}</p>
                <div className="grid grid-cols-2 gap-2">
                  {["delivery", "pickup"].map((type) => (
                    <button key={type} type="button" onClick={() => setCheckout((current) => ({ ...current, deliveryType: type }))} className={`rounded-2xl px-3 py-3 text-sm font-semibold ${checkout.deliveryType === type ? "bg-candy-ink text-white dark:bg-white dark:text-candy-ink" : "bg-candy-ink/[0.05] dark:bg-white/6"}`}>
                      {type === "delivery" ? t.delivery : t.pickup}
                    </button>
                  ))}
                </div>
              </div>
              {checkout.deliveryType === "delivery" ? (
                <div>
                  <Field label={t.location} value={checkout.location} onChange={(value) => setCheckout((current) => ({ ...current, location: value }))} placeholder={t.noteLocation} />
                  <button type="button" onClick={requestLocation} className="mt-2 text-sm font-semibold text-candy-pink">{t.locateMe}</button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setCheckout((current) => ({ ...current, giftWrap: !current.giftWrap }))}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                  checkout.giftWrap
                    ? "bg-candy-ink text-white dark:bg-white dark:text-candy-ink"
                    : "bg-candy-ink/[0.05] dark:bg-white/6"
                }`}
              >
                {lang === "ru" ? "Подарочная упаковка" : "Gift mode / Sovg'a qadoq"}
                <span className="ml-2 text-xs opacity-70">
                  {checkout.giftWrap
                    ? lang === "ru" ? "включено" : "yoqilgan"
                    : lang === "ru" ? "добавить к заказу" : "buyurtmaga qo'shish"}
                </span>
              </button>
            </div>
            <div className="glass-pill mt-5 rounded-[24px] px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.total}</span>
                <span className="text-lg font-black">{price(totalPrice)}</span>
              </div>
            </div>
            <button type="button" onClick={submitOrder} disabled={submitting} className="mt-5 w-full rounded-2xl bg-candy-ink px-4 py-3 font-semibold text-white disabled:opacity-70 dark:bg-white dark:text-candy-ink">
              {submitting ? t.placing : t.checkout}
            </button>
          </div>
        </Modal>
      ) : null}

      {adminOpen ? (
        <Modal onClose={() => setAdminOpen(false)}>
          <div className="max-h-[78vh] overflow-y-auto rounded-[30px]">
            <AdminPanel
              t={t}
              products={products}
              categories={categories.filter((item) => item.id !== "all")}
              setEditing={setEditing}
              onDeleteProduct={deleteProduct}
              addCategory={addCategory}
              deleteCategory={deleteCategory}
            />
          </div>
        </Modal>
      ) : null}

      {editing ? (
        <ProductEditor
          t={t}
          product={editing}
          categories={categories.filter((item) => item.id !== "all")}
          onClose={() => setEditing(null)}
          onSave={saveProduct}
        />
      ) : null}

      {toast ? (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-[calc(100%-2rem)] max-w-sm animate-rise rounded-2xl bg-candy-ink px-4 py-3 text-sm font-medium text-white shadow-float dark:bg-white dark:text-candy-ink">
          {toast}
        </div>
      ) : null}

      {flyers.map((flyer) => (
        <img
          key={flyer.id}
          src={flyer.image}
          alt=""
          className="cart-flyer fixed z-[70] h-14 w-14 rounded-2xl object-cover shadow-float"
          style={{
            left: flyer.startX,
            top: flyer.startY,
            "--fly-x": `${flyer.endX - flyer.startX}px`,
            "--fly-y": `${flyer.endY - flyer.startY}px`,
          }}
        />
      ))}

      {bubbleBursts.map((piece) => (
        <span
          key={piece.id}
          className="bubble-burst-piece fixed z-[65]"
          style={{ left: piece.left, top: piece.top, "--burst-angle": piece.angle }}
        />
      ))}

      {orderCelebration ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-candy-ink/30 px-6 backdrop-blur-sm">
          <div className="glass-panel success-scene relative w-full max-w-sm overflow-hidden rounded-[32px] px-6 py-8 text-center text-candy-ink shadow-float dark:text-white">
            <div className="success-check mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-4xl text-candy-green shadow-card">
              ✓
            </div>
            <h3 className="mt-4 text-2xl font-black">{orderCelebration.title}</h3>
            <p className="mt-2 text-sm text-candy-ink/70 dark:text-white/75">{orderCelebration.text}</p>
            {orderCelebration.confetti.map((piece) => (
              <span
                key={piece.id}
                className="success-confetti absolute top-0 h-3 w-2 rounded-full"
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  rotate: piece.rotate,
                  background: piece.color,
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FireworkName({ user, lang }) {
  const fallback = lang === "ru" ? "Гость" : "Mehmon";
  const rawName = user?.first_name?.trim() || user?.username?.trim() || fallback;
  const displayName = rawName.slice(0, 12);
  const liteMode = typeof window !== "undefined" && !window.Telegram?.WebApp;
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const widthRem = Math.min(10.8, Math.max(6.2, displayName.length * 0.62 + 2.6));

  useEffect(() => {
    if (liteMode) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const letters = Array.from(displayName);
    resize();

    const draw = (now) => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const baseTime = now * 0.0013;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.18)");
      gradient.addColorStop(1, "rgba(255,255,255,0.02)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const usableWidth = width - 26;
      const step = letters.length > 1 ? usableWidth / (letters.length - 1) : 0;

      letters.forEach((char, index) => {
        const targetX = letters.length > 1 ? 13 + step * index : width / 2;
        const targetY = height * 0.58;
        const hue = (index * 38 + 20) % 360;
        const delay = index * 0.3;
        const cycle = (baseTime - delay) % 4.4;
        const phase = cycle < 0 ? cycle + 4.4 : cycle;

        if (phase < 0.9) {
          const p = phase / 0.9;
          const startX = targetX + (index % 2 === 0 ? -20 : 20);
          const startY = height + 8;
          const x = startX + (targetX - startX) * p;
          const y = startY + (targetY - startY) * p;

          ctx.strokeStyle = `hsla(${hue}, 100%, 66%, ${0.32 + p * 0.82})`;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.fillStyle = `hsla(${hue}, 100%, 82%, ${0.72 + p * 0.28})`;
          ctx.beginPath();
          ctx.arc(x, y, 2.8 + p * 1.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (phase < 1.55) {
          const p = (phase - 0.9) / 0.65;
          for (let ray = 0; ray < 10; ray += 1) {
            const angle = (Math.PI * 2 * ray) / 10 + index * 0.22;
            const length = 4 + p * 12;
            ctx.strokeStyle = `hsla(${hue}, 100%, 80%, ${0.95 - p * 0.48})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(targetX, targetY);
            ctx.lineTo(targetX + Math.cos(angle) * length, targetY + Math.sin(angle) * length);
            ctx.stroke();
          }
        }

        const textPhase = Math.min(1, Math.max(0.42, (phase - 0.88) / 0.46));
        const pulse = 0.78 + Math.sin(baseTime * 4.4 + index) * 0.12;
        const alpha = Math.min(1, textPhase * pulse);

        if (alpha > 0.02) {
          ctx.save();
          ctx.font = "900 19px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.lineWidth = 2.2;
          ctx.strokeStyle = `hsla(${hue}, 100%, 28%, ${0.72 * alpha})`;
          ctx.shadowBlur = 18;
          ctx.shadowColor = `hsla(${hue}, 100%, 76%, ${0.95 * alpha})`;
          ctx.fillStyle = `hsla(${hue}, 100%, 84%, ${alpha})`;
          ctx.strokeText(char === " " ? "" : char.toUpperCase(), targetX, targetY);
          ctx.fillText(char === " " ? "" : char.toUpperCase(), targetX, targetY);
          ctx.restore();
        }

        if (phase > 1.6 && phase < 3.8) {
          const sparkCount = 2;
          for (let spark = 0; spark < sparkCount; spark += 1) {
            const sparkAngle = baseTime * 2.2 + index * 0.7 + spark * Math.PI;
            const sparkRadius = 7 + spark * 4 + Math.sin(baseTime * 3 + index) * 2;
            const sparkX = targetX + Math.cos(sparkAngle) * sparkRadius;
            const sparkY = targetY + Math.sin(sparkAngle) * (sparkRadius * 0.52);
            ctx.fillStyle = `hsla(${hue}, 100%, 86%, 0.82)`;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      frameRef.current = window.requestAnimationFrame(draw);
    };

    const resizeHandler = () => resize();
    window.addEventListener("resize", resizeHandler);
    frameRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [displayName, liteMode]);

  if (liteMode) {
    return (
      <div className="firework-name flex items-center justify-center px-4 text-sm font-black text-candy-ink dark:text-white" aria-label={displayName} style={{ width: `${widthRem}rem` }}>
        {displayName}
      </div>
    );
  }

  return (
    <div className="firework-name" aria-label={displayName} style={{ width: `${widthRem}rem` }}>
      <span className="firework-name-glow firework-name-glow-pink" />
      <span className="firework-name-glow firework-name-glow-blue" />
      <canvas ref={canvasRef} className="firework-name-canvas" />
    </div>
  );
}

