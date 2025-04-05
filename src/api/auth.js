// pages/api/auth.js
import crypto from 'crypto';

const BOT_TOKEN = "YOUR_BOT_TOKEN"; // Замените на токен вашего бота

export default function handler(req, res) {
  if (req.method === 'POST') {
    const authData = req.body;
    const authHash = authData.hash;
    delete authData.hash;

    // Формируем строку проверки: сортируем ключи и объединяем в строку через \n
    const dataCheckArr = Object.keys(authData)
      .sort()
      .map(key => `${key}=${authData[key]}`);
    const dataCheckString = dataCheckArr.join('\n');

    // Вычисляем секретный ключ из токена
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    // Вычисляем хэш
    const computedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Проверяем, что вычисленный хэш совпадает с переданным, и время авторизации не старше 1 дня
    const authDate = Number(authData.auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (computedHash === authHash && (now - authDate) < 86400) {
      res.status(200).json({ status: 'success', message: 'Авторизация пройдена!' });
    } else {
      res.status(403).json({ status: 'error', message: 'Ошибка авторизации' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
