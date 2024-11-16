FROM node:18-alpine

WORKDIR /app

# Install necessary tools
RUN apk add --no-cache curl tar

# Download and extract the latest release
RUN curl -L https://github.com/thevahidal/bolt/archive/refs/heads/main.tar.gz | tar xz --strip-components=1

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
