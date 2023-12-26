var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
const video = document.querySelector("#videoElement");

video.width = 400;
video.height = 300;


if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true
    })
        .then(function (stream) {
         //resolve stream and set the html src of the video and then play video  
            video.srcObject = stream;
            console.log("start")
            video.play();
        })
        .catch(function (err0r) {
         //reject error
        });
}

const FPS = 1;
setInterval(() => {
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
    .then(response => {response.json()
    console.log(response)})
    .then(data => {
        console.log('Image sent successfully:', data);

        
    })
    .catch(error => {
        console.error('Error sending image:', error);
    });
}, 10000 / FPS);
