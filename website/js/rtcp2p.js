
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

        console.log(localVideo,guestVideo)
        localVideo.addEventListener('loadedmetadata', function() {
            console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
          });
          
        guestVideo.addEventListener('loadedmetadata', function() {
            console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
          });
          
        remoteVideo.addEventListener('resize', () => {
            console.log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
            // We'll use the first onsize callback as an indication that video has started
            // playing out.
            if (startTime) {
                const elapsedTime = window.performance.now() - startTime;
                console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
                startTime = null;
            }
        });


        let localStream;
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


    }catch(e){
        console.log("Error: ",e);
    }
    



}



module.exports = {init,start,call,hangup}