FROM node:18

RUN apt-get update && \
    apt-get install -y lua5.1 git

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN git clone https://github.com/levno-710/Prometheus.git

EXPOSE 3000

CMD ["node", "server.js"]
