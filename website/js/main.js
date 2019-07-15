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