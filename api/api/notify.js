export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const token = process.env.TG_TOKEN;
  const chat = process.env.TG_CHAT;
  if (!token || !chat) return res.status(500).json({ ok: false, error: "not set" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const text = String((body && body.text) || "").slice(0, 3500);
  if (!text) return res.status(400).json({ ok: false });

  try {
    const r = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: text })
    });
    const j = await r.json();
    return res.status(200).json({ ok: !!j.ok });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}
