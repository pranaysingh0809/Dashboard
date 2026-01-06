FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the built application from the builder stage
COPY --from=builder /app/dist dist
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/vite.config.ts vite.config.ts
COPY --from=builder /app/node_modules node_modules

# Expose port
EXPOSE 3010

# Start the application using vite preview for production
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3010"]

