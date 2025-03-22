# Node Web Scraper

O **Node Web Scraper** é uma API hospedada em AWS Lambda que realiza web scraping na página de [Produtos Mais Vendidos da Amazon](https://www.amazon.com.br/bestsellers), armazenando os dados extraídos em uma tabela do DynamoDB.

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando a API](#executando-a-api)
- [Testando a API](#testando-a-api)
- [Derrubando a infraestrutura](#desprovisionando-infraestrutura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

---

## Pré-requisitos

Antes de iniciar, verifique se sua máquina possui os seguintes itens instalados e configurados:

- **Conta AWS**: Necessária para acesso ao AWS Console. Caso ainda não possua, registre-se [aqui](https://signin.aws.amazon.com/signup?request_type=register).
- **Node.js**: Versão **20.18.3**. Se necessário, siga o tutorial de instalação [aqui](https://www.alura.com.br/artigos/como-instalar-node-js-windows-linux-macos).
- **Serverless Framework**: Essencial para o provisionamento da infraestrutura na AWS. Consulte a [instalação e configuração](#instalação-e-configuração) abaixo.
- **AWS CLI**: Ferramenta para configurar as credenciais de acesso à AWS. Tutorial disponível [aqui](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
- **Git**: Utilizado para clonar o repositório. Faça o download [aqui](https://www.git-scm.com/downloads).

---

## Instalação e Configuração

### 1. Clonando o Repositório

Clone o repositório para a sua máquina:

```bash
git clone https://github.com/EmanuelErnesto/node-web-scraper
```

## Navegue até o Diretório do Projeto

Em seguida, navegue até o diretório do projeto:

```bash
cd node-web-scraper
```

Verifique se o Node.js está instalado corretamente:

```bash
node -v
```

### 2. Instalando as Dependências.

Instale as dependências do projeto com o comando:


```bash
npm install
```

## 3. Configuração do Ambiente

### a. Instalação do Serverless Framework

Instale o Serverless Framework globalmente:

```bash 
npm install -g serverless
```

Confirme a instalação:

```bash
serverless version
```

### b. Configuração do AWS CLI

Configure suas credenciais AWS utilizando o comando:

```bash
aws configure
```

Você precisará informar:
- **AWS Access Key ID**
- **AWS Secret Access Key**
- **Região Padrão (default region)**
- **Formato de Saída Padrão (default output)**

_As credenciais podem ser obtidas no AWS Console._

---

## Executando a API

Após a configuração do ambiente, você pode iniciar a API nos diferentes stages.

### Modo Desenvolvimento

Utilize um dos comandos abaixo:

```bash
npm run start:dev
``` 

Ou:

```bash
serverless deploy
```

### Modo Produção

Para implantar a API no stage de produção, execute:

```bash
npm run start:prod
```

Ou:

```bash
serverless deploy --stage production
```

Após o deploy, a saída exibirá informações como os endpoints disponíveis e as funções provisionadas. Exemplo de saída:

✔ Service deployed to stack webscraper-node-challenge-dev (82s)
### endpoints:
-  GET - https://{id_deploy}.execute-api.{AWS_REGION}.amazonaws.com/dev/products
-  GET - https://{id_deploy}.execute-api.{AWS_REGION}.amazonaws.com/dev/products/{id}
-  PATCH - https://{id_deploy}.execute-api.{AWS_REGION}.amazonaws.com/dev/products/{id}/upload
-  DELETE - https://{id_deploy}.execute-api.{AWS_REGION}.amazonaws.com/dev/products/{id}

### functions:
-  GetProducts: webscraper-node-challenge-dev-GetProducts (173 kB)
-  GetProductById: webscraper-node-challenge-dev-GetProductById (173 kB)
-  DeleteProduct: webscraper-node-challenge-dev-DeleteProduct (173 kB)
-  UploadProductImage: webscraper-node-challenge-dev-UploadProductImage (259 kB)

Utilize o endpoint gerado com o seu client HTTP de preferência (Postman, Insomnia ou cURL).

---

## Testando a API

### Populando o Banco de Dados

Para alimentar a tabela no DynamoDB com os dados obtidos pelo web scraping, execute:

```bash
npm run seed
```
---

## Endpoints Disponíveis

### GET /products/{id}

Descrição: Busca um produto específico pelo ID.

**Resposta esperada (sucesso):**

```json
{
  "productId": "1ebf15bb-9ef9-4f16-a211-ba8fc7c7e46b",
  "name": "Tramontina JOGO FACAS INOX 4PC PLENUS PRE, Preto",
  "category": "cozinha",
  "price": 25.21,
  "productUrl": "https://www.amazon.com.br/Tramontina-JOGO-FACAS-PLENUS-Preto/dp/B09XFD2YMF/...",
  "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/31bjzC6fx-L._AC_UL225_SR225,160_.jpg",
  "createdAt": "2025-03-21T18:06:05.590Z"
}
```

**Resposta esperada (id inválido):**

```json
{
    "timestamp": "2025-03-21T18:34:27.780Z",
    "code": 422,
    "status": "Unprocessable Entity",
    "message": "Validation Error",
    "details": [
        {
            "field": "id",
            "message": "Invalid uuid"
        }
    ]
}
```

**Resposta esperada (não encontrado):**

```json 
{
  "timestamp": "2025-03-21T18:13:04.452Z",
  "code": 404,
  "status": "Not Found",
  "message": "Product Not Found.",
  "details": []
}
```

### GET /products  

Descrição: Retorna uma lista de produtos.

**Resposta esperada (sucesso):**

```json  
{
  "data": [
    {
      "productId": "1ebf15bb-9ef9-4f16-a211-ba8fc7c7e46b",
      "name": "Tramontina JOGO FACAS INOX 4PC PLENUS PRE, Preto",
      "category": "cozinha",
      "price": 25.21,
      "productUrl": "https://www.amazon.com.br/Tramontina-JOGO-FACAS-PLENUS-Preto/dp/B09XFD2YMF/...",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/31bjzC6fx-L._AC_UL225_SR225,160_.jpg",
      "createdAt": "2025-03-21T18:06:05.590Z"
    },
    {
      "productId": "7eb3dfb5-3e60-44eb-adb7-519c585f6f7f",
      "name": "WOLFF Garrafa Térmica de Plástico com Cabo de Madeira Nórdica 1L Branca...",
      "category": "cozinha",
      "price": 69.99,
      "productUrl": "https://www.amazon.com.br/WOLFF-Garrafa-T%C3%A9rmica-Pl%C3%A1stico-Madeira/dp/B09CC39PR1/...",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/51QYlVb6v-L._AC_UL225_SR225,160_.jpg",
      "createdAt": "2025-03-21T18:06:05.586Z"
    },
    {
      "productId": "bf60383a-e1c9-4ebc-a7f8-3de98c4e573e",
      "name": "Liquidificador Mondial, Turbo Power 550W, 220V, Preto, 2,2 L - L-99 FB",
      "category": "cozinha",
      "price": 99,
      "productUrl": "https://www.amazon.com.br/Liquidificador-Mondial-L-99-LB-220V/dp/B07QK91PTZ/...",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/71KFAoTV+hL._AC_UL225_SR225,160_.jpg",
      "createdAt": "2025-03-21T18:06:05.589Z"
    }
  ]
}
```

---

### DELETE /products/{id}  

Descrição: Exclui um produto existente e, caso possua a imagem num bucket S3, a deleta dele.

**Resposta esperada (sucesso):**

```json

```

**Resposta esperada (não encontrado):**

```json 
{
  "timestamp": "2025-03-21T18:13:04.452Z",
  "code": 404,
  "status": "Not Found",
  "message": "Product Not Found.",
  "details": []
}
```

**Resposta esperada (id inválido):**

```json
{
    "timestamp": "2025-03-21T18:34:27.780Z",
    "code": 422,
    "status": "Unprocessable Entity",
    "message": "Validation Error",
    "details": [
        {
            "field": "id",
            "message": "Invalid uuid"
        }
    ]
}
```

### PATCH /products/{id}/upload

Descrição: Faz o upload da imagem de um produto para o Amazon S3 e atualiza o imageUrl com o valor da nova url.

**Resposta esperada (sucesso):**

```json
{ 
  "imageUrl": "https://{BUCKET_NAME}.s3.us-east-1.amazonaws.com/{uploadKey}"
}
```

**Resposta esperada (não encontrado):**

```json 
{
  "timestamp": "2025-03-21T18:13:04.452Z",
  "code": 404,
  "status": "Not Found",
  "message": "Product Not Found.",
  "details": []
}
```

**Resposta esperada (caso a imagem já esteja no S3):**

```json
{
    "timestamp": "2025-03-22T16:10:55.999Z",
    "code": 400,
    "status": "Bad Request",
    "message": "This product have an image that already have been uploaded on S3 bucket.",
    "details": []
}
```

**Resposta esperada (id inválido):**

```json
{
    "timestamp": "2025-03-21T18:34:27.780Z",
    "code": 422,
    "status": "Unprocessable Entity",
    "message": "Validation Error",
    "details": [
        {
            "field": "id",
            "message": "Invalid uuid"
        }
    ]
}
```

---

## Desprovisionando Infraestrutura

Para desprovisionar a infraestrutura, execute os comandos correspondentes ao stage em que sua API está implantada:

- **Stage de desenvolvimento (dev):**

```bash  
  npm run shutdown:dev  
```

  ou

```bash  
  serverless remove  
```

- **Stage de produção (production):**

```bash  
  npm run shutdown:prod  
```

  ou

```bash  
  serverless remove --stage production  
```

---

## Tecnologias Utilizadas

- Node.js com TypeScript.  
- AWS Lambda para execução serverless da API.  
- Amazon S3 para armazenamento de imagens estáticas dos produtos.
- DynamoDB como banco de dados.  
- Serverless Framework para provisionamento da infraestrutura.  
- Zod para validação dos parâmetros das rotas.  
- Puppeteer para realização do web scraping de produtos.
