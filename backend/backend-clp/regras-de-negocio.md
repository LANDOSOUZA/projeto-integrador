Eu acreditava que no nosso negócio não havia estoque, trabalhávamos sob demenda, conforme os pedidos iam surgindo, com até três unidades e com no máximo 3 pedidos com status "iniciado" por cliente. Porém, não entendi direito as explicações do Professor Luciano. De modo, que eu estava parcialmente correto. A regra é assim, O CLP tem estoque, sim. 9 peças ( 3 sucos de laranja - 3 sucos de limão e 3 sucos de morango). Acho que podemos limitar a três pedidos com status "iniciado" por cliente. Mas vamos ter que mudar a forma como o MES envia os pedidos para produção. Funciona assim: Vamos supor que o pedido Id 1 tem três sucos de limão, o MES envia para o CLP os dados do pedido Id 1 com os três itens de uma vez. No Id 2 temos 2 sucos de laranja e 1 de morango, então o MES passa para o CLP o Id com os 2 sucos de laranja e, depois, o Id 2 com o suco de morango. Se no Id 3 houver 1 suco de laranja, 1 suco de limão e 1 suco de morango, o MES passa para o CLP o Id 3 com 1 suco de laranja, depois o Id 3 com 1 suco de limão, e, por fim, o Id 3, novamente, com 1 suco de morango. Sempre, o CLP vai dando baixa no estoque, conforme vai produzindo. Veja, o pedido Id 2 tem 2 sucos de laranja, quando fez o primeiro suco o estoque baixou para 2 e, em seguida, para 1; no pedido Id 3 tem mais um suco de laranja, o estoque é atualizado para 0. Então, no próximo pedido de suco de laranja, o MES põe o pedido com status "processando", enquanto o admin "adiciona" (com um botão) matéria prima. Isso ocorre com os demais tipos de sucos, bem como quando há peça com defeito, falta de energia durante a fabricação de um suco etc. - quando se perde aquele produto fabricado. Deu para entender o fluxo?
Sim, Lando, agora o fluxo ficou bem claro 👌. Vou organizar o que você explicou em etapas para deixar cristalino:

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
