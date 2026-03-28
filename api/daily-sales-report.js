function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getTashkentRange() {
  const offsetMs = 5 * 60 * 60 * 1000;
  const now = new Date();
  const tashkentNow = new Date(now.getTime() + offsetMs);
  const startUtcMs = Date.UTC(
    tashkentNow.getUTCFullYear(),
    tashkentNow.getUTCMonth(),
    tashkentNow.getUTCDate(),
    0,
    0,
    0,
    0,
  ) - offsetMs;

  const start = new Date(startUtcMs);
  const end = new Date(startUtcMs + 24 * 60 * 60 * 1000);
  return { start, end };
}

function formatReport(orders, start) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
  const totalOrders = orders.length;
  const deliveryCount = orders.filter((order) => order.delivery_type === "delivery").length;
  const pickupCount = totalOrders - deliveryCount;
  const productTotals = new Map();

  orders.forEach((order) => {
    const items = Array.isArray(order.products) ? order.products : [];
    items.forEach((item) => {
      const key = item.name || "Noma'lum";
      productTotals.set(key, (productTotals.get(key) || 0) + Number(item.quantity || 0));
    });
  });

  const topProducts = [...productTotals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([name, qty], index) => `${index + 1}. ${escapeHtml(name)} - ${qty} dona`)
    .join("\n");

  return [
    "<b>OPTIMALL CANDY | Kunlik savdo hisoboti</b>",
    "",
    `<b>Sana:</b> ${escapeHtml(start.toLocaleDateString("uz-UZ", { timeZone: "Asia/Tashkent" }))}`,
    `<b>Buyurtmalar:</b> ${totalOrders}`,
    `<b>Jami savdo:</b> ${totalRevenue} so'm`,
    `<b>Yetkazish:</b> ${deliveryCount}`,
    `<b>Olib ketish:</b> ${pickupCount}`,
    "",
    "<b>Top mahsulotlar:</b>",
    topProducts || "Bugun savdo bo'lmadi",
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.ORDER_BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!token || !chatId || !supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Missing daily report credentials" });
  }

  try {
    const { start, end } = getTashkentRange();
    const ordersResponse = await fetch(
      `${supabaseUrl}/rest/v1/orders?select=total_price,delivery_type,products,created_at&created_at=gte.${encodeURIComponent(start.toISOString())}&created_at=lt.${encodeURIComponent(end.toISOString())}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );

    if (!ordersResponse.ok) {
      const details = await ordersResponse.text();
      return res.status(502).json({ error: "Supabase query failed", details });
    }

    const orders = await ordersResponse.json();
    const reportText = formatReport(Array.isArray(orders) ? orders : [], start);

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: reportText,
        parse_mode: "HTML",
      }),
    });

    if (!telegramResponse.ok) {
      const details = await telegramResponse.text();
      return res.status(502).json({ error: "Telegram API error", details });
    }

    return res.status(200).json({ ok: true, count: Array.isArray(orders) ? orders.length : 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected error" });
  }
}
