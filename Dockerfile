# Usar uma imagem base oficial do Node.js
FROM node:20-slim AS builder

# Instalar dependências necessárias para o Prisma (openssl)
RUN apt-get update -y && apt-get install -y openssl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências (incluindo devDependencies para o prisma generate)
RUN npm install

# Gerar o cliente Prisma
RUN npx prisma generate

# Copiar o restante do código
COPY . .

# Rodar um clean install apenas para produção para o estágio final
RUN npm prune --production

# --- Estágio de Execução ---
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copiar apenas o necessário do estágio de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Expor a porta que a aplicação usa
EXPOSE 3000

# Variáveis de ambiente padrão (devem ser sobrescritas no Easypanel)
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]
