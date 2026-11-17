FROM node:lts-alpine
WORKDIR /app
RUN npm install -g yarn
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["sh", "bin/startup.sh"]