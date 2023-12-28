var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
const video = document.getElementById("videoElement");

video.width = 400;
video.height = 300;

var message;

console.log(1)
let input = document.querySelector('input');
input.addEventListener('input', function() {
    console.log(2)
    x = GetSpeech();
    // convertToSpeech('hello')
    var msg = new SpeechSynthesisUtterance();
    msg.text = message;
    console.log(message);
    window.speechSynthesis.speak(msg);
}); 
console.log(3)


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

const FPS = 1;
setInterval(() => {
    console.log(5)

    width = video.width;
    height = video.height;
    context.drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/jpeg', 0.5);
    context.clearRect(0, 0, width, height);

    // Use HTTP POST to send image to the server
    fetch('/upload_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: data }),
    })
    .then(response => { console.log(response); return response.json()})
    .then(data => {
        console.log('Image sent successfully:', data);
        message = data['message'];
    })
    .catch(error => {
        console.error('Error sending image:', error);
    });
}, 1000 / FPS);


function GetSpeech() {
     console.log("clicked microphone");
    // var msg = new SpeechSynthesisUtterance();
    // msg.text = "message";
    // window.speechSynthesis.speak(msg);

    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

        recognition.onstart = () => {
            console.log("starting listening, speak in microphone");
        }
        recognition.onspeechend = () => {
            console.log("stopped listening");
            recognition.stop();
            audio = document.getElementById('audioPlayer');
            audio.play();
        }
        recognition.onresult = (result) => {
            console.log(result.results[0][0].transcript);
            document.querySelector('ul').innerHTML = result.results[0][0].transcript;
            return result.results[0][0].transcript;
         }
        recognition.start();
}

