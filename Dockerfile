FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy package.json first
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
