# Build stage
FROM node:20.12.1-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Increase Node.js memory limit and build the React application
ENV NODE_OPTIONS="--max_old_space_size=4096"
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built React app to the Nginx container
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]