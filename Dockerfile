
# actual backend image
FROM node:12.14.1-slim
WORKDIR /app/

RUN npm i npm@7.20.0 -g
RUN npm i typescript@3.7.4 -g

COPY ./ /app/
RUN npm ci && cd backend && npm ci


CMD ["npm", "run", "dev"]
