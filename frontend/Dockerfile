FROM node:20.10-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

FROM node:20.10-alpine

WORKDIR /app

# COPY --from=build /app/next.config.js ./next.config.js
# COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD [ "npm", "run", "start" ]