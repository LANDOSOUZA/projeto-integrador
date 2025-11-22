Eu acreditava que no nosso negócio não havia estoque, trabalhávamos sob demenda, conforme os pedidos iam surgindo, com até três unidades e com no máximo 3 pedidos com status "iniciado" por cliente. Porém, não entendi direito as explicações do Professor Luciano. De modo, que eu estava parcialmente correto. A regra é assim, O CLP tem estoque, sim. 9 peças ( 3 sucos de laranja - 3 sucos de limão e 3 sucos de morango). Acho que podemos limitar a três pedidos com status "iniciado" por cliente. Mas vamos ter que mudar a forma como o MES envia os pedidos para produção. Funciona assim: Vamos supor que o pedido Id 1 tem três sucos de limão, o MES envia para o CLP os dados do pedido Id 1 com os três itens de uma vez. No Id 2 temos 2 sucos de laranja e 1 de morango, então o MES passa para o CLP o Id com os 2 sucos de laranja e, depois, o Id 2 com o suco de morango. Se no Id 3 houver 1 suco de laranja, 1 suco de limão e 1 suco de morango, o MES passa para o CLP o Id 3 com 1 suco de laranja, depois o Id 3 com 1 suco de limão, e, por fim, o Id 3, novamente, com 1 suco de morango. Sempre, o CLP vai dando baixa no estoque, conforme vai produzindo. Veja, o pedido Id 2 tem 2 sucos de laranja, quando fez o primeiro suco o estoque baixou para 2 e, em seguida, para 1; no pedido Id 3 tem mais um suco de laranja, o estoque é atualizado para 0. Então, no próximo pedido de suco de laranja, o MES põe o pedido com status "processando", enquanto o admin "adiciona" (com um botão) matéria prima. Isso ocorre com os demais tipos de sucos, bem como quando há peça com defeito, falta de energia durante a fabricação de um suco etc. - quando se perde aquele produto fabricado. Deu para entender o fluxo? Assim. Funciona o negócio - se no pedido id 1 consta 2 sucos de laranja e no pedido id 2 consta mais de 1, esse pedido id 2 vai ficar com status "processando" - já que o CLP vai dando baixa no estoque (que é de 3 sucos de laranja) a cada produção: fabricou um a quantidade em estoque baixa para 2, fabricou mais 1, a quantidade em estoque baixa para 1. Então, ao olhar para o próximo pedido, verá que são 2 unidades de suco de laranja, mas ele só tem uma matéria prima em estoque - então, ele muda o status do pedido para "processando".

Exemplo: 

Eu entro no site e escolho um produto --> clico em finalizar compra (nesse momento o pedido é gerado e ganha o status de "iniciado" - registrado no banco etc.) --> O admin visualiza meu pedido (essa parte, caso seja implantada um dia, é para ver forma de pagamento, frete etc.) e, muda o status para "em_processamento" ou cancela o pedido (critérios para isso não serão definidos nesse momento). Se o admin escolher o status "em_processamento" o pedido é enviado para o MES/CLP --> O MES CLP, após produzir os produtos (um a um; o backend manda Id 1 - tipo de produto 1 - quantidade 1;  Id 1 tipo de produto 1 - quantidade 1 etc.), muda o status do pedido para "pronto". No entanto, seguindo a lógica de ter 3 itens de cada tipo no estoque e dar baixa conforme vai produzindo, se o estoque 'acabar', muda o status do pedido para "processando". Nesse momento, o admin/superadmin vê o status, reabastece o estoque e o pedido muda novamente o status para "em_processamento". E o fluxo segue ...

🔎 Fluxo de estados do pedido
Cliente finaliza compra

Pedido nasce com status = iniciado.

Registro no banco com os itens escolhidos (até 3).

Admin visualiza pedido

Pode cancelar → status = cancelado.

Pode enviar para produção → status = em_processamento.

MES/CLP recebe pedido

Produz item por item (ex.: Id 1, produto laranja, quantidade 1 → baixa estoque).

Se todos os itens forem produzidos → status = pronto.

Se faltar insumo no meio da produção → status = processando.

Admin/Superadmin intervém

Vê pedido travado em processando.

Reabastece estoque manualmente.

Backend detecta reposição → pedido volta para em_processamento.

Fluxo segue até conclusão

CLP continua produção.

Pedido finalizado → status = pronto.

✅ O que isso significa no backend
cadastrarPedido → sempre cria com STATUS.INICIADO.

atualizarStatusPedido → é o coração da lógica:

Se admin muda para em_processamento, o MES começa a quebrar itens e enviar ao CLP.

CLP dá baixa no estoque e backend atualiza status.

Se estoque acabar → muda para processando.

Se terminar tudo → muda para pronto.

Reposição de estoque → backend atualiza e libera pedidos travados (processando → em_processamento).

👉 Ou seja: o pedido sempre nasce como iniciado, mas o backend só muda para em_processamento quando o admin decide enviar. A lógica de estoque só entra durante a produção (MES/CLP), nunca na criação.

# 📜 Regras de Negócio – Sistema MES/CLP

## Estoque inicial
- CLP mantém estoque de 9 peças:
  - 3 sucos de laranja  
  - 3 sucos de limão  
  - 3 sucos de morango  

## Limite de pedidos
- Máximo de **3 pedidos com status "iniciado"** por cliente.  
- Cada pedido pode ter até **3 unidades**.

## Envio de pedidos do MES para o CLP
- MES envia os pedidos **quebrados por sabor**:
  - Pedido com itens de um único sabor → envia todos de uma vez.  
  - Pedido com sabores diferentes → envia em lotes separados, um sabor por vez.  

### Exemplos
- Pedido Id 1: 3 limões → envia Id 1 com 3 limões.  
- Pedido Id 2: 2 laranjas + 1 morango → envia Id 2 com 2 laranjas, depois Id 2 com 1 morango.  
- Pedido Id 3: 1 laranja + 1 limão + 1 morango → envia Id 3 três vezes, cada vez com um sabor.

## Atualização de estoque
- CLP dá baixa **a cada unidade produzida**.  
- Se estoque chega a 0, próximo pedido fica em **status "processando"** até admin repor matéria-prima.

## Situações especiais
- Produto com defeito, falta de energia ou falha → peça perdida, estoque atualizado.  
- Admin pode **adicionar matéria-prima** via botão para liberar produção novamente.
