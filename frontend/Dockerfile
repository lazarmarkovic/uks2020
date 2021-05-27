
# 1. Stage - build app
#####################################
FROM node:14.17-alpine as builder

# set working directory
WORKDIR /app

# copy dependency list
COPY ./package.json ./
COPY ./package-lock.json ./

#install app deps
RUN npm install

#copy application source code
COPY ./ .

# build production app and optimize
RUN npm run build



# 2. Stage - run nginx server and server the app
#####################################
FROM nginx:1.21-alpine

# copy nginx configuration
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]