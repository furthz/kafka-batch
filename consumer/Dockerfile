############## STAGE BASE #############
FROM node:14-alpine as base
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm config list \
    && npm ci \
    && npm cache clean --force
##COPY . .
##RUN npm build
##COPY . .
##CMD ["npm", "start"]

############## STAGE BUILD #############
FROM base as build
ENV NODE_ENV=development
ENV PATH=/usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app
RUN npm install --only=development
COPY . .
RUN npm run build

############## STAGE DEV #############
FROM build as dev
ENV NODE_ENV=development
WORKDIR /usr/src/app
CMD ["npm","run", "start"]
##RUN npm run build
