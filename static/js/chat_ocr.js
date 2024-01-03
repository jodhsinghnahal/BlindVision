var c = document.getElementById('c1'),
    o = c.getContext('2d');

var c2 = document.getElementById('c2'),
    o2 = c2.getContext('2d');

function reset_canvas() {
    o.clearRect(0, 0, c.width, c.height);
    o.fillStyle = 'black';
    o2.fillStyle = 'white';
    o2.fillRect(0, 0, c2.width, c2.height);
    o2.fillStyle = 'black';
}

var isTouchDevice = 'ontouchstart' in document.documentElement;

var startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
var moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
var endEvent = isTouchDevice ? 'touchend' : 'mouseup';

var drag = false,
    lastX, lastY;

c.addEventListener(startEvent, function (e) {
    drag = true;
    lastX = isTouchDevice ? e.touches[0].clientX : e.clientX;
    lastY = isTouchDevice ? e.touches[0].clientY : e.clientY;
    e.preventDefault();
    c.addEventListener(moveEvent, moveHandler);
});

c.addEventListener(endEvent, function (e) {
    drag = false;
    e.preventDefault();
    c.removeEventListener(moveEvent, moveHandler);
    runOCR();
});

function moveHandler(e) {
    e.preventDefault();
    var rect = c.getBoundingClientRect();
    var r = 5;

    function dot(x, y) {
        o.beginPath();
        o.moveTo(x + r, y);
        o.arc(x, y, r, 0, Math.PI * 2);
        o.fill();
        o2.beginPath();
        o2.moveTo(x + r, y);
        o2.arc(x, y, r, 0, Math.PI * 2);
        o2.fill();
    }

    var x = isTouchDevice ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    var y = isTouchDevice ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    if (lastX && lastY) {
        var dx = x - lastX,
            dy = y - lastY;
        var d = Math.sqrt(dx * dx + dy * dy);
        for (var i = 1; i < d; i += 2) {
            dot(lastX + dx / d * i, lastY + dy / d * i);
        }
    }
    dot(x, y);

    lastX = x;
    lastY = y;
}

document.body.ondragover = function () {
    document.body.className = 'dragging';
    return false;
};

document.body.ondragend = function () {
    document.body.className = '';
    return false;
};

document.body.onclick = function () {
    document.body.className = '';
};

document.body.ondrop = function (e) {
    e.preventDefault();
    document.body.className = '';
    picked_file(e.dataTransfer.files[0]);
    return false;
};

function open_picker() {
    var e = document.createEvent("MouseEvents");
    e.initEvent('click', true, true);
    document.getElementById('picker').dispatchEvent(e);
}

function runOCR(image_data, raw_feed) {
    var response = OCRAD(c2);

    var msg = new SpeechSynthesisUtterance();
    msg.text = response;
    window.speechSynthesis.speak(msg);

    if ('innerText' in document.getElementById("text")) {
        document.getElementById("text").innerText = response;
    } else {
        document.getElementById("text").textContent = response;
    }
}

function setCanvasSize() {
    c.width = window.innerWidth - 3;
    c.height = window.innerHeight - 0.27 * window.innerHeight; // 15vh as a fraction of window height
    c2.width = window.innerWidth - 3;
    c2.height = window.innerHeight - 0.27 * window.innerHeight; // 15vh as a fraction of window height
    reset_canvas();
}

// Event listener to update canvas size when the window is resized
window.addEventListener('resize', setCanvasSize);

// Initial canvas setup
setCanvasSize();

var saved = false;
var savedval = '';

var touchStartTime = 0;
c.addEventListener('touchstart', function (e) {
    touchStartTime = new Date().getTime();
});

c.addEventListener('touchend', function (e) {
    var touchEndTime = new Date().getTime();
    if (touchEndTime - touchStartTime < 200) { 
        if(saved ){
            var msg = new SpeechSynthesisUtterance();
            if(savedval===''){
                msg.text = 'nothing to add';
            }
            else{msg.text = 'added';}
            console.log(savedval);
            window.speechSynthesis.speak(msg);
            document.getElementById('gg').innerText = savedval;
            document.getElementById('display-password').textContent += savedval;
            console.log(savedval);
            saved  = false;
            savedval = '';
        }
        else{
        savedval = document.getElementById("text").textContent;
        reset_canvas();
        var msg = new SpeechSynthesisUtterance();
        msg.text = 'cleared';
        window.speechSynthesis.speak(msg);
        document.getElementById("text").textContent = '';
        saved = true;
    }
    }
    else{
        saved = false;
    }
});

var saved2 = false;
var savedval2 = '';
var touchStartTime2 = 0;
c.addEventListener('mousedown', function (e) {
    touchStartTime2 = new Date().getTime();
});

c.addEventListener('mouseup', function (e) {
    var touchEndTime2 = new Date().getTime();
    if (touchEndTime2 - touchStartTime2 < 300) { 
        if(saved2){
            var msg = new SpeechSynthesisUtterance();
            if(savedval2===''){
                msg.text = 'nothing to add';
            }
            else{msg.text = 'added';}
            window.speechSynthesis.speak(msg);
            document.getElementById('gg').innerText = savedval2;
            document.getElementById('display-password').textContent += savedval2;
            console.log(savedval2);
            saved2  = false;
            savedval2 = '';
        }
        else{
        savedval2 = document.getElementById("text").textContent;
        reset_canvas();
        var msg = new SpeechSynthesisUtterance();
        msg.text = 'cleared';
        window.speechSynthesis.speak(msg);
        document.getElementById("text").textContent = '';
        saved2 = true;
    }
    }
    else{
        saved2 = false;
    }
});

reset_canvas();
