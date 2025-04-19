# Use the official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create and seed the database (adjust as needed)
# For example, if you have a SQL script:
# COPY init.sql /docker-entrypoint-initdb.d/
# Or run commands directly:
# RUN npx prisma migrate dev --name initial_migration && npx prisma db seed

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
