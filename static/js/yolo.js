var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
const video = document.getElementById("videoElement");
const FPS = 1;
video.width = 400;
video.height = 300;
var message;
var message2;


if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment'
        }
    })
        .then(function (stream) {
            console.log(4)
         //resolve stream and set the html src of the video and then play video  
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err0r) {
         //reject error
        });
}

let input = document.getElementById('input');
input.addEventListener('click', function() {
    console.log(2)
    var msg = new SpeechSynthesisUtterance();
    msg.text = message;
    console.log(message);
    window.speechSynthesis.speak(msg);
}); 

let input2 = document.getElementById('input2');
input2.addEventListener('click', function() {
    console.log(2)
    var msg = new SpeechSynthesisUtterance();
    msg.text = message2;
    console.log(message2);
    window.speechSynthesis.speak(msg);
}); 

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment'
        }
    })
        .then(function (stream) {
            console.log(4)
         //resolve stream and set the html src of the video and then play video  
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err0r) {
         //reject error
        });
}

setInterval(() => {
    console.log(5);

    width = video.width;
    height = video.height;

    console.log(window.innerHeight);

    if(window.innerHeight > 700){
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -width, 0, width, height);
        context.restore();

        var data = canvas.toDataURL('image/jpeg', 0.5);
        context.clearRect(0, 0, width, height);
    }
    else{
        context.drawImage(video, 0, 0, width, height);
        var data = canvas.toDataURL('image/jpeg', 0.5);
        context.clearRect(0, 0, width, height);
    }

    // Use HTTP POST 
    fetch('/yolo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'image': data }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Image sent successfully:', data);
        message = data['objs'];
        message2 = data['objspos'];
        console.log(message);
        console.log(message2);
        input2.textContent = message2;
        input.textContent = message;
    })
    .catch(error => {
        console.error('Error sending image:', error);
    });
}, 1000 / FPS);

document.addEventListener('dblclick', () => {
    window.speechSynthesis.cancel();

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'Image chat mode';
    window.speechSynthesis.speak(msg);

    document.querySelector('form').submit();

});
