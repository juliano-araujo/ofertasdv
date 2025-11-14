# OfertasDV

Sistema de gerenciamento de ofertas comerciais com autenticação JWT, aprovação de ofertas e auditoria de ações.

## 📋 Sobre o Projeto

O OfertasDV é uma aplicação full-stack composta por:
- **Backend**: API REST em Spring Boot (Java 21) com PostgreSQL
- **Frontend**: Interface web em Next.js (React/TypeScript)
- **Banco de Dados**: PostgreSQL 16

O sistema permite que comerciantes cadastrem ofertas, administradores aprovem/rejeitem ofertas, e todos os usuários visualizem ofertas aprovadas.

## 🚀 Como Iniciar o Projeto com Docker Compose

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Docker](https://docs.docker.com/get-docker/) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)

Para verificar se estão instalados corretamente:
```bash
docker --version
docker compose version
```

### Iniciar a Aplicação

1. Clone o repositório:
```bash
git clone https://github.com/juliano-araujo/ofertasdv.git
cd ofertasdv
```

2. Inicie todos os serviços com Docker Compose:
```bash
docker compose up --build
```

Ou para executar em segundo plano (modo detached):
```bash
docker compose up --build -d
```

3. Aguarde a inicialização completa dos serviços. O processo pode levar alguns minutos na primeira execução devido ao download das imagens e build das aplicações.

### Acessar a Aplicação

Após a inicialização, os serviços estarão disponíveis em:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Banco de Dados**: localhost:5432
  - Database: `ofertasdb`
  - Usuário: `postgres`
  - Senha: `postgres`

### Parar a Aplicação

Para parar todos os serviços:
```bash
docker compose down
```

Para parar e remover os volumes (dados do banco serão perdidos):
```bash
docker compose down -v
```

### Visualizar Logs

Para ver os logs de todos os serviços:
```bash
docker compose logs -f
```

Para ver logs de um serviço específico:
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

## 🛠️ Comandos Úteis

### Reconstruir as Imagens

Se você fez alterações no código e precisa reconstruir:
```bash
docker compose up --build
```

### Verificar Status dos Containers

```bash
docker compose ps
```

### Acessar o Shell de um Container

```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# Banco de dados
docker compose exec db psql -U postgres -d ofertasdb
```

### Reiniciar um Serviço Específico

```bash
docker compose restart backend
docker compose restart frontend
docker compose restart db
```

## 📚 Documentação das APIs

### Endpoints Principais

**Autenticação** (`/api/auth`):
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário

**Ofertas** (`/api/ofertas`):
- `GET /api/ofertas` - Listar ofertas (com paginação e filtros)
- `POST /api/ofertas` - Criar nova oferta (multipart/form-data)
- `POST /api/ofertas/{id}/aprovar` - Aprovar oferta
- `POST /api/ofertas/{id}/rejeitar` - Rejeitar oferta

**Usuários** (`/api/usuarios`):
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/{id}` - Buscar usuário por ID

**Auditoria** (`/api/auditoria`):
- `GET /api/auditoria` - Histórico de ações
- `GET /api/auditoria/oferta/{id}` - Auditoria de uma oferta específica

Para mais detalhes sobre a API, consulte o [README do backend](./backend/README.md).

## 🔧 Solução de Problemas

### Porta já em uso

Se você receber erros sobre portas já em uso, verifique se há outros serviços rodando nas portas 3000, 8080 ou 5432:

```bash
# Linux/macOS
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5432

# Windows (PowerShell)
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :5432
```

### Erro de conexão com o banco de dados

Se o backend não conseguir conectar ao banco:
1. Verifique se o container do PostgreSQL está rodando: `docker compose ps`
2. Aguarde alguns segundos para o healthcheck do banco passar
3. Reinicie o backend: `docker compose restart backend`

### Problemas de build

Se houver erros durante o build:
1. Limpe os containers e volumes antigos:
```bash
docker compose down -v
docker system prune -a
```
2. Tente novamente:
```bash
docker compose up --build
```

### Frontend não carrega a API

Certifique-se de que a variável `NEXT_PUBLIC_API_URL` está configurada corretamente no docker-compose.yml (padrão: `http://localhost:8080`).

## 🏗️ Arquitetura dos Serviços

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │
│   (Spring Boot) │
│   Port: 8080    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Port: 5432    │
└─────────────────┘
```

## 📦 Estrutura do Projeto

```
ofertasdv/
├── backend/           # API REST Spring Boot
│   ├── src/           # Código fonte Java
│   ├── Dockerfile     # Dockerfile do backend
│   └── pom.xml        # Dependências Maven
├── frontend/          # Aplicação Next.js
│   ├── src/           # Código fonte TypeScript/React
│   ├── Dockerfile     # Dockerfile do frontend
│   └── package.json   # Dependências npm
└── docker-compose.yml # Orquestração dos serviços
```

## 🧑‍💻 Desenvolvimento

Para desenvolvimento local sem Docker, consulte:
- [Backend README](./backend/README.md) - Instruções para rodar o Spring Boot localmente
- [Frontend README](./frontend/README.md) - Instruções para rodar o Next.js localmente

## 📝 Variáveis de Ambiente

As principais variáveis de ambiente já estão configuradas no `docker-compose.yml`:

**Backend**:
- `DB_URL`: URL de conexão com PostgreSQL
- `DB_USERNAME`: Usuário do banco
- `DB_PASSWORD`: Senha do banco
- `JPA_DDL_AUTO`: Modo de atualização do schema (update)

**Frontend**:
- `NEXT_PUBLIC_API_URL`: URL da API backend
- `NODE_ENV`: Ambiente de execução (production)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico na UTFPR.

---

**Desenvolvido com ❤️ na UTFPR**
