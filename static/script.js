var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
const video = document.getElementById("videoElement");
const FPS = 1;
var txt = document.getElementById('display-password').textContent;
video.width = 400;
video.height = 300;

var message = 'No message sent';

function talk() {
    window.speechSynthesis.cancel();

    if(message == 'nothing'){
        var msg = new SpeechSynthesisUtterance();
        msg.text = 'Still generating';
        window.speechSynthesis.speak(msg);
    }
    else{
        var msg = new SpeechSynthesisUtterance();
        msg.text = message;
        window.speechSynthesis.speak(msg);
    }
}

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

function sendToServer(text, data) {
    // Use HTTP POST to send image and text to the server
    fetch('/upload_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: data, 'text': text }),
    })
    .then(response => { console.log(response); return response.json()})
    .then(data => {
        console.log('Image sent successfully:', data);
        message = data['message'];
    })
    .catch(error => {
        console.error('Error sending image:', error);
    });
}

function GetSpeech() {
    window.speechSynthesis.cancel();

     console.log("clicked microphone");

    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

        recognition.onstart = () => {
            console.log("start");
        }
        recognition.onspeechend = (event) => {
            console.log("stopped listening");
            recognition.stop();
        }
        recognition.onresult = (result) => {
            document.getElementById('display-password').textContent = result.results[0][0].transcript;
            // sendToServer(rec, data);
         }
        //desktop only
        //  recognition.onend = function(event) {
        //     if (rec === 0) {
        //         console.log("No speech was recognized.");
        //         document.querySelector('button').textContent = "No speech was recognized";
        //         var msg = new SpeechSynthesisUtterance();
        //         msg.text = 'No speech was recognized';
        //         window.speechSynthesis.speak(msg);
        //     }
        // }
        recognition.start();
}

function serverMsg(){
    window.speechSynthesis.cancel();
    message = 'nothing';
    width = video.width;
    height = video.height;
    context.drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/jpeg', 0.5);
    context.clearRect(0, 0, width, height);

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'sent message';
    window.speechSynthesis.speak(msg);

    txt = document.getElementById('display-password').textContent;
    sendToServer(txt, data);
}

function RepeatSent(){
    window.speechSynthesis.cancel();
    the_mes = document.getElementById('display-password').textContent;
    if (the_mes == ''){
        var msg = new SpeechSynthesisUtterance();
        msg.text = 'nothing entered';
        window.speechSynthesis.speak(msg);
    }
    else{
        var msg = new SpeechSynthesisUtterance();
        msg.text = the_mes;
        window.speechSynthesis.speak(msg);
    }
}

document.addEventListener('dblclick', () => {
    window.speechSynthesis.cancel();

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'Window Switched';
    window.speechSynthesis.speak(msg);

    document.querySelector('form').submit();

});

