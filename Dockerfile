# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et yarn.lock pour installer les dépendances
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copier le reste du code
COPY . .

# Build NestJS
RUN yarn build

# Étape 2 : production
FROM node:20-alpine

WORKDIR /app

# Copier uniquement ce qui est nécessaire
COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Charger les variables d'environnement depuis docker-compose
ENV PORT=8086

# Expose le port
EXPOSE 8086

# Commande pour démarrer l'app
CMD ["node", "dist/main.js"]
