function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatOrderMessage(payload) {
  const user = payload.user ?? {};
  const items = (payload.products ?? [])
    .map(
      (item, index) =>
        `${index + 1}. ${escapeHtml(item.name)}${item.variant ? ` (${escapeHtml(item.variant)})` : ""} x ${item.quantity} = ${item.price * item.quantity} so'm`,
    )
    .join("\n");

  return [
    "<b>OPTIMALL CANDY | New Order</b>",
    "",
    `<b>Name:</b> ${escapeHtml(
      [user.first_name, user.last_name].filter(Boolean).join(" ") || "Unknown",
    )}`,
    `<b>Username:</b> ${escapeHtml(user.username ? `@${user.username}` : "N/A")}`,
    `<b>Telegram ID:</b> ${escapeHtml(user.id || "N/A")}`,
    `<b>Phone:</b> ${escapeHtml(payload.phone || "N/A")}`,
    `<b>Delivery type:</b> ${escapeHtml(payload.deliveryType || "N/A")}`,
    `<b>Location:</b> ${escapeHtml(payload.location || "-")}`,
    "",
    "<b>Products:</b>",
    items || "No items",
    "",
    `<b>Total:</b> ${escapeHtml(payload.totalPrice || 0)} so'm`,
    `<b>Date:</b> ${escapeHtml(new Date(payload.date || Date.now()).toLocaleString())}`,
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.ORDER_BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Missing Telegram bot credentials" });
  }

  try {
    const payload = req.body ?? {};

    if (!Array.isArray(payload.products) || payload.products.length === 0) {
      return res.status(400).json({ error: "Products are required" });
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: formatOrderMessage(payload),
          parse_mode: "HTML",
        }),
      },
    );

    if (!telegramResponse.ok) {
      const details = await telegramResponse.text();
      return res.status(502).json({ error: "Telegram API error", details });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected error" });
  }
}
