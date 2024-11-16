FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json .
COPY server.js .

# Install dependencies including health check tools
RUN apk add --no-cache wget \
    && npm install

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
