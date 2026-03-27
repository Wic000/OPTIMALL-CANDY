import { useEffect, useMemo, useState } from "react";

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
    productSaved: "Mahsulot saqlandi",
  },
  ru: {
    welcome: "Магазин Mini App",
    heroBadge: "Заказы 24/7",
    heroTitle: "Сладости и игрушки в одном месте",
    heroText: "Быстрый, красивый и удобный онлайн-магазин прямо внутри Telegram.",
    catalog: "Каталог",
    buyNow: "Выбирайте сейчас",
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
    locateMe: "Определить геолокацию",
    noteLocation: "Укажите адрес или ориентир",
    placing: "Отправка...",
    orderSuccess: "Заказ отправлен администратору",
    orderError: "Не удалось отправить заказ",
    needPhone: "Введите телефон",
    needLocation: "Введите адрес",
    skeletonTitle: "Загружаем товары",
    telegramOnly: "Оптимизировано для Telegram",
    light: "День",
    dark: "Ночь",
    adminPanel: "Панель администратора",
    adminHint: "Видно только админу",
    addProduct: "Добавить товар",
    editProduct: "Изменить",
    deleteProduct: "Удалить",
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
    productSaved: "Товар сохранен",
  },
};

const baseCategories = [
  { id: "all", name: { uz: "Barchasi", ru: "Все" } },
  { id: "Shirinliklar", name: { uz: "Shirinliklar", ru: "Сладости" } },
  { id: "O‘yinchoqlar", name: { uz: "O'yinchoqlar", ru: "Игрушки" } },
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

const baseProducts = [
  {
    id: "sweet-box",
    name: "Sweet Box Berry",
    category: "Shirinliklar",
    image: svgData("Berry Box", "#ff7aa8", "#ffb97e", "#ffe0ec"),
    price: 79000,
    description: "Premium sovg'a qutisi, rang-barang konfetlar va berry ta'mlari bilan.",
    badge: "NEW",
  },
  {
    id: "marshmallow-cloud",
    name: "Marshmallow Cloud",
    category: "Shirinliklar",
    image: svgData("Cloud", "#8d76ff", "#ff89b3", "#fff8cf"),
    price: 42000,
    description: "Yumshoq marshmallow to'plami, choy va sovg'a uchun mos.",
    badge: "HIT",
  },
  {
    id: "joy-bear",
    name: "Joy Bear",
    category: "O‘yinchoqlar",
    image: svgData("Joy Bear", "#ff986f", "#ffc977", "#fff6d2"),
    price: 119000,
    description: "Yumshoq ayiqcha va sovg'aga tayyor qadoq.",
    badge: "HIT",
  },
  {
    id: "magic-pop-it",
    name: "Magic Pop It",
    category: "O‘yinchoqlar",
    image: svgData("Pop It", "#5f70ff", "#75d7ff", "#ffd6e7"),
    price: 36000,
    description: "Stress relief uchun rangli pop-it o'yinchoq.",
    badge: "",
  },
];

const heroBubbleItems = [
  { id: "b1", label: "🍬", size: "lg", top: "6%", left: "12%", delay: "0s", duration: "10s" },
  { id: "b2", label: "🧸", size: "md", top: "18%", left: "56%", delay: "0.8s", duration: "12s" },
  { id: "b3", label: "🍭", size: "sm", top: "28%", left: "28%", delay: "1.4s", duration: "9.5s" },
  { id: "b4", label: "🎁", size: "lg", top: "38%", left: "66%", delay: "0.3s", duration: "11.5s" },
  { id: "b5", label: "🍫", size: "md", top: "54%", left: "10%", delay: "1.1s", duration: "10.5s" },
  { id: "b6", label: "🎈", size: "sm", top: "60%", left: "44%", delay: "0.6s", duration: "9s" },
  { id: "b7", label: "🍪", size: "md", top: "72%", left: "72%", delay: "1.7s", duration: "12.5s" },
  { id: "b8", label: "🪀", size: "sm", top: "78%", left: "24%", delay: "0.4s", duration: "8.8s" },
];

const price = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} so'm`;
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const tg = () => window.Telegram?.WebApp;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-candy-ink/45 px-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
      <div
        className={`relative z-10 w-full max-w-md animate-rise ${bottom ? "mt-auto" : ""}`}
        style={bottom ? { marginBottom: "calc(1rem + var(--tg-safe-bottom))" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border-0 bg-candy-ink/[0.05] px-4 py-3 text-sm outline-none placeholder:text-candy-ink/35 dark:bg-white/6 dark:placeholder:text-white/35" />
    </label>
  );
}

