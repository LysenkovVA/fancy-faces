# Use Node.js as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Install PostgreSQL
RUN apk add --no-cache postgresql postgresql-client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY .. .

# Create a directory for PostgreSQL data
RUN mkdir -p /var/lib/postgresql/data
RUN chown -R postgres:postgres /var/lib/postgresql/data

# Make the entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose ports
EXPOSE 3000 5432

# Set entrypoint
#ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Start Next.js
CMD ["npm", "run", "dev"]
