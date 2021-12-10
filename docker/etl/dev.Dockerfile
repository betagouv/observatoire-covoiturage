FROM node:14.16.1

RUN apt-get update && apt-get install -y p7zip-full \
  && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /etl
COPY ./package.json /etl
RUN npm install