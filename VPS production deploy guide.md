# VPS Production Deployment Guide for eSIM Mini App

This guide documents the step-by-step production deployment process of the eSIM Mini App frontend on a VPS using Docker, Nginx, and Let's Encrypt SSL. It includes solutions to all major problems encountered and future TODO items.

---

## ✅ Requirements
- A VPS with Ubuntu
- A domain name (e.g. `mini.torounlimitedvpn.com`)
- Docker and Docker Compose installed

---

## 📦 Project Structure
```
/project-root
├── Dockerfile.frontend
├── docker-compose.yml
├── certbot/
│   ├── conf/
│   └── webroot/
├── nginx/
│   ├── conf.d/default.conf
│   └── nginx.conf
└── frontend/  <- your Next.js app
```

---

## ⚙ Step-by-Step Deployment

### 1. 📁 Prepare the Project
- Place your `frontend` code inside `frontend/`
- Put `Dockerfile.frontend`, `docker-compose.yml`, `nginx/`, and `certbot/` in root directory
- Zip your project and upload to VPS:

```bash
scp project.zip root@your-server-ip:/root
```

### 2. 💻 On the VPS
```bash
sudo apt update && sudo apt install unzip
unzip project.zip && cd project-folder
```

### 3. 🔧 Configure Domain in Cloudflare
- Add an **A record** for `mini` pointing to your VPS IP

### 4. 🔐 Set Up SSL with Certbot
Update `docker-compose.yml` under `certbot`:
```yml
command: >
  certbot certonly --webroot --webroot-path=/var/www/certbot \
  --email your@email.com --agree-tos --no-eff-email \
  -d mini.torounlimitedvpn.com
```
Run:
```bash
sudo docker-compose run --rm certbot
```

### 5. 🔄 Update Nginx Config
**File:** `nginx/conf.d/default.conf`
```nginx
server {
  listen 443 ssl;
  server_name mini.torounlimitedvpn.com;

  ssl_certificate /etc/letsencrypt/live/mini.torounlimitedvpn.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/mini.torounlimitedvpn.com/privkey.pem;

  location / {
    proxy_pass http://frontend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

server {
  listen 80;
  server_name mini.torounlimitedvpn.com;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 301 https://$host$request_uri;
  }
}
```

### 6. 🚀 Run Everything
```bash
sudo docker-compose up -d --build
```
Check:
```bash
sudo docker ps
sudo docker logs nginx --tail=50
```
Visit: `https://mini.torounlimitedvpn.com`

---

## 🛠️ Common Issues Solved

| Problem | Solution |
|--------|----------|
| `COPY failed: file not found` | Make sure correct `context` in `docker-compose.yml` and correct paths |
| Port 80 already in use | `sudo lsof -i :80` then `sudo kill <PID>` |
| Nginx fails: cert not found | Ensure Certbot succeeded & filenames match domain |
| Nginx fails: `host not found in upstream backend` | Remove or comment backend section if not used |
| Certbot challenge failed | Ensure `.well-known/acme-challenge` is properly mapped in Nginx |
| `no space left on device` | `sudo apt autoremove && docker system prune -a` |

---

## 🔁 Enable Auto-Renew SSL
```bash
sudo crontab -e
```
Add:
```
0 3 * * 1 docker-compose run --rm certbot renew && docker-compose kill -s HUP nginx
```

---

## 🔮 TODO

### ✅ Backend Integration (TBD)
- Add FastAPI backend container
- Enable `api.example.com` reverse proxy in Nginx
- Connect bot and admin panel

### ✅ GitHub Actions CI/CD (TBD)
- Auto-build and deploy to VPS on push
- Auto-reload containers

---

## ✅ Telegram Mini App Setup
- Go to [BotFather](https://t.me/BotFather)
- Choose your bot → `Edit Menu Button`
- Set URL: `https://mini.torounlimitedvpn.com`