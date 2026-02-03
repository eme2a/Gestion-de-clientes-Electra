FROM node:18-alpine

WORKDIR /app

# Copiamos dependencias primero
COPY package.json ./
RUN npm install --production

# Copiamos el resto
COPY server.js ./
COPY run.sh ./

RUN chmod +x /app/run.sh

EXPOSE 3000

CMD ["/app/run.sh"]
