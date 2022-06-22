FROM node:14.19.3
RUN mkdir /app
WORKDIR /app
COPY . /app/
RUN npm install

EXPOSE 8000
