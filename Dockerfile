# NexDrive USB Website & Admin Dashboard
# Optional Container Deployment (Node.js LTS Alpine)
FROM node:22-alpine

WORKDIR /app

# Copy all project files into container
COPY . .

# Ensure data and uploads directories exist with proper write permissions
RUN mkdir -p data uploads

# Expose standard web port
EXPOSE 3000

# Start pure Node.js HTTP & SQLite server
CMD ["node", "server.js"]
