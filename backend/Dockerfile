FROM node:18-alpine AS build

WORKDIR /app

# Install all dependencies (including dev) to build NestJS
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

# Copy only necessary runtime files
COPY package*.json ./
RUN npm install --omit=dev

# Copy built dist and any runtime assets
COPY --from=build /app/dist ./dist
COPY --from=build /app/nest-cli.json ./nest-cli.json

EXPOSE 3001

CMD ["node", "dist/main.js"]
