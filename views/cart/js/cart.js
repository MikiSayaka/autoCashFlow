$(document).ready(function(){
  let net;
  const situationText = $('.result-area span');
  const imgEl = document.getElementById('img');
  (async () => {
    situationText.text('Loading model');
    mobilenet.load().then(model => {
      model.classify(img).then(predictions => {
        situationText.text('Predictions are ');
        for (var _i = 0; _i < predictions.length; _i++) {
          situationText.parent().append('<div>' + predictions[_i].className + '</div>');
        }
      });
    });
  })();
});
