FROM node:14.18 as builder

RUN mkdir -p /app

WORKDIR /app
COPY ./package.json /app
RUN npm ci

COPY . /app
RUN npm run build 

FROM node:14.18-alpine3.14
RUN apk add p7zip
RUN mkdir -p /app && chown -R node:node /app
COPY --chown=node:node --from=builder /app /app

USER node
WORKDIR /app
CMD ["npm", "run", "start"]
