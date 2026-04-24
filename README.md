# Hefestto

Aplicacao full stack para publicar e exibir projetos de arquitetura.

## Requisitos

- Node.js
- MongoDB local ou MongoDB Atlas

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run seed:admin
```

## MongoDB Atlas

No Atlas, crie um cluster, um usuario de banco e copie a string de conexao. Use a string em `MONGO_URI`, trocando usuario, senha e nome do banco:

```env
MONGO_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/hefestto?retryWrites=true&w=majority
```

## Variaveis de ambiente

Backend (`backend/.env`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hefestto
JWT_SECRET=troque-este-segredo
CORS_ORIGIN=http://localhost:5173
AUTO_CREATE_ADMIN=true
DEFAULT_ADMIN_NAME=Administrador Hefestto
DEFAULT_ADMIN_EMAIL=admin@hefestto.com.br
DEFAULT_ADMIN_PASSWORD=Hefestto@2026
RESET_ADMIN_PASSWORD=false
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_ARCHITECT_NAME=Kevyn Sousa
VITE_CONTACT_EMAIL=
VITE_CONTACT_WHATSAPP=+5562992597569
VITE_CONTACT_INSTAGRAM=@arquitetokevynsousa
```

O painel fica em `/admin`. O cadastro publico foi removido; use o admin padrao configurado nas variaveis acima. Para resetar a senha do admin existente, defina `RESET_ADMIN_PASSWORD=true`, rode o backend uma vez ou execute `npm run seed:admin`, e depois volte para `false`.
