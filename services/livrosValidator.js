function validarLivro(dados) {
  const erros = {};

  if (!dados.titulo || !dados.titulo.trim()) {
    erros.titulo = 'O título não pode estar vazio.';
  }

  if (!dados.autor || !dados.autor.trim()) {
    erros.autor = 'O autor não pode estar vazio.';
  }

  if (!dados.ano || isNaN(dados.ano) || Number(dados.ano) <= 0) {
    erros.ano = 'Informe um ano válido.';
  }

  return erros;
}

module.exports = {
  validarLivro
};