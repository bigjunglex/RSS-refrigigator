![test-badge-ci](https://github.com/bigjunglex/RSS-refrigigator/actions/workflows/tests.yml/badge.svg)

## 🧊 RSS refrigiration 🧊

### 🚀 Deploy And Forget RSS aggregator

Main goal is to create ready to deploy RSS aggregator for your own use + share with freinds either through CLI or SPA clients

🚧 ⚠️ 🚧  **UNDER CONSTRUCTION** 🚧 ⚠️ 🚧 


### SETUP

- to register new users for rss aggregator
```
npm run start register "NAME" : "PASSWORD"
```
- requires sqlite3 to run ```npm run dev-db``` command

- check CLI commands at registry.ts

- requires .env files both in root directory and in client directory (examples provided)

- Caddyfile to modify in .docker/caddy directory
- Before running docker compose up, you need to bundle client

```
    npm run build-client
```

- to run Cli service for adding user, starting aggregation or using CLI browse, etc : 
```
docker compose run cli (registered command)
```