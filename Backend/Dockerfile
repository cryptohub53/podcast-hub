FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose backend port
EXPOSE 5000

# Run the backend server
CMD ["npm", "run", "dev"]
