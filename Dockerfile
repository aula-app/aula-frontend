FROM node:22.14-alpine AS assets
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock to install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY public ./public
COPY index.html vite.*.mts tsconfig.json ./
COPY src ./src

# build-docker will use .env.docker with placeholders that should be replaced by the docker-entrypoint.sh
RUN yarn build-docker




# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine-slim AS runtime

# @TODO: nikola - maybe not necessary, i see /run/nxinx.pid
RUN mkdir -p "/run/nginx"

COPY --from=assets /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Replace placeholders in config files
COPY ./docker-entrypoint.sh /docker-entrypoint.d/env.sh
RUN dos2unix "/docker-entrypoint.d/env.sh"
RUN chmod +x "/docker-entrypoint.d/env.sh"
# This is an entrypoint provided by the image, that will invoke any executable files in
#   the /docker-entrypoint.d/ folder
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
