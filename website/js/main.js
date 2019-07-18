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