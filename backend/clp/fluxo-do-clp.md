# ✅ Checklist de Testes de Integração CLP ↔ Backend v‑3

## 1. Conexão OPC UA
- [ ] Verificar se o CLP está ligado e acessível na rede.
- [ ] Conferir `endpointUrl` (ex.: `opc.tcp://192.168.0.1:4840`).
- [ ] Conferir `namespace index` no TIA Portal (ajustar `opcuaNodes.js` se necessário).
- [ ] Rodar `opcua.connect()` e confirmar log:
  - `🚀 Conectando ao CLP OPC UA...`
  - `✅ Sessão OPC UA criada.`

---

## 2. Leitura inicial de status
- [ ] Chamar `GET /status`.
- [ ] Confirmar retorno JSON com:
  - `status.geral = 0` (disponível).
  - `falhaAtiva = false`.
  - `estoqueProd` com valores atuais.
  - `accSinc` variando.

---

## 3. Envio de pedido
- [ ] Chamar `POST /clp/pedido` com:
  ```json
  { "op": 1001, "produto": 1, "quant": 1 }
[ ] Confirmar resposta do backend: 📤 Pedido enviado ao CLP.

[ ] Ler /status e verificar:

opAtual = 1001.

ack.pedidoACK = true.

ack.aplicaACK = true.

4. Início da produção
[ ] Chamar POST /clp/iniciar.

[ ] Ler /status e verificar:

ack.inicioACK = true.

ack.execACK = true.

status.geral = 2 (executando).

mesTempInicio preenchido.

5. Execução da OP
[ ] Durante execução, confirmar:

mesProd aumentando.

mesFalt diminuindo.

mesPcsBoas e mesPcsRuins atualizando.

estoqueProd[] atualizado.

6. Fim da OP
[ ] Ler /status e verificar:

Se sucesso:

ack.fimACK = true.

status.geral = 3.

mesTempFim preenchido.

Se falha:

ack.falhaACK = true.

status.geral = 5.

falhaAtiva = true.

falhaAtivaCod informado.

7. Reset
[ ] Chamar POST /clp/reset.

[ ] Ler /status e confirmar:

Todos os ACKs zerados.

status.geral = 0 (disponível).

falhaAtiva = false.

🚀 Resultado esperado
Ciclo completo: pedido → início → execução → fim → reset.

Backend e CLP sincronizados em cada etapa.

Logs claros no console e JSON consistente no frontend.

===================================================================================================================

# 📂 Estrutura integrada

backend/ clp/ fluxoProducao.js maquinaEstados.js config/opcuaNodes.js services/OpcuaService.js controllers/ statusController.js relatorioController.js models/ AckModel.js PedidoModel.js StatusModel.js routes/ clpRouter.js

Código

---

# 🔗 Fluxo de requisição → resposta (`/status`)

### 1. Frontend chama rota
```http
GET /status
2. Router (clpRouter.js)
Encaminha para o controller correto:

js
const { lerStatus } = require('../controllers/statusController')
router.get('/status', lerStatus)
3. Controller (statusController.js)
Conecta ao CLP via OpcuaService. Lê variáveis (status.geral, accSinc, opAtual, estoqueProd, KPIs, datas). Monta objeto Status usando StatusModel. Retorna JSON para o frontend.

js
const Status = require('../models/StatusModel')

async function lerStatus(req, res) {
  try {
    await opcua.connect()
    const status = new Status({
      geral: await opcua.lerStatusGeral(),
      falhaAtiva: await opcua.lerFalhaAtiva(),
      falhaAtivaCod: await opcua.lerFalhaCod(),
      accSinc: await opcua.ler(nodes.status.accSinc),
      opAtual: await opcua.lerOpAtual(),
      estoqueProd: await opcua.lerEstoqueProd(),
      mesProd: await opcua.lerMesProd(),
      mesFalt: await opcua.lerMesFalt(),
      mesTempInicio: { /* subcampos YEAR..SECOND */ },
      mesTempFim: { /* subcampos YEAR..SECOND */ },
      mesPcsBoas: await opcua.lerMesPcsBoas(),
      mesPcsRuins: await opcua.lerMesPcsRuins()
    })
    res.json(status)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar status', details: err.message })
  } finally {
    await opcua.disconnect()
  }
}
4. Model (StatusModel.js)
Normaliza os dados:

estoqueProd → { limao, morango, laranja }

mesTempInicio e mesTempFim → objetos {year, month, day, hour, minute, second}

5. Resposta JSON
Exemplo:

json
{
  "geral": 2,
  "falhaAtiva": false,
  "falhaAtivaCod": 0,
  "accSinc": 12345,
  "opAtual": 1001,
  "estoqueProd": { "limao": 10, "morango": 5, "laranja": 8 },
  "mesProd": 3,
  "mesFalt": 0,
  "mesTempInicio": { "year": 2025, "month": 11, "day": 21, "hour": 11, "minute": 30, "second": 0 },
  "mesTempFim": { "year": 2025, "month": 11, "day": 21, "hour": 11, "minute": 40, "second": 0 },
  "mesPcsBoas": 3,
  "mesPcsRuins": 0
}
🔗 Fluxo /pedido
1. Frontend envia pedido
http
POST /clp/pedido
Content-Type: application/json

{
  "op": 1001,
  "produto": 1,
  "quant": 3
}
2. Router (clpRouter.js)
Encaminha para o serviço OPC UA:

js
router.post('/pedido', async (req, res) => {
  try {
    const { op, produto, quant } = req.body
    const pedido = new PedidoModel({ op, produto, quant }) // validação
    await opcua.escreverPedido(pedido) // envia para CLP
    res.json({ message: '📤 Pedido enviado ao CLP', pedido })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar pedido', details: err.message })
  }
})
3. Model (PedidoModel.js)
Valida os dados:

