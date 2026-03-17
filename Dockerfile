# Stage 1: Build
FROM node:20-alpine AS build

# Instalar dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Instalar dependências primeiro para cachear camadas
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copiar o resto do código
COPY . .

# Gerar o Prisma Client e fazer o build para produção
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

# Instalar dependências do sistema necessárias para o Prisma no runtime
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiar apenas os arquivos necessários do build
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Expor a porta 3000
EXPOSE 3000

CMD ["npm", "start"]
