document.getElementById('butlog').addEventListener('click', function () {
    document.getElementById('loginform').submit();
});

document.getElementById('butsig').addEventListener('click', function () {
    document.getElementById('signupform').submit();
});

document.getElementById('user').addEventListener('input', () => {
    document.getElementById('user1').value = document.getElementById('user').value;
})
document.getElementById('pass').addEventListener('input', () => {
    document.getElementById('pass1').value = document.getElementById('pass').value;
})
function UserSpeech() {
     console.log("clicked microphone");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

        recognition.onspeechend = (event) => {
            recognition.stop();
        }
        recognition.onresult = (result) => {
            document.getElementById('user').value = result.results[0][0].transcript;
            document.getElementById('user1').value = result.results[0][0].transcript;
            rec=result.results[0][0].transcript;
            console.log(rec);
         }
        recognition.start();
}

function PassSpeech() {
     console.log("clicked microphone");
    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

        recognition.onspeechend = (event) => {
            recognition.stop();
        }
        recognition.onresult = (result) => {
            document.getElementById('pass').value = result.results[0][0].transcript;
            document.getElementById('pass1').value = result.results[0][0].transcript;
            rec=result.results[0][0].transcript;
            console.log(rec);
         }
        recognition.start();
}

document.addEventListener('onclick', startSpeechRecognition());
function startSpeechRecognition() {
            if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                
                recognition.lang = 'en-US';
                recognition.continuous = true;

                recognition.onstart = () => {
                    console.log('Speech recognition started');
                };

                recognition.onresult = (event) => {
                    const result = event.results[event.resultIndex][0].transcript;
                    console.log(result);
                    if(result.toLowerCase().includes('password')){
                        password=true;
                    }
                    if(result.toLowerCase().includes('signup') || result.toLowerCase().includes('sign up')){
                        document.getElementById('signupform').submit();
                        password=false;
                    }
                    // Check if the result contains the word "login"
                    if (result.toLowerCase().includes('login') || result.toLowerCase().includes('log in')) {
                        document.getElementById('loginform').submit();
                        password=false;
                    }

                    console.log('Speech result:', result);
                };

                recognition.onend = () => {
                    console.log('Speech recognition ended');
                };

                recognition.start();
            } else {
                alert('Speech recognition is not supported in this browser.');
            }
        }
            var user = document.getElementById('user');
            var user1 = document.getElementById('user1');
            var pass = document.getElementById('pass');
            var pass1 = document.getElementById('pass1');
            var password=false;
  
  document.getElementById('password-container').addEventListener('click', function (event) {
      if (event.target.classList.contains('password-btn')) {
        var clickedButton = event.target.textContent;
        var msg = new SpeechSynthesisUtterance();
        const nletrs = 26;
        if(clickedButton == '123'){
          letter = 'a';
          document.getElementById('123').textContent = 'abc';
          let nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '/', ':', ';', '(', ')', '$', '&', '@', '"', '.', ',', '?', '!', '#' ,"'"]
          console.log(nums.length);
          for (let index = 0; index < nletrs; index++) {
            document.getElementById(letter).textContent = nums[index];
            letter = String.fromCharCode(letter.charCodeAt(0) + 1);
          }
        msg.text = 'number and special character keys';
        window.speechSynthesis.speak(msg);
        }
        else if (clickedButton == 'abc') {
          document.getElementById('123').textContent = '123';
          letter = 'a';
          for (let index = 0; index < nletrs; index++) {
            document.getElementById(letter).textContent = letter;
            letter = String.fromCharCode(letter.charCodeAt(0) + 1);
          }
        msg.text = 'letter keys';
        window.speechSynthesis.speak(msg);
        }
        else{
            msg.text = clickedButton;
         window.speechSynthesis.speak(msg);
        if(password){
            pass.value += clickedButton;
        pass1.value += clickedButton;
        }
        else{
        user.value += clickedButton;
        user1.value += clickedButton;
        }
        }
      }
  });

  function deleteLastCharacter() {
      window.speechSynthesis.cancel();
      var msg = new SpeechSynthesisUtterance();
      msg.text = 'delete';
      window.speechSynthesis.speak(msg);
      if(password){
        let current = pass.value;
        pass.value = current.slice(0, -1);
        pass1.value = current.slice(0, -1);
      }
      else{
        let current1 = user.value;
        user.value = current1.slice(0, -1);
        user1.value = current1.slice(0, -1);
      }
  }

  function clearPassword() {
      window.speechSynthesis.cancel();
      var msg = new SpeechSynthesisUtterance();
      msg.text = 'clear';
      window.speechSynthesis.speak(msg);
      if(password){
        let current = pass.value;
        pass.value = '';
        pass1.value = '';
      }
      else{
        let current1 = user.value;
        user.value = '';
        user1.value = '';
      }
  }
  
function right(){
    window.speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance();
    msg.text = document.getElementById('right').textContent;
    window.speechSynthesis.speak(msg);
}