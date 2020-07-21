FROM node:10.21.0-alpine3.11
WORKDIR /client

COPY package*.json ./
# RUN npm install
EXPOSE 3000

COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "run", "docker:prod"]
HEALTHCHECK --start-period=30s --interval=2m CMD wget --quiet --tries=1 localhost:3000/health  -O /dev/null || exit 1