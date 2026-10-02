From node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=development
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]