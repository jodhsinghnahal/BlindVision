//adjust hold time, speaked words 

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
    if(document.getElementById('display-password').textContent){
    message = 'nothing';

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'sent message';
    window.speechSynthesis.speak(msg);

    txt = document.getElementById('display-password').textContent;
    sendToServer(txt);
    }
    else{
        var msg = new SpeechSynthesisUtterance();
        msg.text = 'nothing to send';
        window.speechSynthesis.speak(msg);
    }
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
        msg.text = the_mes.toLowerCase();  
        console.log(msg.text);
        window.speechSynthesis.speak(msg);
    }
}

let clickCount = 0;
let lastClickTime = 0;

document.getElementById('bottomQuarter').addEventListener('click', (event) => {
    if(!(event.target.id === 'back')){
  const now = new Date().getTime();
  const timeSinceLastClick = now - lastClickTime;

  if (timeSinceLastClick < 600) {  
    clickCount++;

    if (clickCount === 3) {
      
      window.speechSynthesis.cancel();
      
      const msg = new SpeechSynthesisUtterance();
      msg.text = 'Chat History Mode';
      window.speechSynthesis.speak(msg);

      document.getElementById('form1').submit();

      // Reset click count and time
      clickCount = 0;
    }
  } else {
    // Reset click count if there was a gap between clicks
    clickCount = 1;
  }

  // Update the last click time
  lastClickTime = now;
}
});


document.getElementById('bottomQuarter').addEventListener('dblclick', (event) => {
    if(!(event.target.id === 'back')){
    window.speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance();
    msg.text = "draw";
    window.speechSynthesis.speak(msg);
    
    setTimeout(() => {document.getElementById('form2').submit();}, 1000);
    }
});