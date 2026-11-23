export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body || {};
  const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || process.env.TG_TOKEN;
  const chatId = process.env.GROUP_ID || process.env.TELEGRAM_CHAT_ID || process.env.TG_CHAT;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Token ba Chat ID pawa jay nai' });
  }

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text || 'Notun Hisab' })
  });
  const data = await r.json();
  return res.status(200).json(data);
}
