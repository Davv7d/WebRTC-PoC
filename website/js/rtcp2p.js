
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
pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));
pc2.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2, e));
pc2.addEventListener('track', gotRemoteStream);

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
    if(guestVideo.srcObject !== e.stream[0]){
        guestVideo.srcObject = e.stream[0];
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
function hangup(){
    console.log('Ending call');
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;

};


module.exports = {start,call,hangup}