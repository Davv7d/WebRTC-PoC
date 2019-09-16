(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const constraints = {
    audio: false,
    video: true
  };
var canvas;
var filterSelect;
var video;
async function init(e,videoStream,canvasID,canvasSnapFiltr){
    try{

        video = window.video = document.querySelector(videoStream);
        canvas = window.canvas = document.querySelector(canvasID);
        filterSelect = canvasSnapFiltr;
        
        filterSelect.onchange = function(){
            video.className = filterSelect.value
            
        }
        canvas.width = 640;
        canvas.height = 480;

        navigator.mediaDevices.getUserMedia(constraints).then(stream =>{
            window.stream = stream;
            video.srcObject = stream;  
        }).catch(error => {
            cosole.error("error in function getUserMedia",error);
        });

        }catch(e){
        console.error(e);  
    }
};
function snap(){
    console.log('snap');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log(canvas)
    console.log(video)
    canvas.className = filterSelect.value;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
}



module.exports = {init,snap}
},{}],2:[function(require,module,exports){
var script_video = require('./script_video.js');
//var script_video = require('./getAudioParameters.js');
var canvasVideoCapture = require('./canvasVideoCapture.js');
var rtcp2p = require("./rtcp2p.js");

// Example I
console.log("Example I");
document.querySelector('#connectUser').addEventListener('click', e => script_video.init(e,"#videoUser"));
document.querySelector('#mirrorButton').addEventListener('click', function(){document.querySelector('#mirror').style.display = "inline"});


//Example II
console.log("Example II");
const canvasSnapFiltr = document.querySelector('select#filter');
document.querySelector('#snapButton').addEventListener('click',e => {
    canvasVideoCapture.init(e,"#videoForSnap","#canvasSnapShot",canvasSnapFiltr);
    document.querySelector('#snapShot').style.display = "inline";
    });
    document.querySelector('#makeSnapShot').addEventListener('click',e => canvasVideoCapture.snap());


//Example III




//Example IV
console.log("Example III");
document.querySelector('#RTCp2pButton').addEventListener('click', function(){document.querySelector('#RTCp2p').style.display = "inline"});

    document.querySelector("#startRTCp2p").addEventListener('click',function() {rtcp2p.start()});
    document.querySelector("#callRTCp2p").addEventListener('click',function() {rtcp2p.call()});
    document.querySelector("#hangupRTCp2p").addEventListener('click',function() {rtcp2p.hangup()});



//    "start": "nodemon --exec \"npm run parse && node index.js \" --ignore ./website/bundle.js --watch website -e html,js"
},{"./canvasVideoCapture.js":1,"./rtcp2p.js":3,"./script_video.js":4}],3:[function(require,module,exports){

const constraints = window.constraints = {
    audio: false,
    video: true
};

//Ustawienia servera
const configuration = {
    bundlePolicy:"max-bundle",
    iceServers:[{
        urls: "stun:stun.services.mozilla.com",
        username: "louis@mozilla.com", 
        credential: "webrtcdemo"
    }]
};


let startTime;
const localVideo = document.querySelector("#RTCp2pUser1");
const guestVideo = document.querySelector("#RTCp2pUser2");

localVideo.addEventListener('loadedmetadata', function() {
    console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
  });
  
  guestVideo.addEventListener('loadedmetadata', function() {
    console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
  });
  
  guestVideo.addEventListener('resize', () => {
    console.log(`Remote video size changed to ${guestVideo.videoWidth}x${guestVideo.videoHeight}`);
    // We'll use the first onsize callback as an indication that video has started
    // playing out.
    if (startTime) {
      const elapsedTime = window.performance.now() - startTime;
      console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
      startTime = null;
    }
  });

  var localStream;
  let pc1;
  let pc2;

  const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
  };

  function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
  }
  
  function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
  }

async function start(){
    try {
       
        console.log('Request for local stream');
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('received local stream');
        localVideo.srcObject = stream;
        localStream = stream;
        console.log('start success')
        
    }catch(e){
        console.error('getUserMedia() error:',e.name);
    }
};

async function call(){
    console.log("start call");
    startTime = window.performance.now(); //do zliczania czasu 
    console.log('RTCPEErConnection configuration:',configuration)
    
    
    pc1 = new RTCPeerConnection(configuration);



    
    console.log('Created local peer connection object pc1');
    pc2 = new RTCPeerConnection(configuration);
    console.log('Created local peer connection object pc2');
//TO ADDD
    console.log('pc1: ', pc1);
    pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
    pc1.addEventListener('oniceconnectionstatechange', e => onIceStateChange(pc1, e));
   // pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e)); // już nie ma a przynajmniej w firefox 
    pc2.addEventListener('track', e => gotRemoteStream(e));
    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
    console.log('Added local stream to pc1');

try{
    console.log('pc1 createOffer start');
    const offer = await pc1.createOffer(offerOptions);
    await onCreateOfferSuccess(offer);
}catch(e){
    console.log(`Failed to create session description: ${e.toString()}`);
}

};
async function onCreateOfferSuccess(desc){
                // PC1 
    console.log(`Offertfrpmpc1\n ${desc.spd}`);
    try{
        await pc1.setLocalDescription(desc);
    }catch(e){
        console.log(`Failed to set session description: ${e.toString()}`);
    }

                // PC2
    console.log("setGuesetDescription");
    try{
        await pc2.setRemoteDescription(desc);
    }catch(e){
    console.log(`Failed to set session description: ${e.toString()}`);
    }

    try{
        const answer = await pc2.createAnswer();
        await onCreateAnswerSuccess(answer);
    }catch(e){
        console.log(`Failed to set session description: ${e.toString()}`);
    }

};

function gotRemoteStream(e){
    console.log("gotRemoteStream",e);
    if(guestVideo.srcObject !== e.streams[0]){
        guestVideo.srcObject = e.streams[0];
        console.log('p2p received remote stream');
    }
};

async function onCreateAnswerSuccess(desc){
    console.log(`Answer from pc2:\n${desc.sdp}`);
    try{
        await pc2.setLocalDescription(desc);
    }catch(e){
        console.log(`Failed to set session description: ${e.toString()}`);
    }
    console.log("pc1 setRemoteDescription start");
    try{
        await pc1.setRemoteDescription(desc);
    }catch(e){
        console.log(`Failed to set session description: ${e.toString()}`);
    }    
}

async function onIceCandidate(pc,event){
    try{
        await (getOtherPc(pc).addIceCandidate(event.candidate));
        console.log(`${getName(pc)} addIceCandidate success`);
    }catch(e){
        console.log(`${getName(pc)} failed to add ICE Candidate: ${e.toString()}`);
    }
    console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);

}
function onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  }

function hangup(){
    console.log('Ending call');
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;

};


module.exports = {start,call,hangup}
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
},{}]},{},[2]);
