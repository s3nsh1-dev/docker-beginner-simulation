From node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=development

RUN corepack enable && corepack install --global pnpm@12.4.2
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 5000
CMD ["pnpm", "run","start"]