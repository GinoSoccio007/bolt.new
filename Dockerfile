FROM node:18-alpine

WORKDIR /app

# Install required tools
RUN apk add --no-cache git python3 make g++

# Clone the Bolt repository (using the official repo)
RUN git clone --depth=1 https://github.com/mckaywrigley/bolt.git .

# Install dependencies
RUN npm install --production

# Build the application if needed
RUN npm run build || true

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
