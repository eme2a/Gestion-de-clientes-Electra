ARG BUILD_FROM=node:18-alpine
FROM $BUILD_FROM

WORKDIR /app

# Copiamos package.json primero
COPY package.json ./

# Instalamos dependencias
RUN npm install --production

# Copiamos el resto
COPY server.js ./
COPY run.sh ./

RUN chmod +x /app/run.sh

CMD [ "/app/run.sh" ]
