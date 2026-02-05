FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY server.js ./
COPY run.sh ./

RUN chmod +x /app/run.sh

CMD ["/app/run.sh"]
