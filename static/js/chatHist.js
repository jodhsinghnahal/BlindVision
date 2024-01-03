document.addEventListener('DOMContentLoaded', function () {
    const speakableRows = document.querySelectorAll('.speakable-row');
    const stopSpeechButton = document.getElementById('stopSpeech');
    let touchstartX = 0;
    let touchendX = 0;

    speakableRows.forEach(row => {
        row.addEventListener('click', function () {
            const role = this.querySelector('.speakable-data').getAttribute('data-role');
            const message = this.querySelector('.speakable-data').getAttribute('data-message');
            const rolemesid = this.querySelector('.speakable-data').getAttribute('id');

            speak(`${role}: ${message}`);

        });
    });

    stopSpeechButton.addEventListener('click', function () {
        stopSpeaking();
    });

    document.addEventListener('touchstart', function (event) {
        touchstartX = event.touches[0].clientX;
    });

    document.addEventListener('touchend', function (event) {
        touchendX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 39) {
            stopSpeaking();
        }
    });

    function handleSwipe() {
        const minSwipeDistance = 50; // Adjust the minimum distance for a swipe
        const swipeDistance = touchendX - touchstartX;

        if (swipeDistance > minSwipeDistance) {
            stopSpeaking();
        }
    }

    function speak(message) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        synth.speak(utterance);
    }

    function stopSpeaking() {
        window.speechSynthesis.cancel();
    }
});

document.addEventListener('dblclick', () => {
    window.speechSynthesis.cancel();

    var msg = new SpeechSynthesisUtterance();
    msg.text = 'Window Switched';
    window.speechSynthesis.speak(msg);

    document.querySelector('form').submit();

});
