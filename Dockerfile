FROM node:16-alpine AS dependency-installer

#Install node and npm
RUN apk add --update nodejs npm

# Copy package json files
COPY ./sinoalice-nightmare-plotter/package.json /app/
COPY ./sinoalice-nightmare-plotter/package-lock.json /app/

WORKDIR /app

# Install dependencies
RUN npm install

# Builder image
FROM node:16-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage to new image
COPY --from=dependency-installer /app/node_modules ./node_modules

# Copy actual project files in directory to builder image
COPY ./sinoalice-nightmare-plotter .

# Disable telemetry data collection
ENV NEXT_TELEMETRY_DISABLED 1

# Build the project
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]