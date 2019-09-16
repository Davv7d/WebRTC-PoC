var script_video = require('./script_video.js');
//var script_video = require('./getAudioParameters.js');
var canvasVideoCapture = require('./canvasVideoCapture.js');


// Example I
console.log("Example I");
document.querySelector('#connectUser').addEventListener('click', e => script_video.init(e,"#vide1"));
document.querySelector('#mirrorButton').addEventListener('click', function(){document.querySelector('#mirror').style.display = "inline"});


//Example II
console.log("Example II");
const canvasSnapFiltr = document.querySelector('select#filter');
document.querySelector('#snapButton').addEventListener('click',e => {
    canvasVideoCapture.init(e,"#videoForSnap","#canvasSnapShot",canvasSnapFiltr);
    document.querySelector('#snapShot').style.display = "inline";
    });
    document.querySelector('#makeSnapShot').addEventListener('click',e => canvasVideoCapture.snap());




//    "start": "nodemon --exec \"npm run parse && node index.js \" --ignore ./website/bundle.js --watch website -e html,js"