produto deve ser 0, 1 ou 2.

quant deve estar entre 1 e 3 (regra de negócio).

op é DINT (número da ordem).

4. Service (OpcuaService.js)
Escreve pedido.op, pedido.produto, pedido.quant.

Gera pulso em cmd.novoPed.

CLP recebe os parâmetros.

5. CLP responde com ACKs
ack.pedidoACK = 1 → confirma leitura.

ack.aplicaACK = 1 → confirma aplicação.

Backend pode ler esses ACKs via opcua.lerPedidoACK() e opcua.lerAplicaACK().

6. Controller de status (statusController.js)
Quando o frontend consulta /status, recebe:

json
{
  "geral": 0,
  "opAtual": 1001,
  "estoqueProd": { "limao": 10, "morango": 5, "laranja": 8 },
  "mesProd": 0,
  "mesFalt": 3,
  "mesTempInicio": null,
  "mesTempFim": null,
  "mesPcsBoas": 0,
  "mesPcsRuins": 0,
  "falhaAtiva": false,
  "falhaAtivaCod": 0,
  "accSinc": 12345
}
🚀 Resultado
O frontend envia pedido → backend valida com PedidoModel → OpcuaService escreve no CLP.

CLP responde com ACKs → backend lê e expõe via /status.

O ciclo segue para início da produção (cmd.inicio) e execução (execACK).

👉 Assim o backend v‑3 está pronto para servir como MES ↔ CLP bridge, com rotas REST claras e modelos consistentes.

===================================================================================================================

# 🔗 Fluxo de execução da OP

## 1. Backend envia pedido
- **Rota**: `POST /clp/pedido`
- **Model usado**: `PedidoModel` (valida `op`, `produto`, `quant`)
- **Service**: `OpcuaService.escreverPedido()`  
  → escreve `pedido.op`, `pedido.produto`, `pedido.quant`  
  → gera pulso em `cmd.novoPed`

**Resposta do CLP:**
- `ack.pedidoACK = 1` → confirma leitura  
- `ack.aplicaACK = 1` → confirma aplicação  
- `status.geral = 0` (ainda disponível, aguardando início)

---

## 2. Backend autoriza início
- **Rota**: `POST /clp/iniciar`
- **Service**: `OpcuaService.iniciarProducao()`  
  → gera pulso em `cmd.inicio`

**Resposta do CLP:**
- `ack.inicioACK = 1` → confirma início  
- `ack.execACK = 1` → ciclo em execução  
- `status.geral = 2` (produzindo OP)  
- `status.opAtual = <número da OP>`  
- `status.accSinc` continua variando (sincronismo ativo)

---

## 3. Execução da OP
Durante execução, o CLP atualiza continuamente:
- `status.mesProd` → quantidade produzida  
- `status.mesFalt` → quantidade restante  
- `status.mesPcsBoas` → peças boas  
- `status.mesPcsRuins` → peças ruins  
- `status.mesTempInicio` → timestamp de início  
- `status.estoqueProd[]` → estoque atualizado  

**Backend lê via `/status`** e expõe JSON para o frontend.

---

## 4. Fim da OP
Quando a ordem termina:

**Resposta do CLP:**
- **Se sucesso**:  
  - `ack.fimACK = 1`  
  - `status.geral = 3` (finalizadoOp)  
  - `status.mesTempFim` → timestamp de fim  

- **Se falha**:  
  - `ack.falhaACK = 1`  
  - `status.geral = 5` (falha)  
  - `status.falhaAtiva = 1`  
  - `status.falhaAtivaCod` → código da falha  

---

## 5. Reset
- **Rota**: `POST /clp/reset`
- **Service**: `OpcuaService.resetPLC()`  
  → gera pulso em `cmd.reset`

**Resposta do CLP:**
- Zera todos os ACKs (`pedidoACK`, `aplicaACK`, `inicioACK`, `execACK`, `fimACK`, `falhaACK`)  
- `status.geral = 0` (disponível)  
- `status.falhaAtiva = 0`  
- `status.accSinc` continua variando  

---

# 📡 Exemplo de estados lidos pelo backend

### Durante execução (`/status`)
```json
{
  "geral": 2,
  "opAtual": 1001,
  "accSinc": 123456,
  "estoqueProd": { "limao": 10, "morango": 2, "laranja": 8 },
  "mesProd": 1,
  "mesFalt": 2,
  "mesPcsBoas": 1,
  "mesPcsRuins": 0,
  "mesTempInicio": { "year": 2025, "month": 11, "day": 21, "hour": 11, "minute": 45, "second": 0 },
  "mesTempFim": null,
  "falhaAtiva": false,
  "falhaAtivaCod": 0
}
Após fim com sucesso
json
{
  "geral": 3,
  "opAtual": 1001,
  "mesProd": 3,
  "mesFalt": 0,
  "mesPcsBoas": 3,
  "mesPcsRuins": 0,
  "mesTempFim": { "year": 2025, "month": 11, "day": 21, "hour": 11, "minute": 55, "second": 0 },
  "ackFim": true
}
Após reset
json
{
  "geral": 0,
  "opAtual": null,
  "falhaAtiva": false,
  "ackPedido": false,
  "ackAplica": false,
  "ackInicio": false,
  "ackExec": false,
  "ackFim": false,
  "ackFalha": false
}
🚀 Resultado
O backend envia pedido → CLP confirma com ACKs.

Backend autoriza início → CLP responde com inicioACK e execACK.

Durante execução, CLP atualiza KPIs e estoque.

Ao fim, CLP sinaliza sucesso ou falha.

Backend reseta → CLP volta a estado disponível.