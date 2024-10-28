# Stage 1: Build the Angular application
FROM node:22 as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular application (both browser and server builds)
RUN npm run build:ssr

# Stage 2: Serve the application with Node.js
FROM node:22 as node-server

WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist/frontend /app/dist/frontend

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Expose the port where the SSR server will run
EXPOSE 80

# Start the SSR server
CMD ["node", "dist/frontend/server/server.mjs"]
