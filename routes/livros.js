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

  const camposOrdenacao = ['titulo', 'autor', 'ano'];
  const ordenarPor = camposOrdenacao.includes(req.query.ordenarPor)
    ? req.query.ordenarPor
    : '';
  const direcao = req.query.direcao === 'desc' ? 'desc' : 'asc';

  if (ordenarPor) {
    const fatorDirecao = direcao === 'desc' ? -1 : 1;

    livros = [...livros].sort((livroA, livroB) => {
      if (ordenarPor === 'ano') {
        return (Number(livroA.ano) - Number(livroB.ano)) * fatorDirecao;
      }

      return String(livroA[ordenarPor] || '').localeCompare(
        String(livroB[ordenarPor] || ''),
        'pt-BR',
        { sensitivity: 'base' }
      ) * fatorDirecao;
    });
  }

  res.render('livros/index', {
    livros,
    busca,
    categoriaFiltro,
    statusFiltro,
    todasCategorias,
    todasSituacoes,
    ordenarPor,
    direcao
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

module.exports = router;
