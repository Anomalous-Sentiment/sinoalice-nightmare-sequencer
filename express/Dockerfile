FROM node:16-alpine AS dependency-installer

#Install node and npm
RUN apk add --update nodejs npm

# Copy package json files
COPY package.json /app/
COPY package-lock.json /app/

WORKDIR /app

# Install dependencies
RUN npm install


# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

COPY --from=dependency-installer /app/package.json ./package.json
COPY --from=dependency-installer /app/node_modules ./node_modules
COPY index.js .

# This does not actually expose the port. It's more of a note to the runner that this port is to be exposed.
EXPOSE 3001

# Environment variable. Accessed in nodejs using process.env.PORT
ENV PORT 3001

CMD ["node", "index.js"]