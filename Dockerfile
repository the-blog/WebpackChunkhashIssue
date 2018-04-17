FROM node:8

ADD . /home/node/project

WORKDIR /home/node/project

RUN chown -R node: /home/node/project

USER node

RUN yarn install

RUN yarn build

RUN ls -a public/assets | sort
