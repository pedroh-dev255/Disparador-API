# disp
Scrip para disparo de mensagens apartir de um CSV para uma API - Whatsapp

## Execução
Inicialmente deve executar o comando:

``` npm install ```

Para baixar as dependencias.


Para rodar o scrip basta executar o seguinte comando:

``` node index.js contatos.csv ```

⚠️Atenção⚠️
O script irá enviar mensagens para todos os contatos do arquivo CSV, portanto, certifique-se de que o arquivo esteja correto e que você tenha permissão para enviar mensagens para esses contatos.
Para cancelar a execução do script apos rodar o comando, basta pressionar Ctrl+C.

## CSV

O arquivo CSV deve conter o telefone do lciente e o nome dele, separados por virgula.
Ex:
63999999999,Fulado
63999999998,Beltrano 