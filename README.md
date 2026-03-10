# ReactGram - Sistema de Rede Social

https://github.com/user-attachments/assets/9c73c7b5-0764-4bd4-9e1c-56f318b1b6cc

## 📖 Sobre o projeto:
Sistema de rede social que permite aos usuários publicar fotos, curtir posts e interagir com outros usuários. O projeto foi desenvolvido com React no frontend e Node.js no backend, além de autenticação com JWT e testes automatizados para backend e frontend, alcançando aproximadamente 80% de cobertura de código.

## 🚀 Tecnologias utilizadas:
- **ReactJS**
  
- **JavaScript**
  
- **Redux**
  
- **Jest**

- **Supertest**
  
- **Tailwind CSS**
  
- **NodeJS**

- **MongoDB**

- **Mongoose**

- **Multer (upload de arquivos)**

- **Express Validator**

## 📂 Funcionalidades:

- **Cadastro e autenticação de usuários com JWT**

- **Login e logout de usuários**
  
- **Publicação de fotos**
  
- **Upload de imagens com Multer**
  
- **Curtidas em posts e comentários**
  
- **Sistema de comentários em publicações e respostas a comentários**

- **Chat entre usuários para troca de mensagens**
  
- **Edição de perfil do usuário**
  
- **Visualização de perfil de outros usuários**
  
- **Feed com publicações de usuários**
  
- **Validação de dados nas requisições com Express Validator**
  
- **API REST para comunicação entre frontend e backend**
  
- **Testes automatizados no frontend e backend**
  
- **Documentação da API com Swagger**

  ## ⚙️ Como rodar:

- **Clonar o repositório:**
```bash
git clone https://github.com/EduardoAguiar15/ReactGram.git
```

- **Entrar na pasta backend:**
```bash
cd backend
```

- **Instalar dependências (dentro de backend):**
```bash
npm install
```

- **Na raiz do projeto criar o arquivo ".env" ***(Exemplo)***:**
```bash
PORT=5000
DB_NAME=dbnameexample
JWT_SECRET=jwtsecretexample
```

- **Rodar o servidor backend:**
```bash
npm run server
```

- **Abrir um novo terminal e entrar na pasta frontend:**
```bash
cd frontend
```

- **Instalar dependências (dentro de frontend):**
```bash
npm install
```

- **Rodar o servidor frontend:**
```bash
npm start
```
- **Documentação:**
```bash
http://localhost:5000/api-docs/
```

## ⚙️ Como rodar os testes:

- **Entrar na pasta backend:**
```bash
cd backend
```

- **Na raiz do projeto criar o arquivo ".env.test" ***(Exemplo)***:**
```bash
PORT=5001
DB_NAME=dbnametest
JWT_SECRET=jwtsecrettest
```

- **Rodar os testes do backend:**
```bash
npm run test
```

- **Abrir um novo terminal e entrar na pasta frontend:**
```bash
cd frontend
```

- **Rodar os testes do frontend:**
```bash
npm test
```
