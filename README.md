# Study App Backend

---

## 🇺🇸 English Version

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![NestJS](https://img.shields.io/badge/NestJS-Framework-red?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)

## ✨ About

This is the backend for **Study App**, a platform for organizing study routines with reports for insights, timed sessions, and progress tracking.

The project uses **NestJS**, **Prisma ORM**, and **PostgreSQL**, with JWT authentication and WebSocket for real-time sessions.

---

## 🚀 Features

- **Users**
  - Registration, authentication, and profile updates
  - Profile picture upload
- **Study Subjects**
  - CRUD for subjects
  - Filtering and pagination
- **Study Sessions**
  - Real-time timer via WebSocket
  - Session history with filters and pagination
- **Authentication**
  - Secure JWT for protected routes
- **Documentation**
  - Swagger available at `/api`

---

## 🛠️ Technologies

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Socket.IO](https://socket.io/)
- [Swagger](https://swagger.io/)

---

## ⚙️ How to run locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/study-app-backend.git
   cd study-app-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the database**
   - Copy `.env.example` to `.env` and adjust the variables.
   - Example `.env`:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/studyapp"
     JWT_SECRET="your_secret_key"
     ```

4. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**

   ```bash
   npm run start:dev
   ```

6. **Access**
   - REST API: [http://localhost:3000](http://localhost:3000)
   - Swagger: [http://localhost:3000/api](http://localhost:3000/api)

---

## 💻 WebSocket Usage Example

See [`client/socket-client.html`](client/socket-client.html) for a Socket.IO client example that displays the real-time timer.

---

---

## 🇧🇷 Versão em Português

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![NestJS](https://img.shields.io/badge/NestJS-Framework-red?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)

## ✨ Sobre

Este é o backend do **Study App**, uma plataforma para organização de estudos com relatórios para insights, sessões cronometradas e acompanhamento de progresso.

O projeto utiliza **NestJS**, **Prisma ORM** e **PostgreSQL**, com autenticação JWT e WebSocket para sessões em tempo real.

---

## 🚀 Funcionalidades

- **Usuários**
  - Cadastro, autenticação e alteração de dados
  - Upload de foto de perfil
- **Assuntos de estudo**
  - CRUD de assuntos
  - Filtros e paginação
- **Sessões de estudo**
  - Cronômetro em tempo real via WebSocket
  - Histórico de sessões com filtros e paginação
- **Autenticação**
  - JWT seguro para rotas protegidas
- **Documentação**
  - Swagger disponível em `/api`

---

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Socket.IO](https://socket.io/)
- [Swagger](https://swagger.io/)

---

## ⚙️ Como rodar localmente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/study-app-backend.git
   cd study-app-backend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   - Copie `.env.example` para `.env` e ajuste as variáveis.
   - Exemplo de `.env`:
     ```
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/studyapp"
     JWT_SECRET="sua_chave_secreta"
     ```

4. **Rode as migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor**

   ```bash
   npm run start:dev
   ```

6. **Acesse**
   - API REST: [http://localhost:3000](http://localhost:3000)
   - Swagger: [http://localhost:3000/api](http://localhost:3000/api)

---

## 💻 Exemplo de uso do WebSocket

Veja o arquivo [`client/socket-client.html`](client/socket-client.html) para um exemplo de cliente Socket.IO que exibe o cronômetro em tempo real.
