var express = require('express');
var router = express.Router();
var visionSrv = require('../service/myVisionAPI.js');

router.post('/getImageInfo', function(req, res, next){
  visionSrv.getImgInfo(req.body.name, req.body.label, function(_successObj){
    res.write(JSON.stringify(_successObj));
    res.end();
  });
});

module.exports = router;
