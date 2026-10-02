From node:24-bookworm-slim AS frontend-context
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
EXPOSE 5173 
RUN pnpm run build

CMD ["pnpm", "run", "dev"]