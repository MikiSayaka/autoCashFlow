$(document).ready(function(){
  let net;
  const webcamElement = document.getElementById('webcam');
  (async () => {
    $('#console #status').append('<div>Loading mobilenet...</div>');

    //  Load the model.
    net = await mobilenet.load();
    $('#console #status').append('<div>Mobilenet loaded</div>');

    //  Create an object from Tensorflow.js data API which could capture image 
    //  from the web camera as Tensor.
    const webCamConfig = {
      facingMode: 'environment'
    }

    try {
      const webcam = await tf.data.webcam(webcamElement, webCamConfig);

      $('#checkObj').click(function(){
        captureTheFrame();
      });

      async function captureTheFrame() {
        const img = await webcam.capture();
        const result = await net.classify(img);

        $('#console #prediction #name').text(result[0].className);
        $('#console #prediction #probability').text(result[0].probability);

        //  Dispose the tensor to release the memory.
        img.dispose();
      }
      //  while (true) {
      //    const img = await webcam.capture();
      //    const result = await net.classify(img);

      //    $('#console #prediction #name').text(result[0].className);
      //    $('#console #prediction #probability').text(result[0].probability);

      //    //  Dispose the tensor to release the memory.
      //    img.dispose();

      //    //  Give some breathing room by waiting for the next animation frame to
      //    //  fire.
      //    await tf.nextFrame();
      //  }
    } catch(e) {
      $('#console #status').append('<div>Cannot get webcam!</div>');
      console.log(e);
    }
  })();
});
