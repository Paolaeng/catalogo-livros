const express = require('express');
const router = express.Router();
const livrosRepository = require('../services/livrosRepository');

router.get('/', (req, res) => {
  const todosLivros = livrosRepository.listar();
  const busca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
  const buscaNormalizada = busca.toLowerCase();
  const categoriaFiltro = typeof req.query.categoria === 'string'
    ? req.query.categoria
    : '';
  const todasCategorias = [...new Set(todosLivros.map((livro) => livro.categoria))];
  let livros = todosLivros;

  if (buscaNormalizada) {
    livros = livros.filter((livro) => {
        const titulo = String(livro.titulo || '').toLowerCase();
        const autor = String(livro.autor || '').toLowerCase();

        return titulo.includes(buscaNormalizada) || autor.includes(buscaNormalizada);
    });
  }

  if (categoriaFiltro) {
    livros = livros.filter(livro => livro.categoria === categoriaFiltro);
  }

  res.render('livros/index', {
    livros,
    busca,
    categoriaFiltro,
    todasCategorias
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
