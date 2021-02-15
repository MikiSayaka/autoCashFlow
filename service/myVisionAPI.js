exports.getImgInfo = async function(_imgName, _imgLabel, _callBack) {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.labelDetection('/srv/autoCashFlow/sample/' + _imgLabel + '/' + _imgName);
  const labels = result.labelAnnotations;

  if (_callBack) {
    _callBack(labels);
  }
}
