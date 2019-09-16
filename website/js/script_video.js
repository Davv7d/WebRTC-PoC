'use strict';

// Set multimedia parametrs:
//  video and audio
const constraints = window.constraints = {
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
  }
  
};


  /*
  You can also declarate things like:
  Frame Rate and which device you wont us
  */

// Variable for sendingour stream of video


function handleSuccess(stream,videoDestiny) {
  // Setting adress of video object to variable 
  const video = document.querySelector(videoDestiny);
  //collection information about device used(camera )
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  //console.log(`videoTracks[0].stop() ${videoTracks[0].stop()}`);

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
  
  // try {  
  //   var videoDestiny = videoOwner;
  //   /*
  //     Do zrobienia by działało na wszystkich przegladarkach teraz tylko firefox
  //   */
   
  //  console.log("! 1",constraints);
  //   var stream = await navigator.mediaDevices.getUserMedia(constraints);
  //   console.log("2");

  //   handleSuccess(stream,videoDestiny);
  //   console.log("3");
    
  
  // } catch (e) {
  //   handleError(e);
  // }
  




  
  navigator.mediaDevices.getUserMedia(
      {
        audio: false,
        video:true
      }
  ).then(stream =>{
        const video = document.querySelector(videoOwner);
        video.srcObject = stream;

        let myVideoTrack = stream.getTracks();
        console.log(myVideoTrack);
    
  }).catch(e=>{ console.error(e)})
  



let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
for (let constraint in supportedConstraints) {
  if (supportedConstraints.hasOwnProperty(constraint)) {
    console.log(constraint);
  }
}

























}

module.exports = {init, constraints}