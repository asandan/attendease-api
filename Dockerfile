FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY . .

RUN npm install 

EXPOSE 3000

CMD ["npm", "run","start:dev"]