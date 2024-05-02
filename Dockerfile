FROM node:18.12.0-alpine as builder

WORKDIR /application

COPY package.json .
COPY firebase.json .
COPY firestore.rules .
COPY firestore.indexes.json .
COPY nuxt.config.ts .
COPY yarn.lock .
COPY tsconfig.json .
COPY database.rules.json .
COPY app.vue .
COPY stores stores
COPY public public
COPY pages pages
COPY middleware middleware
COPY locales locales
COPY interfaces interfaces
COPY composables composables
COPY components components
COPY assets assets
COPY app app



RUN yarn install  \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

RUN export NODE_OPTIONS="--max-old-space-size=20480"

RUN yarn build

RUN yarn generate

RUN yarn postinstall

FROM node:18.12.0-alpine

WORKDIR /application

COPY --from=builder /application  .

ENV HOST 0.0.0.0
EXPOSE 3000

CMD [ "yarn", "start" ]
