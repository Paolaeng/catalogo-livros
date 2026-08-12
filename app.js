var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var livrosRouter = require('./routes/livros');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/livros', livrosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('error', {
    status: 404,
    mensagem: 'Página não encontrada.'
  });
});

// error handler (sem expor stack trace)
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  res.render('error', {
    status: status,
    mensagem: 'Ocorreu um erro interno no servidor.'
  });
});

module.exports = app;