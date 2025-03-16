# Use an official Node.js image as the base image
FROM node:20.0.0

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY package.json package-lock.json ./
COPY streaming.js ./

# Install necessary dependencies
RUN npm install

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Expose the port the WebSocket server will listen to
EXPOSE 5001

# Run the Node.js application
CMD ["node", "streaming.js"]
