const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
// Hide the spinner.
document.body.classList.add('loaded');


// Update the frame rate.
//   fpsControl.tick();

// Draw the overlays.
canvasCtx.save();
canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
canvasCtx.drawImage(
  results.image, 0, 0, canvasElement.width, canvasElement.height);
if (results.multiHandLandmarks && results.multiHandedness) {
for (let index = 0; index < results.multiHandLandmarks.length; index++) {
  const classification = results.multiHandedness[index];
  const isRightHand = classification.label === 'Right';
  const landmarks = results.multiHandLandmarks[index];
  drawConnectors(
      canvasCtx, landmarks, HAND_CONNECTIONS,
      {color: isRightHand ? '#00FF00' : '#FF0000'}),
  drawLandmarks(canvasCtx, landmarks, {
    color: isRightHand ? '#00FF00' : '#FF0000',
    fillColor: isRightHand ? '#FF0000' : '#00FF00',
    radius: (x) => {
      return lerp(x.from.z, -0.15, .1, 10, 1);
    }
  });
}

// console.log(results.multiHandedness);
if(results.multiHandLandmarks.length == 1){

if(results.multiHandedness[0].index==0){ //for left
        globalVariable.x1 = results.multiHandLandmarks[0][0].x * 1280;
        globalVariable.y1 = results.multiHandLandmarks[0][0].y *720;
        globalVariable.z1 = Math.abs(results.multiHandLandmarks[0][5].x - results.multiHandLandmarks[0][17].x) *1280;
        globalVariable.dist1 = Math.abs(results.multiHandLandmarks[0][8].x - results.multiHandLandmarks[0][4].x) *1280;
        globalVariable.x2 = -1000;
        globalVariable.y2 = -1000; 
}
else if(results.multiHandedness[0].index==1){ //for right
        globalVariable.x2 = results.multiHandLandmarks[0][0].x * 1280;
        globalVariable.y2 = results.multiHandLandmarks[0][0].y *720;
        globalVariable.z2 = Math.abs(results.multiHandLandmarks[0][5].x - results.multiHandLandmarks[0][17].x) *1280;
        globalVariable.dist2 = Math.abs(results.multiHandLandmarks[0][8].x - results.multiHandLandmarks[0][4].x) *1280;
        globalVariable.x1 = -1000;
        globalVariable.y1 = -1000; 

}


}
else if(results.multiHandLandmarks.length == 2){

    if(results.multiHandedness[0].index==0){ //for left
            globalVariable.x1 = results.multiHandLandmarks[0][0].x * 1280;
            globalVariable.y1 = results.multiHandLandmarks[0][0].y *720;
            globalVariable.z1 = Math.abs(results.multiHandLandmarks[0][5].x - results.multiHandLandmarks[0][17].x) *1280;
            globalVariable.dist1 = Math.abs(results.multiHandLandmarks[0][8].x - results.multiHandLandmarks[0][4].x) *1280;
    }
    else if(results.multiHandedness[0].index==1){ //for right
            globalVariable.x2 = results.multiHandLandmarks[0][0].x * 1280;
            globalVariable.y2 = results.multiHandLandmarks[0][0].y *720;
            globalVariable.z2 = Math.abs(results.multiHandLandmarks[0][5].x - results.multiHandLandmarks[0][17].x) *1280;
            globalVariable.dist2 = Math.abs(results.multiHandLandmarks[0][8].x - results.multiHandLandmarks[0][4].x) *1280;
    
    }
    
    if(results.multiHandedness[1].index==0){ //for left
        globalVariable.x1 = results.multiHandLandmarks[1][0].x * 1280;
        globalVariable.y1 = results.multiHandLandmarks[1][0].y *720;
        globalVariable.z1 = Math.abs(results.multiHandLandmarks[1][5].x - results.multiHandLandmarks[1][17].x) *1280;
        globalVariable.dist1 = Math.abs(results.multiHandLandmarks[1][8].x - results.multiHandLandmarks[1][4].x) *1280;
}
    else if(results.multiHandedness[1].index==1){ //for right
        globalVariable.x2 = results.multiHandLandmarks[1][0].x * 1280;
        globalVariable.y2 = results.multiHandLandmarks[1][0].y *720;
        globalVariable.z2 = Math.abs(results.multiHandLandmarks[1][5].x - results.multiHandLandmarks[1][17].x) *1280;
        globalVariable.dist2 = Math.abs(results.multiHandLandmarks[1][8].x - results.multiHandLandmarks[1][4].x) *1280;

}
    
    }
}
else{
    globalVariable.x1 = -1000;
    globalVariable.y1 = -1000; 
    globalVariable.x2 = -1000;
    globalVariable.y2 = -1000; 
}
canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});
hands.onResults(onResults);
/**
* Instantiate a camera. We'll feed each frame we receive into the solution.
*/
const camera = new Camera(videoElement, {
onFrame: async () => {
await hands.send({image: videoElement});
},
width: 1280,
height: 720
});
camera.start();
