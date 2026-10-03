From node:24-bookworm-slim AS frontend-context
WORKDIR /app

RUN corepack enable && corepack install --global pnpm@12.4.2
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# do we really need this build folder as it just sits there if we are running the vite server not the build file ?
RUN pnpm run build

EXPOSE 5173 

CMD ["pnpm", "run", "dev"]