function AdminPanel({ t, products, categories, setEditing, setProducts, setCart, addCategory }) {
  const [uz, setUz] = useState("");
  const [ru, setRu] = useState("");
  return (
    <section className="glass-panel mt-8 animate-rise rounded-[32px] px-4 py-5 text-white shadow-float">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">{t.adminHint}</p>
          <h2 className="mt-1 text-2xl font-black">{t.adminPanel}</h2>
        </div>
        <button type="button" onClick={() => setEditing({ id: "", name: "", category: categories[0]?.id ?? "Shirinliklar", image: "", price: "", description: "", badge: "" })} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-candy-ink">
          {t.addProduct}
        </button>
      </div>
      <div className="glass-pill mt-5 rounded-[26px] p-4">
        <p className="text-sm font-bold">{t.categories}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input value={uz} onChange={(e) => setUz(e.target.value)} placeholder="Uzbek" className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/45 backdrop-blur" />
          <input value={ru} onChange={(e) => setRu(e.target.value)} placeholder="Русский" className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/45 backdrop-blur" />
        </div>
        <button type="button" onClick={() => { addCategory(uz, ru); setUz(""); setRu(""); }} className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-candy-ink">{t.addCategory}</button>
      </div>
      <div className="mt-5 space-y-3">
        {products.map((product) => (
          <div key={product.id} className="glass-pill flex items-center gap-3 rounded-[24px] p-3">
            <img src={product.image} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{product.name}</p>
              <p className="text-xs text-white/72">{product.category} • {price(product.price)}</p>
            </div>
            <button type="button" onClick={() => setEditing(product)} className="text-xs font-semibold text-white">{t.editProduct}</button>
            <button type="button" onClick={() => { setProducts((current) => current.filter((item) => item.id !== product.id)); setCart((current) => current.filter((item) => item.id !== product.id)); }} className="text-xs font-semibold text-[#ffc2d8]">{t.deleteProduct}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductEditor({ t, product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product);
  useEffect(() => setForm(product), [product]);
  if (!form) return null;
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
            <p className="mb-2 text-sm font-semibold">{t.uploadImage}</p>
            <input type="file" accept="image/*" className="w-full text-sm" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const image = await toDataUrl(file); setForm((current) => ({ ...current, image })); }} />
            {form.image ? <img src={form.image} alt={form.name || "preview"} className="mt-3 h-28 w-full rounded-2xl object-cover" /> : null}
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
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <svg
        viewBox="0 0 430 932"
        className="absolute inset-x-0 bottom-0 h-[88vh] w-full opacity-70 dark:opacity-85"
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

          <g className="flower-sway-left">
            <g className="petal-bloom" style={{ transformOrigin: "82px 366px", animationDelay: "1.35s" }}>
              <path d="M76 402 C 46 376, 40 336, 64 308 C 82 334, 88 364, 84 402" fill="#ffd4cb" />
              <path d="M82 402 C 98 364, 98 328, 82 294 C 66 328, 66 364, 82 402" fill="#ffcfba" />
              <path d="M88 402 C 116 376, 122 336, 98 308 C 82 334, 76 364, 80 402" fill="#ffe2da" />
              <path d="M82 404 C 92 420, 94 438, 88 466 C 78 462, 72 440, 74 408" fill="#35c7cf" />
              <circle cx="82" cy="308" r="7" fill="#ffb184" />
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
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => read(STORAGE.theme, "light"));
  const [lang, setLang] = useState(() => read(STORAGE.lang, "uz"));
  const [products, setProducts] = useState(() => read(STORAGE.products, baseProducts));
  const [categories, setCategories] = useState(() => read(STORAGE.categories, baseCategories));
  const [cart, setCart] = useState(() => read(STORAGE.cart, []));
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkout, setCheckout] = useState({ phone: "", deliveryType: "delivery", location: "" });
  const t = i18n[lang];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    write(STORAGE.theme, theme);
  }, [theme]);
  useEffect(() => write(STORAGE.lang, lang), [lang]);
  useEffect(() => write(STORAGE.products, products), [products]);
  useEffect(() => write(STORAGE.categories, categories), [categories]);
  useEffect(() => write(STORAGE.cart, cart), [cart]);
  useEffect(() => {
    tg()?.ready?.();
    tg()?.expand?.();
    setUser(tg()?.initDataUnsafe?.user ?? null);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

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
  const admin = String(user?.id ?? "") === String(ADMIN_ID);

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
          date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("request failed");
      tg()?.HapticFeedback?.notificationOccurred?.("success");
      setCart([]);
      setCheckout({ phone: "", deliveryType: "delivery", location: "" });
      setCheckoutOpen(false);
      setCartOpen(false);
      setToast(t.orderSuccess);
    } catch (error) {
      console.error(error);
      tg()?.HapticFeedback?.notificationOccurred?.("error");
      setToast(t.orderError);
    } finally {
      setSubmitting(false);
    }
  };

  const saveProduct = (form) => {
    const payload = {
      id: form.id || slug(form.name),
      name: form.name,
      category: form.category,
      image: form.image || svgData(form.name, "#ff7aa8", "#8d76ff", "#fff6d2"),
      price: Number(form.price),
      description: form.description,
      badge: form.badge,
    };
    setProducts((current) =>
      current.some((item) => item.id === payload.id)
        ? current.map((item) => (item.id === payload.id ? payload : item))
        : [payload, ...current],
    );
    setEditing(null);
    setToast(t.productSaved);
  };

  const addCategory = (uz, ru) => {
    const id = uz.trim() || ru.trim();
    if (!id || categories.some((item) => item.id === id)) return;
    setCategories((current) => [...current, { id, name: { uz: uz || id, ru: ru || id } }]);
    setToast(t.categorySaved);
  };

  return (
    <div className="min-h-screen pb-36 text-candy-ink dark:text-white">
      <FloralBackground />
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-6 pt-4">
        <header className="glass sticky top-0 z-20 rounded-[28px] border border-white/60 px-4 py-3 shadow-card dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-candy-pink/80">{t.welcome}</p>
              <h1 className="text-lg font-black tracking-tight">OPTIMALL CANDY</h1>
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
                className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold shadow-card dark:bg-white/10"
              >
                {theme === "light" ? t.dark : t.light}
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-xs text-candy-ink/70 dark:bg-white/10 dark:text-white/80">
            <span>{t.telegramOnly}</span>
            <span className="font-semibold">{user?.first_name ?? "Guest"}</span>
          </div>
        </header>

        <section className="glass-panel relative mt-4 overflow-hidden rounded-[32px] px-5 py-6 text-white shadow-float">
          <div className="absolute inset-0 bg-gradient-to-br from-candy-pink/70 via-candy-coral/55 to-candy-peach/45" />
          <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-white/20 blur-xl" />
          <div className="absolute -bottom-12 left-0 h-28 w-28 rounded-full bg-candy-plum/30 blur-xl" />
          <div className="hero-bubble-scene absolute inset-0">
            {heroBubbleItems.map((item) => (
              <div
                key={item.id}
                className={`hero-bubble hero-bubble-${item.size} absolute flex items-center justify-center rounded-full text-white`}
                style={{
                  top: item.top,
                  left: item.left,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                <span className="hero-bubble-glow absolute inset-[12%] rounded-full" />
                <span className="relative text-lg">{item.label}</span>
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
                <article key={product.id} className="glass-panel animate-rise rounded-[28px] p-3 shadow-card" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="relative overflow-hidden rounded-[24px]">
                    <img src={product.image} alt={product.name} className="h-32 w-full object-cover" loading="lazy" />
                    {product.badge ? <span className="absolute left-3 top-3 rounded-full bg-candy-ink px-2.5 py-1 text-[10px] font-bold text-white dark:bg-white dark:text-candy-ink">{product.badge}</span> : null}
                  </div>
                  <div className="mt-3">
                    <h3 className="truncate text-sm font-bold">{product.name}</h3>
                    <p className="mt-1 text-lg font-black">{price(product.price)}</p>
                    <button type="button" onClick={() => setSelected(product)} className="mt-2 text-xs font-semibold text-candy-pink">{t.details}</button>
                    <button type="button" onClick={() => addToCart(product)} className="mt-3 w-full rounded-2xl bg-candy-ink px-3 py-3 text-sm font-semibold text-white dark:bg-white dark:text-candy-ink">{t.addToCart}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {admin ? (
          <AdminPanel
            t={t}
            products={products}
            categories={categories.filter((item) => item.id !== "all")}
            setEditing={setEditing}
            setProducts={setProducts}
            setCart={setCart}
            addCategory={addCategory}
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[26px] bg-candy-ink px-5 py-4 text-white shadow-float dark:bg-white dark:text-candy-ink"
        style={{ bottom: "calc(1.25rem + var(--tg-safe-bottom))" }}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs dark:bg-candy-ink/10">{totalCount}</span>
          {t.cart}
        </span>
        <span className="text-sm font-black">{price(totalPrice)}</span>
      </button>

      {selected ? (
        <Modal onClose={() => setSelected(null)}>
          <div className="glass-panel overflow-hidden rounded-[30px] p-4 text-candy-ink shadow-float dark:text-white">
            <img src={selected.image} alt={selected.name} className="h-52 w-full rounded-[24px] object-cover" />
            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-black">{selected.name}</h3>
                {selected.badge ? <span className="rounded-full bg-candy-pink px-3 py-1 text-xs font-bold text-white">{selected.badge}</span> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-candy-ink/70 dark:text-white/78">{selected.description}</p>
              <p className="mt-4 text-2xl font-black">{price(selected.price)}</p>
              <button type="button" onClick={() => { addToCart(selected); setSelected(null); }} className="mt-5 w-full rounded-2xl bg-candy-ink px-4 py-3 font-semibold text-white dark:bg-white dark:text-candy-ink">{t.addToCart}</button>
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
              <Field label={t.phone} value={checkout.phone} onChange={(value) => setCheckout((current) => ({ ...current, phone: value }))} placeholder="+998 90 123 45 67" />
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
    </div>
  );
}
