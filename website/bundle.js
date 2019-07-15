(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

async function init(e,videoStream,canvasID){
    try{
        const video = document.querySelector(videoStream);
        const canvas = window.canvas = document.querySelector(canvasID);
        canvas.width = 480;
        canvas.height = 360;
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        }catch(e){
        console.error(e);  
    }
};

module.exports = {init}
},{}],2:[function(require,module,exports){
var script_video = require('./script_video.js');
//var script_video = require('./getAudioParameters.js');
var canvasVideoCapture = require('./canvasVideoCapture.js');
var rtcp2p = require("./rtcp2p.js");

// Example I
console.log("abcd");
document.querySelector('#connectUser').addEventListener('click', e => script_video.init(e,"#videoUser",true));
document.querySelector('#mirrorButton').addEventListener('click', function(){document.querySelector('#mirror').style.display = "inline"});


//Example II
document.querySelector('#snapButton').addEventListener('click',e => {
    script_video.init(e,"#videoForSnap",true),
    document.querySelector('#snapShot').style.display = "inline"
    });
document.querySelector('#makeSnapShot').addEventListener('click',e => canvasVideoCapture.init(e,"#videoForSnap","#canvasSnapShot"));


//Example III
document.querySelector('#RTCp2pButton').addEventListener('click', function(){document.querySelector('#RTCp2p').style.display = "inline"});
document.querySelector("#startRTCp2p").addEventListener('click', e => rtcp2p.init(e,"#RTCp2pUser1","#RTCp2pUser2"));


//    "start": "nodemon --exec \"npm run parse && node index.js \" --ignore ./website/bundle.js --watch website -e html,js"
},{"./canvasVideoCapture.js":1,"./rtcp2p.js":3,"./script_video.js":4}],3:[function(require,module,exports){

async function start(){
    
}

async function call(){

}

function hangup(){
    console.log('Ending call');

}


async function init(e,streamName,guestName){
    try{
        let startTime;
        const localVideo = document.querySelector(streamName);
        const guestVideo = document.querySelector(guestName);

        console.log(localVideo,guestName)
        localVideo.addEventListener('loadedmetadata', function() {
            console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
          });
          
        guestVideo.addEventListener('loadedmetadata', function() {
            console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
          });
          
        
    }catch(e){
        console.log("Error: ",e);
    }
    



}



module.exports = {init,start,call,hangup}
},{}],4:[function(require,module,exports){
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



async function init(e,videoOwner,run) {
  
  try {  
    var videoDestiny = videoOwner;
    /*
      Do zrobienia by działało na wszystkich przegladarkach teraz tylko firefox
    */
   console.log("! 1",constraints);
    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("2");
    if (run == true){
    handleSuccess(stream,videoDestiny);
    console.log("3");
    }else{
      return stream;
    }

    e.target.disabled = true;
  
  } catch (e) {
    handleError(e);
  }
}

module.exports = {init, constraints}
},{}]},{},[2]);
