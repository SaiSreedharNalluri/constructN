FROM node:14-alpine as BUILD_IMAGE
WORKDIR /my-project
COPY package*.json ./
RUN npm install --production
RUN npm prune --production
# RUN npm install -g pm2

FROM node:14-alpine as builder
WORKDIR /my-project
# COPY . .
COPY --from=BUILD_IMAGE /my-project/node_modules ./node_modules
COPY --from=BUILD_IMAGE /my-project/package.json ./package.json
COPY .next /my-project/.next
COPY public /my-project/public
COPY next.config.js /my-project/
# RUN npm run build


FROM node:14-alpine as runner
WORKDIR /my-project
COPY .env.development ./.env
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /my-project/public ./public
COPY --from=builder /my-project/.next ./.next
COPY --from=builder /my-project/node_modules ./node_modules
COPY --from=builder /my-project/package.json ./package.json
RUN npm install -g pm2
COPY run.sh /my-project/

EXPOSE 3000
CMD ["/my-project/run.sh"]