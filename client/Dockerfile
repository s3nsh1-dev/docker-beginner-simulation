# Stage 1: Build the Vite React bundle into /app/dist
FROM node:24-bookworm-slim AS client-build
WORKDIR /app
RUN corepack enable && corepack install --global pnpm@12.4.2
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


# Stage 2: Serve static /dist bundle and proxy /api via Vite preview
FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV API_TARGET=http://server:5000

RUN corepack enable && corepack install --global pnpm@12.4.2
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod && chown -R node:node /app
COPY --chown=node:node --from=client-build /app/dist ./dist
COPY --chown=node:node vite.config.ts ./vite.config.ts

USER node

EXPOSE 3000
CMD ["./node_modules/.bin/vite", "preview"]