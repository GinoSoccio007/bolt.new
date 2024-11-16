FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy package files first
COPY package.json .
COPY package-lock.json .
COPY server.js .
COPY public ./public

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
