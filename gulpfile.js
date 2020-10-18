const { series, parallel, src, dest } = require('gulp');
const myPaperJSLibArr = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js.map'
];
const myPaperCSSLibArr = [
  './node_modules/bootstrap/dist/css/bootstrap.min.css',
  './node_modules/bootstrap/dist/css/bootstrap.min.css.map'
];

function moveMyPaperJSLib() {
  return src(myPaperJSLibArr).pipe(dest('./public/js'));
}

function moveMyPaperCSSLib() {
  return src(myPaperCSSLibArr).pipe(dest('./public/css'));
}

exports.default = series(moveMyPaperJSLib, moveMyPaperCSSLib);
