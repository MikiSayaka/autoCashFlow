var express = require('express');
var path = require('path');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next){
  var _url = req.baseUrl;
  if (_url == '') {
    res.send('Hello World!');
  } else {
    var _labelPath = path.join(__dirname, '../sample/', 'label/');
    var _unLabelPath = path.join(__dirname, '../sample/', 'unlabel/');
    fs.readdir(_labelPath, function(err, files){
      _labelPhoto = files;
      fs.readdir(_unLabelPath, function(err, files){
        _unlabelPhoto = files;
        res.render( _url.replace('/', '') + '/index', {
          labeled_samples: _labelPhoto,
          unlabel_samples: _unlabelPhoto
        });
      });
    });
  }
});

router.post('/', upload.single('samplePhoto'), function(req, res, next){
  var _url = req.baseUrl;
  var _tmpPath = req.file.path;
  var _labelPath = path.join(__dirname, '../sample/', 'label/');
  var _unLabelPath = path.join(__dirname, '../sample/', 'unlabel/');
  var _fileName = req.file.originalname;

  fs.rename(_tmpPath, ((req.body.sampleType == 1) ? _labelPath : _unLabelPath) + _fileName , function(err){
    var _labelPhoto = new Array();
    var _unlabelPhoto = new Array();
    if (err == null) {
      fs.readdir(_labelPath, function(err, files){
        _labelPhoto = files;
        fs.readdir(_unLabelPath, function(err, files){
          _unlabelPhoto = files;
          res.render( _url.replace('/', '') + '/index', {
            labeled_samples: _labelPhoto,
            unlabel_samples: _unlabelPhoto
          });
        });
      });
    } else {
      console.log('Error occur, because of ' + err);
      res.render( _url.replace('/', '') + '/index', {
        labeled_samples: new Array(),
        unlabel_samples: new Array()
      });
    }
  });
});

module.exports = router;
