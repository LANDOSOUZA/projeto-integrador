# projeto-integrador - Backend

Este projeto é o backend de um sistema de pedidos de sucos, desenvolvido como parte do Projeto Integrador.

## Funcionalidades

- Cadastro e login de clientes
- Autenticação via token JWT
- Criação de pedidos com limite de 1 a 3 sucos
- Listagem de pedidos por cliente
- Acesso restrito para administradores

## Tecnologias

- Node.js
- Express
- SQLite (com opção futura de migração para MongoDB)
- JWT para autenticação
- GitHub Desktop para versionamento

## Estrutura de pastas

## backend/ 
## ├── controllers/ 
## ├── routes/ 
## ├── middleware/ 
## ├── database/ 
## ├── models/ (opcional para MongoDB) 
## ├── testarBackend.js 
## └── server.js


## Como rodar

## ```bash
## npm install
## node server.js

## Testes manuais
## node testarBackend.js

## Testes com Insomnia
## As rotas da API foram testadas utilizando o Insomnia, garantindo o funcionamento completo do backend:

## POST /cliente/cadastrar → Cadastro de cliente

## POST /cliente/login → Autenticação e geração de token JWT

## POST /pedido/cadastrar → Criação de pedidos com token

## GET /pedido/listar → Listagem de pedidos por cliente

## GET /cliente/perfil → Consulta de perfil autenticado

## Arquitetura de banco de dados híbrida
## Este projeto utiliza dois bancos de dados em conjunto, cada um com uma função específica:

## Banco	Tipo de dados	                    Tabelas recomendadas
## MongoDB	Flexíveis, escaláveis, em nuvem	    Clientes, Histórico, Logs, Perfil
## SQLite	Estruturados, relacionais, locais	Produtos, Pedidos

## Conexão com MongoDB
## A conexão com MongoDB é feita via Mongoose e está configurada em database/mongoConexao.js. 
## Basta rodar o servidor com bash/powershell:
##     node server.js
##     E o terminal exibirá: Conectado ao MongoDB com Mongoose
##     Servidor rodando na porta 27017

## Conexão com SQLite
## A conexão com SQLite é feita usando a biblioteca sqlite3 e é chamada pelo Express para consulta
## ou alteração no banco, está configurada em database/banco.db. 

## Basta rodar o servidor com bash/powershell:
##     node server.js
##     E o terminal exibirá: Conectado ao banco de dados SQLite
##     Servidor rodando na porta 3000

## Autoria: Grupo 2 - Lando, Luiz, Leonardo, João Pedro e Murilo

## Melhorias futuras: Conexão com o MongoDB e/ou SQLite, além da criação do FrontEnd