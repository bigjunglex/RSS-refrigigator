FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY drizzle ./
COPY src/server ./src/server
COPY src/RSScli ./src/RSScli
COPY src/lib ./src/lib
COPY src/config.ts ./src/config.ts

RUN npx tsc --project tsconfig.json

# -------------------------------

FROM node:lts-alpine as production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY .env ./

EXPOSE 8080

CMD [ "node", "./dist/server/index.js" ]