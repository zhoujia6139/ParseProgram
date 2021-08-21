
# actual backend image
FROM node:10.15.2-slim
WORKDIR /app/

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git python build-essential

RUN npm i npm@6.5.0 -g
RUN npm i typescript@3.7.4 -g

COPY ./ ./
RUN npm ci && cd backend && npm ci


CMD ["npm", "run", "dev"]
