# Base Image with RTMP module
FROM alfg/nginx-rtmp

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for HLS streaming files
RUN mkdir -p /mnt/hls && chmod -R 777 /mnt/hls

# Expose Ports
EXPOSE 1935 8081

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
