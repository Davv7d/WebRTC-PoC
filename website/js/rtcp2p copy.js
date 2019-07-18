
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

const localVideo = document.querySelector("#RTCp2pUser1");
const guestVideo = document.querySelector("#RTCp2pUser2");

localVideo.addEventListener('loadedmetadata', function() {
    console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
  });
  
guestVideo.addEventListener('loadedmetadata', function() {
    console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
  });
  var localStream;
  let pc1;
  let pc2;

  const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
  };


async function start(){
        //tworzymy obekt RTCPeerConnection
    try{
        console.log('RTCPEErConnection configuration:',configuration)
        const localPeerConnection = new RTCPeerConnection(configuration);
        localPeerConnection.addEventListener('icecandidate',handleConnection);
        localPeerConnection.addEventListener('oniceconnectionstatechange',handleConnectionChange);
    }catch(e){
        console.error('RTCPeerConnection error',e.name)
    }
        //pobieramy strumien multimediow i przekazujemy go do obiektu video oraz RTCPeerConnection
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localVideo.srcObject = stream;
        localStream = stream;   //zapisanie wartosci 'globalnie'
        localPeerConnection.addStream(localStream);
        console.log('start success')
    }catch(e){
        console.error('getUserMedia() error:',e.name);
    }

};
function handleConnection(event){
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if(iceCandidate){
        const newIceCandidate = new RTCIceCandidate(onIceCandidate);
        const otherPeer = getOtherPeer(peerConnection);

        

    }



}

async function call(){
    
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