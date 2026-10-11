# ── Stage 1: Build ──────────────────────────────
FROM node:24-bookworm-slim AS build
WORKDIR /app

RUN corepack enable && corepack install --global pnpm@12.4.2
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ── Stage 2: Production runtime ─────────────────
FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack install --global pnpm@12.4.2
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"]