# Catálogo de Livros

Aplicação Web simples para gerenciamento de um catálogo pessoal de livros.

Este projeto faz parte do trabalho final da disciplina de Versionamento de Código.

## Tecnologias

- Node.js
- Express
- EJS
- HTML
- CSS
- JavaScript
- JSON

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

Acesse no navegador:

```text
http://localhost:3000
```

## Funcionalidade de categorias

A Issue #1 adiciona categorias aos livros.

É possível:

- cadastrar um livro com categoria;
- editar a categoria de um livro;
- visualizar a categoria na listagem;
- filtrar os livros por categoria;
- usar `Geral` como valor padrão para livros antigos sem categoria.

## Situação da leitura e filtro

A Issue #2 adiciona o controle de progresso de leitura aos livros.

É possível:

* cadastrar e editar o status de leitura (`Quero ler`, `Lendo` ou `Concluído`);
* visualizar a situação de leitura na listagem de livros;
* filtrar os livros por status de leitura, preservando os demais filtros;
* usar `Quero ler` como valor padrão para livros antigos sem status definido.

## Validação e Tratamento de Erros (Issue #3)

A Issue #3 implementa:

- Validação de preenchimento para título, autor e ano nos formulários;
- Mensagens de erro amigáveis exibidas junto aos campos do formulário com preservação dos dados digitados;
- Página 404 personalizada para URLs inexistentes e tratamento seguro de erros sem exposição de stack trace;
- Melhorias gerais de acessibilidade (foco visível e associação de labels) e responsividade para telas pequenas.

## Funcionalidades do snapshot inicial

- Listagem de livros
- Cadastro de livro
- Edição de livro
- Exclusão de livro
- Persistência em arquivo JSON local

## Busca de livros

Na listagem, use o campo de busca para procurar livros por parte do título ou do autor. A busca não diferencia letras maiúsculas e minúsculas e pode ser limpa pelo botão correspondente.

## Ordenação da lista

Na listagem, use os campos de ordenação para organizar os livros por título, autor ou ano, em ordem crescente ou decrescente. A ordenação pode ser combinada com a busca e os filtros por categoria e situação de leitura sem alterar o arquivo JSON.

## Integrantes

- Patrik Viana
- Paola Sanches
