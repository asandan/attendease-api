FROM node:18-alpine As development

RUN apk update

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

USER node



FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node


FROM node:18-alpine As production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist