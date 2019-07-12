'use strict';

// Set multimedia parametrs:
//  video and audio
window.constraints = {
  audio: false,
  video: {
    width:{
      min:320,
      max:1280
    },
    height:{
      min: 240,
      max: 720
    }
    //we can add some CSS filters

  }
};

const constraints = window.constraints;
  /*
  You can also declarate things like:
  Frame Rate and which device you wont us
  */

// Variable for sendingour stream of video
var localstream; // var or not to var

function handleSuccess(stream,videoDestiny) {
  // Setting adress of video object to variable 
  const video = document.querySelector(videoDestiny);
  //collection information about device used(camera )
  const videoTracks = stream.getVideoTracks();
  // saving the data stream to a global variable
  localstream = stream; 
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  //console.log(`videoTracks[0].stop() ${videoTracks[0].stop()}`);
// !!! I am not sure about it , I mean if we need it for anything ????
  window.stream = stream; // make variable available to browser console
  //Transmit video data to object in html 
  video.srcObject = stream;
}

//Error handling
function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    let v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUsenpm userMedia error: ${error.name}`, error);
}

//Function that showing usser error in div with Id=errorMsg
function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e,videoOwner) {
  
  try {  
    var videoDestiny = videoOwner;
    /*
      Do zrobienia by działało na wszystkich przegladarkach teraz tylko firefox
    */
    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream,videoDestiny);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

module.exports = {init, constraints, localstream}