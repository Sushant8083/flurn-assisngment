FROM node:18-alpine
WORKDIR /flurn
COPY . .
RUN npm install --production
CMD ["node", "bin/www"]
EXPOSE 3000