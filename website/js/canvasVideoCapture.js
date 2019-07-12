
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