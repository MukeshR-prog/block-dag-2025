# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app (if needed)
RUN npm run build || echo "No build script, skipping."

# Expose port (default Next.js port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
