var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var paths = require('./routes/paths');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//  TODO  Parse static file, like image, js, css, etc...
app.use(express.static('public'));
app.use(express.static('sample'));
app.use(express.static('views/myPaper'));

app.use('/', paths);
app.use('/myPaper', paths);

app.listen(3000, () => console.log('Server listen on 3000 port....'));

module.exports = app;
