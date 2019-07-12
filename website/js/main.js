var script_video = require('./script_video.js');
//var script_video = require('./getAudioParameters.js');
var canvasVideoCapture = require('./canvasVideoCapture.js');
// Example I
document.querySelector('#connectUser').addEventListener('click', e => script_video.init(e,"#videoUser"));
document.querySelector('#mirrorButton').addEventListener('click', function(){document.querySelector('#mirror').style.display = "inline"});


//Example II
document.querySelector('#snapButton').addEventListener('click',e => {
    script_video.init(e,"#videoForSnap"),
    document.querySelector('#snapShot').style.display = "inline"
    });
document.querySelector('#makeSnapShot').addEventListener('click',e => canvasVideoCapture.init(e,"#videoForSnap","#canvasSnapShot"));