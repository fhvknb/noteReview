# Use the official Node.js runtime as the base image
FROM node:22-alpine 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

