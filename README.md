
<div align="center">
<img src="./assets/logo-amazon-404px-grey.png" alt="San Juan Mountains" width="200"/>
</div>

# Web Scraper de Bestsellers do site da Amazon 🌟

## Visão Geral do Projeto 💡
Este projeto demonstra a construção de um sistema de extração de dados de um site (Web Scraping) de alto desempenho utilizando a arquitetura Serverless na AWS. A solução visa capturar informações dos produtos e salvar os dados no DynamoDB, expondo-os através de uma API REST para consumo externo.


## Stacks utilizadas 🛠️
- **Node.Js** 
- **TypeScript** 
- **Serverless Framework** 
- **AWS**

## Tecnologias 💻
- **[Puppeteer:](https://pptr.dev/guides/getting-started)** API de scraping utilizada no projeto para automatizar a navegação e extração de dados da página dos [produtos mais vendidos na Amazon](https://www.amazon.com.br/bestsellers)
---
- **AWS Lambda:** Serviço de computação sem servidor (*Serverless*) que permite que funções sejam executadas em respostas a serviços. No projeto, foi utilizado para expor as funções da API (listagem, busca e exclusão), garantindo uma execução sob demanda com escalabilidade automática.
![](/assets/LAMBDA.png)
---
- **AWS DynamonDB:** Serviço de banco de dados NoSQL que permite uma estrutura de tabela flexível, altamente escalável e baixa latência, ideal para armazenar e gerenciar os dados extraídos pelo web scraping.
![](/assets/DYNAMOMDB.png)
----
- **AWS API Gateway:** Serviço de gestão de API. Foi utilizado no projeto para a criação de rotas, gerenciamento de endpoints, métodos HTTP e controle de acesso através do AWS IAM.
![](/assets/API%20GATEWAY.png)

## Regras de negócios e Endpoints 👔

### 1 - Scrapping e Persistência de dados
<p align="center" >
  <img src="./assets/scraping.gif" alt="Vídeo demostrativo do scraping">
</p>

- **Objetivo:** Extrair os 3 primeiros produtos de cada categoria da página BestSellers e armazenar os dados no DynamoBD.
- **Dados extraídos de cada produto:**

| Campo |  Tipo | Descrição |
| --- | --- | --- |
| `productId` | String | Valor extraído de data-asin que serve como ID único do produto | 
| `name` | String | Nome do produto |
| `category` | String | Categoria que se encontra o produto |
| `price` | Number | Preço do produto extraído da string e transformado em número (float) |
| `url` | String | URL de cada produto |



**A URL Base para consumir a API é:** 
- *https://887dxij2o7.execute-api.sa-east-1.amazonaws.com/*

### 2 - Lista de todos os produtos
<p align="center" >
  <img src="./assets/VIDEO-LISTAR-PRODUTOS.gif" alt="Vídeo demostrativo da aplicação">
</p>

- **Objetivo:** Retorna uma lista com todos os produtos extraídos.
- **URL:** [/dev/list-products]
- **Método:** GET
- **Resposta de Sucesso:**
  - **Código:** 200 OK
  - **Exemplo de Corpo:**
  ```Json
  [
	{
		"productId": "B076N2S8FV",
		"category": "Ferramentas e Materiais de Construção",
		"name": "Sparta Maleta de ferramentas kit com 129 peças",
		"price": 95.79,
		"url": "https://www.amazon.com.br/Maleta-Ferramentas-Sparta-Kit-13564/dp/B076N2S8FV/ref=zg_bs_c_hi_d_sccl_3/135-1570748-2313008?pd_rd_w=z4lBx&content-id=amzn1.sym.550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_p=550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_r=QS6B19DHANT75YJQ7G6P&pd_rd_wg=KUVia&pd_rd_r=f0acb7d7-73af-4352-8061-c088f27d74b0&pd_rd_i=B076N2S8FV&psc=1"
	},
	{
		"productId": "B09B16LRD1",
		"category": "Casa",
		"name": "MONDIAL Ventilador de Mesa 110V, 30cm, 6 pás, Super Power - VSP-30-B",
		"price": 94.9,
		"url": "https://www.amazon.com.br/Ventilador-Mesa-MONDIAL-Super-Power/dp/B09B16LRD1/ref=zg_bs_c_home_d_sccl_2/135-1570748-2313008?pd_rd_w=8N1sf&content-id=amzn1.sym.550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_p=550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_r=QS6B19DHANT75YJQ7G6P&pd_rd_wg=KUVia&pd_rd_r=f0acb7d7-73af-4352-8061-c088f27d74b0&pd_rd_i=B09B16LRD1&psc=1"
	}
  ]
  ```

### 3 - Listar por categoria
<p align="center" >
  <img src="./assets/LISTAR-PRODUTOS-CATEGORIA.gif" alt="Vídeo demostrativo da aplicação">
</p>

- **Objetivo:** Retorna uma lista com os produtos organizados por categoria.
- **URL:** [dev/list-products/grouped]
- **Método:** GET
- **Resposta de Sucesso:**
  - **Código:** 200 OK
  - **Exemplo de Corpo:**
  ```Json
  "Casa": [
		{
			"productId": "B09B16LRD1",
			"name": "MONDIAL Ventilador de Mesa 110V, 30cm, 6 pás, Super Power - VSP-30-B",
			"price": 94.9,
			"url": "https://www.amazon.com.br/Ventilador-Mesa-MONDIAL-Super-Power/dp/B09B16LRD1/ref=zg_bs_c_home_d_sccl_2/135-1570748-2313008?pd_rd_w=8N1sf&content-id=amzn1.sym.550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_p=550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_r=QS6B19DHANT75YJQ7G6P&pd_rd_wg=KUVia&pd_rd_r=f0acb7d7-73af-4352-8061-c088f27d74b0&pd_rd_i=B09B16LRD1&psc=1"
		},
    ],
  "Ferramentas e Materiais de Construção": [
		{
			"productId": "B076N2S8FV",
			"name": "Sparta Maleta de ferramentas kit com 129 peças",
			"price": 95.79,
			"url": "https://www.amazon.com.br/Maleta-Ferramentas-Sparta-Kit-13564/dp/B076N2S8FV/ref=zg_bs_c_hi_d_sccl_3/135-1570748-2313008?pd_rd_w=z4lBx&content-id=amzn1.sym.550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_p=550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_r=QS6B19DHANT75YJQ7G6P&pd_rd_wg=KUVia&pd_rd_r=f0acb7d7-73af-4352-8061-c088f27d74b0&pd_rd_i=B076N2S8FV&psc=1"
		},
    ]
  ```
### 4 - Pesquisar produto
<p align="center" >
  <img src="./assets/PESQUISAR POR PRODUTO.gif" alt="Vídeo demostrativo da aplicação">
</p>

- **Objetivo:** Retorna o produto pesquisado pelo productId
- **URL:** [/dev/product/B076N2S8FV]
- **Método:** GET
- **Resposta de Sucesso:**
  - **Código:** 200 OK
  - **Exemplo de Corpo:**
  ```Json
  
	{
		"productId": "B076N2S8FV",
		"category": "Ferramentas e Materiais de Construção",
		"name": "Sparta Maleta de ferramentas kit com 129 peças",
		"price": 95.79,
		"url": "https://www.amazon.com.br/Maleta-Ferramentas-Sparta-Kit-13564/dp/B076N2S8FV/ref=zg_bs_c_hi_d_sccl_3/135-1570748-2313008?pd_rd_w=z4lBx&content-id=amzn1.sym.550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_p=550666bb-9d24-483d-bc9e-4a297db376ce&pf_rd_r=QS6B19DHANT75YJQ7G6P&pd_rd_wg=KUVia&pd_rd_r=f0acb7d7-73af-4352-8061-c088f27d74b0&pd_rd_i=B076N2S8FV&psc=1"
	}
  ```

### 5 - Deletar produto

<p align="center" >
  <img src="./assets/DELETAR PRODUTO.gif" alt="Vídeo demostrativo da aplicação">
</p>

- **Objetivo:** Deleta produto pelo productId
- **URL:** [dev/product/B076N2S8FV]
- **Método:** DELETE
- **Resposta de Sucesso:**
  - **Código:** 200 OK
  - **Exemplo de Corpo:**
  ```Json
  {
	"message": "Produto com ID B01CZXF4XW deletado com sucesso."
  }
  ```

 
