# Use the official Node.js runtime as the base image
FROM node:22-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build


FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev
# COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]

