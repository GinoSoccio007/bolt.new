FROM node:18-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
