FROM node:20.16-alpine3.19

WORKDIR /build

COPY package*.json .

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
# docker build -t elearning-server:latest .