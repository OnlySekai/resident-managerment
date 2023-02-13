FROM node:16

COPY . .

WORKDIR .

RUN yarn 

CMD ['yarn', 'start']

EXPOSE 3001