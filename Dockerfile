FROM node:18-bullseye

WORKDIR /app

# Install required dependencies for WebContainer
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@9.4.0

# Clone WebContainer-based Bolt
RUN git clone https://github.com/stackblitz/webcontainer-core.git .

# Install dependencies
RUN pnpm install

# Build the application
RUN pnpm run build

# Create workspace directory
RUN mkdir -p /app/workspace

EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
