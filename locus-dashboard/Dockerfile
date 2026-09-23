FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Using dev mode for easy team prototyping and live-reloading
CMD ["npm", "run", "dev"]