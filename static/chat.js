var rec = 'No previous speech entered';
var message = 'No speech entered';

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

function sendToServer(text) {
    // Use HTTP POST to send image and text to the server
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'text': text }),
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
     message = 'nothing';

    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    var action = document.getElementById("action");

        recognition.onstart = () => {
            action.innerHTML = "<small>listening, please speak...</small>";

            console.log("starting listening, speak in microphone");
            document.querySelector('button').textContent = "starting listening, speak in microphone";
        }
        recognition.onspeechend = (event) => {
            document.querySelector('button').textContent = 'jwhvwcknjwn';

            console.log("stopped listening");
            document.querySelector('button').textContent = "stopped listening";
            recognition.stop();
        }
        recognition.onresult = (result) => {
            action.innerHTML = "<small> done...</small>";

            document.querySelector('button').textContent = result.results[0][0].transcript;

            rec=result.results[0][0].transcript;
            console.log(rec);
            sendToServer(rec);
            document.querySelector('button').textContent = rec;
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

function RepeatSent(){
    window.speechSynthesis.cancel();

    var msg = new SpeechSynthesisUtterance();
    msg.text = rec;
    window.speechSynthesis.speak(msg);
}

document.addEventListener('dblclick', () => {
    window.speechSynthesis.cancel();

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'Window Switched';
    window.speechSynthesis.speak(msg);

    document.querySelector('form').submit();

});
