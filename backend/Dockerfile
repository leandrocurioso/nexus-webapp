# 1. Use an official Node.js runtime as a parent image
# 'alpine' is a tiny Linux distro that keeps the image size small
FROM node:24-alpine

ARG SERVER_API_HOST
ENV SERVER_API_HOST=$SERVER_API_HOST

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json first
# This allows Docker to cache your dependencies if the files haven't changed
COPY package*.json ./

# 4. Copy the rest of your application code
COPY . .

# 5. Copy the rest of your application code
RUN rm -rf node_modules
RUN rm -rf Dockerfile

# 6. Install dependencies
# 'npm ci' is faster and more reliable for automated environments than 'npm install'
RUN npm ci --only=production

# 7. Expose the port your Express app runs on (usually 3000)
EXPOSE 3010

# 8. Define the command to run your app
CMD [ "node", "server.js" ]