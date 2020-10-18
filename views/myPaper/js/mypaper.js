$(document).ready(function(){
  $('.sample-list li').click(function(){
    var _this = $(this);
    var _url = '';
    if (_this.parent().hasClass('label')) {
      _url = 'label/' + _this.text();
    } else {
      _url = 'unlabel/' + _this.text();
    }
    $('.show-photo div img').remove();
    $('.show-photo div').append('<img src="' + _url + '">');
    console.log();
  });

  $('.show-photo div').click(function(){
    if ($('.show-photo div img').length > 0) {
      $('.show-photo div img').remove();
    }
  });
});
