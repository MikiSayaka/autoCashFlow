var _classifyItems = {};

//  TODO  On training web initial
$(document).ready(function(){
  const consoleText = (_content) => {
    $('#console #status').append('<div><span>' + _content + '</span></div>');
  }

  const actionText = (_content) => {
    $('#console #action').html('<span>' + _content + '</span>');
  }

  const predictionText = (_content) => {
    $('#console #prediction').html('<span>' + _content + '</span>');
  }

  //{{{ TODO  Modify model object
  const modifyModelObject = (_action, _isItem, _value) => {
    if (_value == '') {
      actionText('Please input the model name or item name');
      return;
    } else if (_value == 'None') {
      actionText('Please select a model or item');
      return;
    }

    if (_action) {
      if (_isItem) {
        var _modelName = $('#model-list').val();
        if (_modelName == 'None' || _modelName == '') {
          actionText('Please select model');
          return;
        } else {
          if (!_classifyItems[_modelName].hasOwnProperty(_value)) {
            _classifyItems[_modelName][_value] = {
              'name': $('#classify-name').val(),
              'price': $('#classify-price').val()
            };
            actionText('Add item successfully');
          } else {
            actionText('Item is already exist.');
            return;
          }
        }
      } else {
        if (!_classifyItems.hasOwnProperty(_value)) {
          _classifyItems[_value] = {};
          actionText('Add model successfully');
        } else {
          actionText('Model is already exist.');
          return;
        }
      }
    } else {
      if (_isItem) {
        var _modelName = $('#model-list').val();
        if (_modelName == 'None' || _modelName == '') {
          actionText('Please select a model');
        } else {
          delete _classifyItems[_modelName][_value];
          actionText('Remove item successfully');
        }
      } else {
        delete _classifyItems[_value];
        actionText('Remove model successfully');
      }
    }

    //  TODO  Send classify data to server
    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(_classifyItems),
      url: '/restFulAPI/saveLabelData'
    }).done(function(_response){
      if (_response.returnStatus == '1') {
        var _modelData = _response.modeldata;
        _classifyItems = JSON.parse(_response.modeldata);

        $('input#model-name, input#classify-name, input#classify-number, input#classify-price').val('');
        renderModelData();
        renderItemData();
      }
    }).fail(function(_xhr, _textStatus, _response){
      //  console.log(_xhr, _textStatus, _response);
    });
  }
  //}}}

  //{{{ TODO  Load label data
  const loadLabelData = () => {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({}),
      url: '/restFulAPI/readlabelData'
    }).done(function(_response){
      if (_response.returnStatus == '1') {
        var _modelData = _response.modeldata;
        if (_modelData != null) {
          $('input#model-name, input#classify-name').val('');
          _classifyItems = JSON.parse(_response.modeldata);
          renderModelData();
        }
      } else {
        actionText('No model');
      }
    }).fail(function(_xhr, _textStatus, _response){
      //  FIXME Error handle
    });
  }
  //}}}

  //{{{ TODO  Render model data
  const renderModelData = () => {
    $('#model-list').find('option[value]').remove();
    for (var _model in _classifyItems) {
      $('#model-list').append('<option value="' + _model + '">' + _model + '</option>');
    }
  }
  //}}}

  //{{{ TODO  Render item data
  const renderItemData = () => {
    $('#classify-list').find('option[value]').remove();
    var _currentModel = _classifyItems[$('#model-list').val()];
    for (var _item in _currentModel) {
      $('#classify-list').append('<option value="' + _item + '">' + _currentModel[_item].name + '</option>');
    }
  }
  //}}}

  //{{{ TODO  Render item detail
  const renderItemDetail = () => {
    var _currentModel = _classifyItems[$('#model-list').val()];
    var _itemNo = $('#classify-list').val();

    if (_itemNo == 'None') {
      $('input[id^=classify]').val('');
    } else {
      $('#classify-number').val(_itemNo);
      for (var _key in _currentModel[_itemNo]) {
        $('#classify-' + _key).val(_currentModel[_itemNo][_key]);
      }
    }
  }
  //}}}

  //{{{ TODO  When page ready, trigger the process.
  (async () => {

    //{{{ TODO  Generate the KNN classifier object.
    const createKNNClassifier = async() => {
      consoleText('Loading KNN Classifier.');
      return await knnClassifier.create();
    };
    //}}}

    //{{{ TODO  Generate the mobileNet object
    const createMobileNetModel = async() => {
      consoleText('Loading Mobilenet Model.');
      return await mobilenet.load();
    }
    //}}}

    //{{{ TODO  Connect the webcam
    const createWebcamInput = async() => {
      consoleText('Loading Webcam Input.');
      const webcamElement = await document.getElementById('webcam');
      try {
        return await tf.data.webcam(webcamElement);
      } catch(e) {
        consoleText(e.message);
        return null;
      }
    }
    //}}}

    //{{{ TODO  Add classify data
    const addDatasetClass = async (classId, times) => {
      var _count = 0;
      actionText('Learning.');
      while (_count < times) {
        const capturedImage = await webcamInput.capture();
        const activation = mobilenetModel.infer(capturedImage, 'conv_preds');
        knnClassifierModel.addExample(activation, classId);
        capturedImage.dispose();
        _count += 1;
      }
      actionText('Complete learning');
    }
    //}}}

    //{{{ TODO  Classify item
    const classifyItem = async () => {
      if (knnClassifierModel.getNumClasses() > 0) {
        const img = await webcamInput.capture();
        const activation = mobilenetModel.infer(img, 'conv_preds');
        const result = await knnClassifierModel.predictClass(activation);
        const exampleCount = await knnClassifierModel.classExampleCount;
        const _currentModel = $('#model-list').val();
        const _itemNo = result.label;
        //  FIXME test here, add training number
        predictionText(_classifyItems[_currentModel][_itemNo].name + ', barcode is ' + _itemNo + ' with trained ' + exampleCount[_itemNo] + ' times.');
      } else {
        actionText('No training model loaded.');
      }
    }
    //}}}

    //  FIXME Save to local, try to back up to cloud server
    //{{{ TODO  Save classifier data
    const saveClassifierData = async (classifierModel) => {
      let _modelName = $('#model-list').val();
      if (_modelName == '' || _modelName == 'None') {
        return;
      }

      let datasets = await classifierModel.getClassifierDataset();
      let datasetObject = {};
      
      Object.keys(datasets).forEach((key) => {
        let data = datasets[key].dataSync();
        datasetObject[key] = Array.from(data);
      });


      let downloader = document.createElement('a');
      downloader.download = _modelName + '.json';
      downloader.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(JSON.stringify(datasetObject));
      document.body.appendChild(downloader);
      downloader.click();
      downloader.remove();

      /*
      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          name: _modelName,
          classifierData: datasetObject
        }),
        url: '/restFulAPI/saveClassifierData'
      }).done(function(_response){
        actionText('Classifier data has been saved.');
      }).fail(function(_xhr, _textStatus, _response){
        //  console.log(_xhr, _textStatus, _response);
      });
      */
    }
    //}}}

    //  FIXME load from local, try to load from cloud server
    //{{{ TODO  Load classify data
    const loadClassifierData = async (_classifierModel, _e) => {
      actionText('Load classifier data');
      let inputModel = _e.target.files;
      actionText('Loading...');
      let fr = new FileReader();
      if (inputModel.length > 0) {
        fr.onload = async function() {
          var dataset = fr.result;
          var tensorObj = JSON.parse(dataset);

          Object.keys(tensorObj).forEach(function(key){
            tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
          });
          _classifierModel.setClassifierDataset(tensorObj);
          actionText('Classifier has been set up! Congrats!');
        }
        await fr.readAsText(inputModel[0]);
        actionText('Uploaded');
      }

      /*
      let _modelName = $('#model-list').val();
      if (_modelName == '' || _modelName == 'None') {
        return;
      }

      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          name: _modelName
        }),
        url: '/restFulAPI/readClassifierData'
      }).done(function(_response){
        if (_response.returnStatus == '1') {
          var _modelData = _response.modeldata;
          console.log(_modelData);
        }
      }).fail(function(_xhr, _textStatus, _response){
        //  console.log(_xhr, _textStatus, _response);
      });
      */
    }
    //}}}

    const mobilenetModel = await createMobileNetModel();
    const knnClassifierModel = await createKNNClassifier();
    const webcamInput = await createWebcamInput();

    loadLabelData();

    //{{{ TODO  functional model button
    $('#model-form button').click(function(e){
      var _target = $(e.target);
      switch (_target.attr('id')) {
        case 'add-model':
          modifyModelObject(1, false, $('#model-name').val());
          break;
        case 'remove-model':
          modifyModelObject(0, false, $('#model-list').val());
          break;
        case 'add-classify':
          modifyModelObject(1, true, $('#classify-number').val());
          break;
        case 'remove-classify':
          modifyModelObject(0, true, $('#classify-list').val());
          break;
        case 'train':
          var _classifyItem = $('#classify-list').val();
          if ((_classifyItem == '' || _classifyItem == 'None')) {
            //  FIXME Prevent training process
            actionText('Please select the training target.');
          } else {
            //  var _count = 0;
            //  var _trainingInterval = setInterval(function(){
            //    _count += 1;
            //    if (_count > 200) {
            //      clearInterval(_trainingInterval);
            //    } else {
            //      console.log(_count);
            //    }
            //  }, 500);
            addDatasetClass(_classifyItem, 200);
          }
          break;
        case 'classify':
          classifyItem();
          break;
        case 'save-classifydata':
          saveClassifierData(knnClassifierModel);
          break;
      }
    });
    //}}}

    //  TODO Load the classify data
    $('#load').change(function(e){
      loadClassifierData(knnClassifierModel, e);
    });

    //  TODO Render data
    $('#model-list').change(function(e){
      renderItemData();
    });

    $('#classify-list').change(function(e){
      renderItemDetail();
    });
  })();
  //}}}
});
