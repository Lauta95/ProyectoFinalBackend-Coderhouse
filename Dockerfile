FROM node

WORKDIR /app

COPY pagackage*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]