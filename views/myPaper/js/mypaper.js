$(document).ready(function(){
  $('.sample-list li span').click(function(){
    var _this = $(this);
    var _url = '';
    var _currentImg = $('.show-photo div img').attr('src');
    if (_this.parents().hasClass('label')) {
      _url = 'label/' + _this.text();
    } else {
      _url = 'unlabel/' + _this.text();
    }
    $('.show-photo div img').remove();
    if (_currentImg != _url) {
      $('.show-photo div').append('<img src="' + _url + '">');
    }
  });

  //  TODO  Click the remove button then remove the photo
  $('.sample-list li .del').click(function(){
  });

  //  TODO  click the info button then get information
  $('.sample-list li .info').click(function(){
    var _this = $(this);
    ajaxCall({
      url: '/restFulAPI/getImageInfo',
      method: 'POST',
      dataType: 'json',
      data: {
        name: _this.parent().find('span').text(),
        label: (_this.parents().hasClass('label')) ? 'label' : 'unlabel'
      },
      success: function(_data, _status){
        console.log(_data, _status);
      },
      error: function(){
        console.log('error');
      },
      downFunc: function(){
        console.log('down');
      }
    });
  });

  //  $('.show-photo div').click(function(){
  //    //  if ($('.show-photo div img').length > 0) {
  //    //    $('.show-photo div img').remove();
  //    //  }
  //  });

  function ajaxCall(_config) {
    if (_config != null && _config.url != undefined && _config.url != '') {
      $.ajax({
        url: _config.url,
        method: _config.method,
        dataType: _config.type,
        data: _config.data,
        success: _config.success,
        error: _config.error
      }).done(function(_status, _rst){
        if (_config.downFunc) {
          _config.downFunc();
        }
      });
    }
  }
});
