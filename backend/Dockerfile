# Usa a imagem oficial mais recente do Python
FROM python:latest

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY requirements.txt .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copie todo o resto do código do backend para o diretório de trabalho
COPY . .

# Exponha a porta que o Flask vai usar
EXPOSE 5000

# Comando para iniciar a aplicação quando o container for executado
# O host 0.0.0.0 é essencial para que a aplicação seja acessível de fora do container
CMD ["flask", "run", "--host=0.0.0.0"]