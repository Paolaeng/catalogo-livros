const express = require('express');
const router = express.Router();
const livrosRepository = require('../services/livrosRepository');

router.get('/', (req, res) => {
  let livros = livrosRepository.listar();
  const categoriaFiltro = req.query.categoria;

  // Se houver um filtro de categoria selecionado, filtra a lista
  if (categoriaFiltro) {
    livros = livros.filter(livro => livro.categoria === categoriaFiltro);
  }

  // Extrai todas as categorias únicas para exibir no menu de filtro da tela
  const todasCategorias = [...new Set(livrosRepository.listar().map(l => l.categoria))];

  res.render('livros/index', { 
    livros, 
    categoriaFiltro: categoriaFiltro || '', 
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