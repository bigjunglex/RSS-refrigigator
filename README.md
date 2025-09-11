## 🧊 RSS refrigiration 🧊

### 🚀 Deploy And Forget RSS aggregator

Main goal is to create ready to deploy RSS aggregator for your own use + share with freinds either through CLI or SPA clients

🚧 ⚠️ 🚧  **UNDER CONSTRUCTION** 🚧 ⚠️ 🚧 


### SETUP

- to register new users for rss aggregator
```
npm run start register "NAME" : "PASSWORD"
```
- requires sqlite3 to run ```dev-db``` command

- check CLI commands at registry.ts

- requires .env files both in root directory and in client directory (examples provided)

- modify Caddyfile in .docker/caddy
- Before running docker compose up, you need to bundle client

```
 cd src/client && npm run build
```