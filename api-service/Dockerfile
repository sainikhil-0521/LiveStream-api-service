# Use the official Node.js 20 image as the base image
FROM node:20.0.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the working directory first
# This allows us to install dependencies without copying all the files yet (this optimizes caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on (if your app listens on a specific port)
EXPOSE 8080

# Command to run the app
CMD ["npm", "start"]
