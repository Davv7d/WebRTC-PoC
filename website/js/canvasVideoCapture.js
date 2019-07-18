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