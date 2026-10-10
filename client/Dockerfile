# Stage 1 for bulding the project and later use the independent /dist folder via nginx
FROM node:24-bookworm-slim AS client-build
WORKDIR /app
RUN corepack enable && corepack install --global pnpm@12.4.2
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


# Stage 2 : Now we introduce Nginx and just share the /dist folder as the context for the final image
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=client-build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]