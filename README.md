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

## Autoria: Grupo 2 - Lando, Luiz, Leonardo, João Pedro e Murilo

## Melhorias futuras: Conexão com o MongoDB e Criação do BackEnd

