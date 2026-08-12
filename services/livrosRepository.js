const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const examplePath = path.join(dataDir, 'livros.example.json');
const dataPath = path.join(dataDir, 'livros.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataPath)) {
    fs.copyFileSync(examplePath, dataPath);
  }
}

function listar() {
  ensureDataFile();
  const conteudo = fs.readFileSync(dataPath, 'utf-8');
  const livros = JSON.parse(conteudo);
  
  return livros.map(livro => ({
    ...livro,
    categoria: livro.categoria || 'Geral',
    statusLeitura: livro.statusLeitura || 'Quero ler'
  }));
}

function salvarTodos(livros) {
  ensureDataFile();
  fs.writeFileSync(dataPath, JSON.stringify(livros, null, 2));
}

function buscarPorId(id) {
  return listar().find((livro) => livro.id === Number(id));
}

function criar(dados) {
  const livros = listar();
  const novoLivro = {
    id: Date.now(),
    titulo: dados.titulo,
    autor: dados.autor,
    ano: Number(dados.ano),
    categoria: dados.categoria || 'Geral',
    statusLeitura: dados.statusLeitura || 'Quero ler'
  };

  livros.push(novoLivro);
  salvarTodos(livros);
  return novoLivro;
}

function atualizar(id, dados) {
  const livros = listar();
  const livroId = Number(id);

  const atualizados = livros.map((livro) => {
    if (livro.id !== livroId) {
      return livro;
    }

    return {
      ...livro,
      titulo: dados.titulo,
      autor: dados.autor,
      ano: Number(dados.ano),
      categoria: dados.categoria || 'Geral',
      statusLeitura: dados.statusLeitura || 'Quero ler'
    };
  });

  salvarTodos(atualizados);
}

function excluir(id) {
  const livroId = Number(id);
  const livros = listar();
  const atualizados = livros.filter((livro) => livro.id !== livroId);
  salvarTodos(atualizados);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
};