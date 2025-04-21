FROM node:lts

WORKDIR /app

## Create the directory for the SQLite database
RUN mkdir -p /app/database

# Copy package files first for better caching
#COPY ./package.json ./package-lock.json* ./
#RUN npm ci

# Copy the rest of the application
COPY . .

RUN npm run prisma:client:generate

#CMD ["npm", "run", "prisma:client:generate"]

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]