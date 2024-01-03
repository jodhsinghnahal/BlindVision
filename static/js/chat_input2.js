var displayPassword = document.getElementById('display-password');

function space(){
  var msg = new SpeechSynthesisUtterance();
  msg.text = 'space'
  window.speechSynthesis.speak(msg);
  displayPassword.textContent += ' ';
}

function deleteLastCharacter() {
    window.speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance();
    msg.text = 'delete';
    window.speechSynthesis.speak(msg);
    var currentPassword = displayPassword.textContent;
    displayPassword.textContent = currentPassword.slice(0, -1);
}

function clearPassword() {
    window.speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance();
    msg.text = 'clear';
    window.speechSynthesis.speak(msg);
    var currentPassword = displayPassword.textContent;
    displayPassword.textContent = '';
}

  document.addEventListener('touchstart', function (event) {
      touchstartX = event.touches[0].clientX;
      touchstartY = event.touches[0].clientY;
  });

  document.addEventListener('touchend', function (event) {
      touchendX = event.changedTouches[0].clientX;
      touchendY = event.changedTouches[0].clientY;
       handleSwipe();
  });

  document.addEventListener('keydown', function (event) {
      // right)
      if (event.keyCode === 39) {
          document.getElementById('send').click();
      }
  });

  document.addEventListener('keydown', function (event) {
      // left
      if (event.keyCode === 37) {
          document.getElementById('talk').click();
      }
  });

  document.addEventListener('keydown', function (event) {
      // down
      if (event.keyCode === 40) {
          document.getElementById('repeat').click();
      }
  });

  document.addEventListener('keydown', function (event) {
      // up
      if (event.keyCode === 38) {
          document.getElementById('speech').click();
      }
  });

  function handleSwipe() {
      let minSwipeDistance = 0.7 * window.innerWidth;
      let swipeDistance = touchendX - touchstartX;

      //right swipe
      if (swipeDistance > minSwipeDistance) {
          document.getElementById('talk').click();
      } else if (swipeDistance < -minSwipeDistance) {
          //left swipe
          document.getElementById('send').click();
      }

      let minSwipeDistance2 = 0.7 * window.innerHeight;
      let swipeDistance2 = touchendY - touchstartY;

      if (swipeDistance2 > minSwipeDistance2) {
          document.getElementById('speech').click();
      } else if (swipeDistance2 < -minSwipeDistance2) {
          document.getElementById('repeat').click();
      }
  }

  function speak(message) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      synth.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance();
    msg.text = 'STOP';
    window.speechSynthesis.speak(msg);
 }
