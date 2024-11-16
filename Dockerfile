FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache git

RUN git clone https://github.com/thevahidal/bolt.git .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
