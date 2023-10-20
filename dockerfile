FROM node:14
COPY package*.json /root/file/
COPY . /root/file/
WORKDIR /root/file/ 
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
