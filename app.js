var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var paths = require('./routes/paths');
var restFulAPI = require('./routes/restFulAPI')

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//  TODO  Parse static file, like image, js, css, etc...
app.use(express.static('public'));
app.use(express.static('sample'));
//  app.use(express.static('views/myPaper'));
app.use(express.static('views/cart'));
app.use(express.static('views/cam'));
app.use(express.static('views/train'));
app.use(express.static('views/test'));

//  TODO  Page router
app.use('/', paths);
//  app.use('/myPaper', paths);
app.use('/cart', paths);
app.use('/cam', paths);
app.use('/train', paths);
app.use('/test', paths);

//  TODO  API
app.use('/restFulAPI', restFulAPI);

app.listen(3000, () => console.log('Server listen on 3000 port....'));

module.exports = app;
