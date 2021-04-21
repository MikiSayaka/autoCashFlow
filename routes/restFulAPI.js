var express = require('express');
var router = express.Router();
var visionSrv = require('../service/myVisionAPI.js');
var jsonIO = require('../service/jsonDataIO.js');

router.post('/getImageInfo', function(req, res, next){
  visionSrv.getImgInfo(req.body.name, req.body.label, function(_successObj){
    res.write(JSON.stringify(_successObj));
    res.end();
  });
});

router.post('/saveClassifierData', function(req, res, next){
  var _modelData = req.body.classifierData;
  var _modelName = req.body.name;
  jsonIO.saveJSONData(_modelData, './data/classifyData/' + _modelName + '.json', function(){
      var _result = {
        'returnStatus': 1
      };
      res.write(JSON.stringify(_result));
      res.end();
  });
});

router.post('/readClassifierData', function(req, res, next){
  var _modelName = req.body.name;
  var _result = {};
  if (_modelName == '' || _modelName == undefined) {
    _result = {
      'returnStatus': 0,
      'modeldata': ''
    }
    res.write(JSON.stringify(_result));
    res.end();
  } else {
    jsonIO.readJSONData('./data/classifyData/' + _modelName + '.json', function(_rtnData, _err){
      if (_err) console.log(_err);

      _result = {
        'returnStatus': 1,
        'modeldata': (Object.keys(_rtnData).length === 0) ? '' : _rtnData.toString()
      }
      res.write(JSON.stringify(_result));
      res.end();
    });
  }
});

router.post('/saveLabelData', function(req, res, next){
  var _tmpData = req.body;
  jsonIO.saveJSONData(_tmpData, './data/label/config.json', function(){
    jsonIO.readJSONData('./data/label/config.json', function(_rtnData){
      var _result = {
        'returnStatus': 1,
        'modeldata': _rtnData.toString()
      };
      res.write(JSON.stringify(_result));
      res.end();
    });
  });
});

router.post('/readlabelData', function(req, res, next){
  var _tmpData = req.body;
  var _result = {};
  if (_tmpData == '' || _tmpData == undefined) {
    _result = {
      'returnStatus': 0,
      'modeldata': ''
    }
    res.write(JSON.stringify(_result));
    res.end();
  } else {
    jsonIO.readJSONData('./data/label/config.json', function(_rtnData, _err){
      if (_err) console.log(_err);

      _result = {
        'returnStatus': (Object.keys(_rtnData).length === 0) ? 0 : 1,
        'modeldata': (Object.keys(_rtnData).length === 0) ? '' : _rtnData.toString()
      }
      res.write(JSON.stringify(_result));
      res.end();
    });
  }
});

module.exports = router;
