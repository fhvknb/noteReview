# Use the official Node.js 20 image as the base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the Next.js application files to the working directory
COPY . .

# Build the Next.js application for production
RUN npm run build

# Use the official Node.js 20 image as the base image for the production environment
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files from the base image to the working directory
COPY package*.json ./

# Install only the production dependencies
RUN npm install --omit=dev

# Copy the Next.js application files from the base image to the working directory
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./next.config.js

# Expose the port that the Next.js application will listen on
EXPOSE 9002

# Start the Next.js application in production mode
CMD ["npm", "start"]
