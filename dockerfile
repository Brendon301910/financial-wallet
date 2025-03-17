# Usa a imagem do Node.js 20 como base
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install --frozen-lockfile

# Instala o NestJS CLI globalmente (caso necessário)
RUN yarn global add @nestjs/cli

# Copia o restante do código
COPY . .

# Compila o código
RUN yarn build

# Define a variável de ambiente do Prisma
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/financial_wallet?schema=public"

# Roda as migrations e inicia o app
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start"]
