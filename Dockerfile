FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json .
COPY server.js .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
