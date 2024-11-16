FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create directories
RUN mkdir -p data projects

EXPOSE 3000

CMD ["node", "server.js"]
