FROM node:17-alpine as builder
WORKDIR /
COPY package.json ./
COPY package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
