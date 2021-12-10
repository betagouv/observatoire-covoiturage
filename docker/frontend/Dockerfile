FROM node:14.18 as builder
ARG URL_APP
ARG URL_API

RUN mkdir -p /app

WORKDIR /app
COPY ./observatoire/package.json /app
RUN npm ci

COPY ./observatoire /app
RUN URL_API=$URL_API URL_APP=$URL_APP NODE_ENV=production NUXT_TELEMETRY_DISABLED=1 npm run generate 

FROM nginx:1.21-alpine
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html
COPY --chown=nginx:nginx ./docker/frontend/nginx/default.conf /etc/nginx/conf.d
EXPOSE 8080
