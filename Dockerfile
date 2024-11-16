FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git python3 make g++ wget

# Clone the Stackblitz Bolt repository
RUN git clone https://github.com/stackblitz/bolt.git .

# Install pnpm
RUN npm install -g pnpm@9.4.0

# Install dependencies
RUN pnpm install

# Build the application
RUN pnpm run build

EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
