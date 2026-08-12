const express = require('express');
const router = express.Router();
const livrosRepository = require('../services/livrosRepository');

router.get('/', (req, res) => {
  const todosLivros = livrosRepository.listar();

  const busca = typeof req.query.busca === 'string'
    ? req.query.busca.trim()
    : '';

  const buscaNormalizada = busca.toLowerCase();

  const categoriaFiltro = typeof req.query.categoria === 'string'
    ? req.query.categoria
    : '';

  const statusInformado = typeof req.query.statusLeitura === 'string'
    ? req.query.statusLeitura
    : '';

  const statusFiltro = livrosRepository.statusLeituraValidos.includes(statusInformado)
    ? statusInformado
    : '';

  const todasCategorias = [
    ...new Set(todosLivros.map((livro) => livro.categoria))
  ];

  const todasSituacoes = livrosRepository.statusLeituraValidos;

  let livros = todosLivros;

  if (buscaNormalizada) {
    livros = livros.filter((livro) => {
      const titulo = String(livro.titulo || '').toLowerCase();
      const autor = String(livro.autor || '').toLowerCase();

      return titulo.includes(buscaNormalizada)
        || autor.includes(buscaNormalizada);
    });
  }

  if (categoriaFiltro) {
    livros = livros.filter((livro) => livro.categoria === categoriaFiltro);
  }

  if (statusFiltro) {
    livros = livros.filter((livro) => livro.statusLeitura === statusFiltro);
  }

  res.render('livros/index', {
    livros,
    busca,
    categoriaFiltro,
    statusFiltro,
    todasCategorias,
    todasSituacoes
  });
});

router.get('/novo', (req, res) => {
  res.render('livros/form', {
    tituloPagina: 'Cadastrar livro',
    acao: '/livros',
    livro: {}
  });
});

router.post('/', (req, res) => {
  livrosRepository.criar(req.body);
  res.redirect('/livros');
});

router.get('/:id/editar', (req, res, next) => {
  const livro = livrosRepository.buscarPorId(req.params.id);

  if (!livro) {
    return next();
  }

  res.render('livros/form', {
    tituloPagina: 'Editar livro',
    acao: `/livros/${livro.id}/editar`,
    livro
  });
});

router.post('/:id/editar', (req, res) => {
  livrosRepository.atualizar(req.params.id, req.body);
  res.redirect('/livros');
});

router.post('/:id/excluir', (req, res) => {
  livrosRepository.excluir(req.params.id);
  res.redirect('/livros');
});

module.exports = router;const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const examplePath = path.join(dataDir, 'livros.example.json');
const dataPath = path.join(dataDir, 'livros.json');

const statusLeituraValidos = [
  'Quero ler',
  'Lendo',
  'Concluído'
];

function normalizarStatusLeitura(statusLeitura) {
  if (statusLeituraValidos.includes(statusLeitura)) {
    return statusLeitura;
  }

  return 'Quero ler';
}

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

  return livros.map((livro) => ({
    ...livro,
    categoria: livro.categoria || 'Geral',
    statusLeitura: normalizarStatusLeitura(livro.statusLeitura)
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
    statusLeitura: normalizarStatusLeitura(dados.statusLeitura)
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
      statusLeitura: normalizarStatusLeitura(dados.statusLeitura)
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
  excluir,
  statusLeituraValidos
};