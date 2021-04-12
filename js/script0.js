const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton1 = document.getElementById('webcamButton1');
const enableWebcamButton2 = document.getElementById('webcamButton2');
const enableWebcamButton3 = document.getElementById('webcamButton3');

var offset = window.innerWidth/12 * 8 + 680;
var dict ={
  "cup": "img/Cup.glb",
  "spoon": "img/spoon.glb",
  "bottle": "img/Bottle.glb",
  "remote": "img/remote.glb",
}
// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will 
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton1.addEventListener('click', enableCam);
    enableWebcamButton2.addEventListener('click', enableCam);
    enableWebcamButton3.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  
  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the COCO-SSD has finished loading.
    document.getElementById("inst").classList.add("removed");

    if (!model) {
      return;
    }
    
    // Hide the button once clicked.
    // event.target.classList.add('removed');  
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }

// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  // Show demo section now model is ready to use.
  // demosSection.classList.remove('invisible');
});

var children = [];
var turn = 1;
function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0]*(680/480) +offset + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10)*(680/480) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10)*(680/480)+ 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0]*(680/480)+offset+700 + 'px; top: '
            + predictions[n].bbox[1]*(680/480) + 'px; width: ' 
            + predictions[n].bbox[2]*(680/480) + 'px; height: '
            + predictions[n].bbox[3]*(680/480) + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
        // console.log(predictions[n].class);
        if(predictions[n].class == "cup" || predictions[n].class == "remote" || predictions[n].class == "spoon" || predictions[n].class == "bottle"){
          var which_one;
          if(turn == 1){
            which_one = enableWebcamButton1;
            turn = 2;
          }else if(turn == 2){
            which_one = enableWebcamButton2;
            turn = 3;
          }else{
            which_one = enableWebcamButton3;
            turn = 1;
          }
          which_one.innerHTML = predictions[n].class;
          if(turn == 2){
            globalVariable.char1 = predictions[n].class
            console.log(globalVariable.char1);
            globalVariable.char1path = dict[predictions[n].class]
            console.log(globalVariable.char1path);
          }
          else if (turn == 3){
            globalVariable.char2 = predictions[n].class
          }
          else if (turn == 1){
            globalVariable.char3 = predictions[n].class
          }
          // which_one.disable = 'true';
          which_one.classList.add('disabled')
          return;
        }
      }
    }
    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}

