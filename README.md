# **Financial Wallet API**

Este projeto fornece uma API para gerenciar uma **carteira financeira**, com funcionalidades de **cadastro**, **autenticação**, **transferência de saldo**, **validação** e **reversão de transações**. A API foi construída com foco em segurança, boas práticas e princípios como **SOLID**.

## **Tecnologias Utilizadas**

- **NestJS** - Framework para Node.js
- **Prisma** - ORM para interação com banco de dados
- **Zod** - Biblioteca para validação de dados
- **Winston** - Biblioteca de logging
- **Prometheus** - Sistema de monitoramento
- **Yarn** - Gerenciador de pacotes
- **UUID** - Identificação única de usuários e transações
- **Decimal.js** - Manipulação de valores decimais para transações financeiras

## **Pré-requisitos**

Certifique-se de ter as seguintes ferramentas instaladas:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Yarn](https://yarnpkg.com/) (Caso não tenha, instale com `npm install --global yarn`)

## **Instalação**

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <diretorio_do_repositorio>
   ```

2. Instale as dependências utilizando o Yarn:
   ```bash
   yarn install
   ```

## **Configuração do Ambiente**

Este projeto utiliza variáveis de ambiente para configurar a conexão com o banco de dados. Crie um arquivo `.env` na raiz do projeto com as variáveis a seguir:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wallet?schema=public
```

### **Como rodar o projeto usando Docker**

1. Construa a imagem do Docker:

   ```bash
   docker-compose build
   ```

2. Inicie os containers:
   ```bash
   docker-compose up
   ```

Isso irá subir a aplicação e o banco de dados PostgreSQL dentro de containers Docker.

### **Como rodar a aplicação localmente (fora do Docker)**

Se você preferir rodar a aplicação localmente sem o Docker, após a instalação das dependências, execute:

```bash
yarn start:dev
```

Isso vai rodar o servidor em modo de desenvolvimento na porta `3000` por padrão.

## **Testes**

Para rodar os testes da aplicação, utilize o seguinte comando:

```bash
yarn test
```

## **Monitoramento e Logging**

Este projeto usa **Prometheus** para monitoramento e **Winston** para logging:

- **Prometheus**: Coleta métricas da aplicação, como contagem de requisições e status de erros.
- **Winston**: Gera logs estruturados, permitindo acompanhar o comportamento da aplicação em diferentes ambientes.

## **Rotas e Endpoints**

- **POST /users**: Cria um novo usuário
- **POST /transactions**: Cria uma nova transação
- **POST /reversals**: Cria uma reversão de transação

## **Licença**

Este projeto está licenciado sob a [MIT License](LICENSE).
