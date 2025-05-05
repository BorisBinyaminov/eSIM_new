This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 1. Stop all running containers
docker stop $(docker ps -q)

# 2. Remove all containers
docker rm $(docker ps -aq)

# 3. Remove all unused volumes
docker volume prune -f

# 4. Remove all unused networks
docker network prune -f

# 5. Remove all dangling images (intermediate build layers)
docker image prune -f

# 6. Remove all unused images (not just dangling)
docker image prune -a -f

# 7. Remove all build cache
docker builder prune -af
