🔌 Conexão com o TIA Portal (IP e comandos no terminal)
Identificar o IP do CLP

No TIA Portal, ao configurar o hardware, você define o endereço IP do CLP (ex.: 192.168.0.10).

Esse IP precisa estar na mesma faixa da sua máquina (ex.: 192.168.0.x).

Configurar a rede local

No Windows, ajuste a placa de rede para estar na mesma sub-rede.

Exemplo:

IP do PC: 192.168.0.20

Máscara: 255.255.255.0

Gateway: 192.168.0.1 (se houver).

Testar a comunicação via terminal

Abra o PowerShell ou CMD:

bash
ping 192.168.0.10
Se responder, a conexão física está ok.

Verificar portas abertas (opcional)

Usar telnet ou nc (Linux) para testar se a porta do servidor está acessível:

bash
telnet 192.168.0.10 102
Porta 102 é padrão para comunicação S7 (Siemens).

👉 Esse passo garante que seu backend conseguirá se comunicar com o CLP via bibliotecas (ex.: node-snap7 ou python-snap7).

🌐 Rotas REST para testar no Insomnia
Supondo que seu backend já expõe uma API (Node.js/Express), você pode organizar rotas como:

Método	Rota	Descrição	Exemplo de corpo (JSON)
GET	/api/pedidos	Lista todos os pedidos	—
POST	/api/pedidos	Cria um novo pedido	{ "produtoId": 1, "quantidade": 10 }
PUT	/api/pedidos/:id	Atualiza status do pedido	{ "status": "em_producao" }
GET	/api/produtos	Lista produtos disponíveis	—
POST	/api/produtos	Adiciona novo produto	{ "nome": "Motor", "estoque": 50 }
GET	/api/usuarios	Lista usuários	—
POST	/api/usuarios/login	Login de usuário	{ "email": "teste@teste.com", "senha": "1234" }
🚀 Fluxo prático no Insomnia
Configure a base URL do seu backend (ex.: http://localhost:3000).

Crie requisições para cada rota.

Teste primeiro os GET (para ver dados).

Depois use POST/PUT para enviar comandos e verificar se o backend responde corretamente.

Se o backend estiver integrado ao CLP via TIA Portal, ao atualizar status de pedido (PUT /api/pedidos/:id), o backend deve enviar o comando para o CLP (via IP/porta 102).

🎯 Resultado:

Você garante a comunicação com o CLP pelo IP configurado no TIA Portal.

No Insomnia, consegue simular todo o fluxo de pedidos, produtos e usuários via rotas REST.

O backend faz a ponte entre as rotas e os comandos enviados ao CLP.

👉 Quer que eu te monte um roteiro de testes no Insomnia já com exemplos de requisições (GET, POST, PUT) prontos para copiar e colar?

Faltou - o login - que é a primeira coisa a fazer - bote os http/;//localhost/cliente/login -- e os demais.
Confira meu raciocínio
Conexão com TIA Portal e CLP por IP
Para o backend falar com o CLP via TIA Portal, primeiro garanta que a rede está correta e a porta S7 está acessível.

IP do CLP: defina no TIA Portal (ex.: 192.168.0.10) e mantenha seu PC na mesma sub-rede (ex.: 192.168.0.20/255.255.255.0).

Teste de rede (PC → CLP):

bash
ping 192.168.0.10
Teste da porta S7 (102):

bash
telnet 192.168.0.10 102
Base URL do backend: use http://localhost:3000 (ou a porta configurada no seu server).

Dica: se o ping e a porta 102 responderem, o backend (por exemplo, com snap7) conseguirá ler/escrever áreas de memória do CLP.

Login e autenticação
O login é o primeiro passo. Após autenticar, use o token em todas as rotas protegidas via cabeçalho Authorization.

Endpoint de login (cliente): POST http://localhost/cliente/login

json
{
  "email": "usuario@exemplo.com",
  "senha": "minha_senha"
}
Resposta esperada:

json
{
  "token": "jwt_gerado",
  "usuario": {
    "id": 1,
    "nome": "Lando",
    "perfil": "admin"
  }
}
Endpoint de logout (cliente): POST http://localhost/cliente/logout

json
{
  "token": "jwt_gerado"
}
Cadastro (opcional): POST http://localhost/cliente/register

json
{
  "nome": "Lando",
  "email": "usuario@exemplo.com",
  "senha": "minha_senha"
}
Cabeçalhos após login: Authorization: Bearer jwt_gerado Content-Type: application/json

Rotas de pedidos
Listar pedidos: GET http://localhost/api/pedidos

Criar pedido: POST http://localhost/api/pedidos

json
{
  "produtoId": 1,
  "quantidade": 10,
  "prioridade": "normal"
}
Atualizar status do pedido (aciona lógica do CLP): PUT http://localhost/api/pedidos/123

json
{
  "status": "em_producao"
}
Detalhar um pedido: GET http://localhost/api/pedidos/123

Rotas de produtos
Listar produtos: GET http://localhost/api/produtos

Criar produto: POST http://localhost/api/produtos

json
{
  "nome": "Motor 0.75kW",
  "codigo": "MTR075",
  "estoque": 50
}
Atualizar produto: PUT http://localhost/api/produtos/7

json
{
  "estoque": 42
}
Rotas de usuários
Listar usuários (admin): GET http://localhost/api/usuarios

Detalhar usuário: GET http://localhost/api/usuarios/1

Atualizar perfil/role (admin): PUT http://localhost/api/usuarios/1

json
{
  "perfil": "operador"
}
Sequência de testes no Insomnia
Passo 1 — Login: POST http://localhost/cliente/login Body: email e senha. Resultado: copie o token JWT.

Passo 2 — Configurar cabeçalho: Authorization: Bearer seu_token_jwt Content-Type: application/json

Passo 3 — Fluxo dos pedidos:

GET http://localhost/api/pedidos Objetivo: ver lista inicial.

POST http://localhost/api/pedidos Objetivo: criar pedido.

PUT http://localhost/api/pedidos/:id Objetivo: mudar para em_producao (dispara integração com CLP se ativa).

GET http://localhost/api/pedidos/:id Objetivo: confirmar status.

Passo 4 — Produtos e estoque:

GET http://localhost/api/produtos

POST http://localhost/api/produtos

PUT http://localhost/api/produtos/:id

Passo 5 — Usuários (se perfil admin):

GET http://localhost/api/usuarios

PUT http://localhost/api/usuarios/:id

Se quiser, te mando um export do Insomnia com essas rotas já prontas para importar.

Acho que primeiro é cadastra, né?
Exatamente, Lando 👌 — o fluxo natural começa pelo cadastro do cliente/usuário, e só depois vem o login. Assim você garante que o usuário existe no banco e pode autenticar.

🔑 Fluxo completo de autenticação
1. Cadastro (primeiro passo)
Endpoint: POST http://localhost/cliente/register

Body (JSON):

json
{
  "nome": "Lando Souza",
  "email": "lando@teste.com",
  "senha": "123456"
}
Resposta esperada:

json
{
  "id": 1,
  "nome": "Lando Souza",
  "email": "lando@teste.com",
  "perfil": "cliente"
}
2. Login (segundo passo)
Endpoint: POST http://localhost/cliente/login

Body (JSON):

json
{
  "email": "lando@teste.com",
  "senha": "123456"
}
Resposta esperada (gera token JWT):

json
{
  "token": "jwt_gerado",
  "usuario": {
    "id": 1,
    "nome": "Lando Souza",
    "perfil": "cliente"
  }
}
👉 Esse token precisa ser usado em todas as requisições seguintes, no cabeçalho:

Código
Authorization: Bearer jwt_gerado
3. Rotas protegidas (após login)
Pedidos:

GET http://localhost/api/pedidos → lista pedidos

POST http://localhost/api/pedidos → cria pedido

Produtos:

GET http://localhost/api/produtos → lista produtos

POST http://localhost/api/produtos → adiciona produto

Usuários (admin):

GET http://localhost/api/usuarios → lista usuários

PUT http://localhost/api/usuarios/:id → atualiza perfil

🚀 Sequência no Insomnia
POST /cliente/register → cria usuário.

POST /cliente/login → autentica e pega token.

Configure o Authorization: Bearer token.

Teste as rotas de pedidos, produtos e usuários.