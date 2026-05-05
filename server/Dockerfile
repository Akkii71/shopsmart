# Stage 1: Install production dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Stage 2: Lean production image
FROM node:18-alpine AS runner

# Non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodeapp -u 1001 -G nodejs

WORKDIR /app

# Copy only production deps from Stage 1
COPY --from=deps --chown=nodeapp:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodeapp:nodejs src/ ./src/

USER nodeapp

EXPOSE 5001

# Healthcheck against the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "src/index.js"]
