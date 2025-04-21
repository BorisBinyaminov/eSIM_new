// pages/api/auth.ts

import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || 'ТВОЙ_ТОКЕН_БОТА';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const data = req.body;
  const authHash = data.hash;
  delete data.hash;

  const sortedData = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const computedHash = crypto.createHmac('sha256', secret).update(sortedData).digest('hex');

  const authDate = Number(data.auth_date);
  const now = Math.floor(Date.now() / 1000);

  if (computedHash === authHash && now - authDate < 86400) {
    res.status(200).json({ status: 'success' });
  } else {
    res.status(403).json({ status: 'error', message: 'Неверная подпись или устаревшая дата' });
  }
}
