ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base-nodejs:18
FROM $BUILD_FROM

WORKDIR /app

COPY package.json ./

RUN npm install --only=production

COPY server.js ./
COPY run.sh ./

RUN chmod +x /app/run.sh

CMD [ "/app/run.sh" ]
