# Use a Node image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build the project
RUN npm run build

# --- Production image ---
FROM node:20-alpine

WORKDIR /app

# Copy build output and dependencies
COPY --from=builder /app ./

# Expose frontend port (React = 3000)
EXPOSE 3000

# Run development or production server
CMD ["npm", "start"]
