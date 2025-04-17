✅ Уже реализовано:
 Мини-приложение на Next.js собрано и деплоится на VPS по пушу в ветку dev.

 Настроен GitHub Actions + SSH deploy + Docker.

 Let's Encrypt сертификат (HTTPS) успешно получен и подключён.

 Кнопка Buy eSIM отрендерена корректно.

 Логика разделения frontend / backend в отдельных контейнерах предусмотрена.

 Автодеплой без вмешательства вручную.

 Удалён Logout как не нужный элемент для Mini App.

🔜 Планируем:
🟢 Backend
 Перенести backend (bot.py, server.py, buy_esim.py, support_bot.py, и т.д.) в новый проект.

 Настроить его запуск в Docker-контейнере.

 Подключить backend к NGINX (api.example.com → http://backend:8000).

 Добавить backend в docker-compose.yml.

 Убедиться, что frontend Mini App корректно работает с новым backend API.

🟢 CI/CD улучшения
 Разделить деплой на frontend и backend, чтобы не пересобирать всё при каждом коммите.

 Добавить тесты (линтер, например eslint, или юнит-тесты).

 В будущем: автодеплой backend с main или prod.

🟢 Support Bot Enhancements
 Добавить кнопки Cancel/Top-up в /my_esim.

 Улучшить форматирование и перевод eSIM статусов.

 Добавить cron / автоматический апдейт данных через API.

 Улучшить интеллект бота (уже частично сделано).

 Сделать AI доступным в групповых чатах с ограничениями.

💡 Дополнительно:
 Автообновление SSL через certbot renew (cron или systemd).

 Настроить домен для API: api.torounlimitedvpn.com.