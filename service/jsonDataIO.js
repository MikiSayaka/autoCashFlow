const fs = require('fs');

exports.saveJSONData = function(_data, _path, _callBack) {
  fs.writeFile(_path, JSON.stringify(_data, null, 2), function(_err){
    if (_callBack) {
      _callBack(_err);
    }
  });
}

exports.readJSONData = function(_path, _callBack) {
  fs.readFile(_path, function(_err, _rawData){
    var _jsonData = {};
    if (!_err) {
      _jsonData = _rawData;
    }
    if (_callBack) {
      _callBack(_jsonData, _err);
    }
  });
}
