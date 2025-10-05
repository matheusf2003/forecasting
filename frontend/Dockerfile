# Usa a imagem oficial mais recente do Node.js
FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia arquivos de dependências primeiro (aproveita cache)
COPY package*.json ./

# Copia o restante do projeto
COPY . .

# Expõe a porta usada pelo Vite
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
