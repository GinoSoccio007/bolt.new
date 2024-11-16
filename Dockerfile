FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat git

WORKDIR /app

# Clone the official Bolt repository
RUN git clone https://github.com/thevahidal/bolt.git .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
