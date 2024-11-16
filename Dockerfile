FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create project directory
RUN mkdir -p projects

EXPOSE 3000

CMD ["node", "server.js"]
