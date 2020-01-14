# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM node:10-alpine as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install

RUN npm ci

#RUN ng add @progress/kendo-angular-editor 

COPY ./ /app/


RUN npm rebuild node-sass

RUN npm run build -- --output-path=./dist

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=build-stage /app/dist/ /usr/share/nginx/html/

