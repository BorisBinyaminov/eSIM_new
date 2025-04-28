FROM python:3.11-slim

# backend/Dockerfile

# 1. Use a lightweight Node image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy dependency manifests and install
COPY package*.json ./
RUN npm install --production

# 4. Copy the rest of your backend code
COPY . .

# 5. Expose the port your backend listens on
EXPOSE 4000

# 6. Start your app
CMD ["npm", "start"]

