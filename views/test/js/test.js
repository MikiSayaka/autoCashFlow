const start = async() => {
  const createKNNClassifier = async() => {
    console.log('Loading KNN Classifier.');
    return await knnClassifier.create();
  };
  const createMobileNetModel = async() => {
    console.log('Loading Mobilenet Model.');
    return await mobilenet.load();
  }
  const createWebcamInput = async() => {
    console.log('Loading Webcam Input.');
    const webcamElement = await document.getElementById('webcam');
    try {
      return await tf.data.webcam(webcamElement);
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  const mobilenetModel = await createMobileNetModel();
  const knnClassifierModel = await createKNNClassifier();
  const webcamInput = await createWebcamInput();

  const initializeElements = () => {
    console.log('Initialize elements');
    $('#load').change(function(e){
      uploadModel(knnClassifierModel, e)
    });
    $('#save').click(async function(e){
      downloadModel(knnClassifierModel);
    });
    $('#class-n').click(function(e){
      addDatasetClass(0);
    });
    $('#class-a').click(function(e){
      addDatasetClass(1);
    });
    $('#class-b').click(function(e){
      addDatasetClass(2);
    });
    $('#class-c').click(function(e){
      addDatasetClass(3);
    });
  };

  const saveClassifier = async (classifierModel) => {
    console.log('Save classifier data');
    let datasets = await classifierModel.getClassifierDataset();
    let datasetObject = {};

    Object.keys(datasets).forEach((key) => {
      let data = datasets[key].dataSync();
      datasetObject[key] = Array.from(data);
    });

    let ljsonModel = JSON.stringify(datasetObject);
    let downloader = document.createElement('a');
    downloader.download = 'Model.json';
    downloader.href = 'data:text/text;charset=utf-8,' + encodeURIComponent(jsonModel);
    document.body.appendChild(downloader);
    downloader.click();
    downloader.remove();
  };

  const loadClassifier = async (classifierModel, event) => {
    console.log('Load classifier data');
    let inputModel = event.target.files;
    console.log('Loading...');
    let fr = new FileReader();
    if (inputModel.length > 0) {
      fr.onload = async function() {
        var dataset = fr.result;
        var tensorObj = JSON.parse(dataset);

        Object.keys(tensorObj).forEach(function(key){
          tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
        });
        classifierModel.setClassifierDataset(tensorObj);
        console.log('Classifier has been set up! Congrats!');
      }
    }
    await fr.readAsText(inputModel[0]);
    console.log('Uploaded');
  };

  const uploadModel = async (classifierModel, event) => {
    console.log('Upload model to server');
    loadClassifier(classifierModel, event);
  };

  const downloadModel = async (classifierModel) => {
    console.log('Download model from server');
    saveClassifier(classifierModel);
  };

  //  FIXME here
  const addDatasetClass = async (classId) => {
    console.log('Add dataset');
    const capturedImage = await webcamInput.capture();
    const activation = mobilenetModel.infer(capturedImage, 'conv_preds');
    knnClassifierModel.addExample(activation, classId);
    capturedImage.dispose();
  };

  //  FIXME here
  const imageClassificationWithTransferLearningOnWebcam = async () => {
    console.log('Classification image from webcam');
    while(true){
      if (knnClassifierModel.getNumClasses() > 0) {
        const img = await webcamInput.capture();
        const activation = mobilenetModel.infer(img, 'conv_preds');
        const result = await knnClassifierModel.predictClass(activation);

        const classes = ['N', 'A', 'B', 'C'];
        document.getElementById('console').innerText = `prediction: ${classes[result.label]} \n probability: ${result.confidences[result.label]} `;
        img.dispose();
      }
      await tf.nextFrame();
    }
  };

  await initializeElements();
  await imageClassificationWithTransferLearningOnWebcam();
}

//  TODO  On training web initial
$(document).ready(function(){
  console.log('Hello');
  start();
});
