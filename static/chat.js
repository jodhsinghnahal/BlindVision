var txt = document.getElementById('display-password').textContent;
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
        console.log('text sent successfully:', data);
        message = data['message'];
    })
    .catch(error => {
        console.error('Error sending text:', error);
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

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'sent message';
    window.speechSynthesis.speak(msg);

    txt = document.getElementById('display-password').textContent;
    sendToServer(txt);
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
