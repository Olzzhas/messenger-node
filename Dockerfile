FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

# docker build -t node-messenger .

# docker run -p 4000:4000 node-messenger
