const express = require('express');
const router = express.Router();
const livrosRepository = require('../services/livrosRepository');

router.get('/', (req, res) => {
  let livros = livrosRepository.listar();
  const categoriaFiltro = req.query.categoria;
  const statusFiltro = req.query.statusLeitura;

  if (categoriaFiltro) {
    livros = livros.filter(livro => livro.categoria === categoriaFiltro);
  }

  if (statusFiltro) {
    livros = livros.filter(livro => livro.statusLeitura === statusFiltro);
  }

  const todosOsLivros = livrosRepository.listar();
  const todasCategorias = [...new Set(todosOsLivros.map(l => l.categoria))];
  const todasSituacoes = ['Quero ler', 'Lendo', 'Concluído'];

  res.render('livros/index', { 
    livros, 
    categoriaFiltro: categoriaFiltro || '', 
    statusFiltro: statusFiltro || '',
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

module.exports = router;