const express = require('express');
const router = express.Router();
const livrosRepository = require('../services/livrosRepository');
const { validarLivro } = require('../services/livrosValidator');

// Rota de listagem com buscas e filtros
router.get('/', (req, res) => {
  let livros = livrosRepository.listar();
  const busca = req.query.busca;
  const categoriaFiltro = req.query.categoria;
  const statusFiltro = req.query.statusLeitura;

  if (busca) {
    const termo = busca.toLowerCase();
    livros = livros.filter(l => 
      l.titulo.toLowerCase().includes(termo) || 
      l.autor.toLowerCase().includes(termo)
    );
  }

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
    busca: busca || '',
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
    livro: {},
    erros: {}
  });
});

router.post('/', (req, res) => {
  const erros = validarLivro(req.body);

  if (Object.keys(erros).length > 0) {
    return res.render('livros/form', {
      tituloPagina: 'Cadastrar livro',
      acao: '/livros',
      livro: req.body,
      erros
    });
  }

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
    livro,
    erros: {}
  });
});

router.post('/:id/editar', (req, res) => {
  const erros = validarLivro(req.body);

  if (Object.keys(erros).length > 0) {
    return res.render('livros/form', {
      tituloPagina: 'Editar livro',
      acao: `/livros/${req.params.id}/editar`,
      livro: { id: req.params.id, ...req.body },
      erros
    });
  }

  livrosRepository.atualizar(req.params.id, req.body);
  res.redirect('/livros');
});

router.post('/:id/excluir', (req, res) => {
  livrosRepository.excluir(req.params.id);
  res.redirect('/livros');
});

module.exports = router;