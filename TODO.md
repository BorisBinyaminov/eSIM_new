
🟢 Backend
 Перенести backend (bot.py, server.py, buy_esim.py, support_bot.py, и т.д.) в новый проект.

 Настроить его запуск в Docker-контейнере.

 Подключить backend к NGINX (api.example.com → http://backend:8000).

 Добавить backend в docker-compose.yml.

 Убедиться, что frontend Mini App корректно работает с новым backend API.

🟢 CI/CD улучшения
 Разделить деплой на frontend и backend, чтобы не пересобирать всё при каждом коммите.
