FROM node:lts-alpine
WORKDIR /app
RUN npm install -g yarn
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 5173
CMD ["yarn", "run", "dev"]
