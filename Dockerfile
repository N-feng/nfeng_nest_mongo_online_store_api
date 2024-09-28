FROM node
COPY . /root/wwwroot/
WORKDIR /root/wwwroot/
EXPOSE 3003
RUN npm install
CMD npm run start:dev