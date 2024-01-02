var c = document.getElementById('c'),
o = c.getContext('2d');

function reset_canvas() {
o.fillStyle = 'white';
o.fillRect(0, 0, c.width, c.height);
o.fillStyle = 'black';
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
var response = OCRAD(c);

if ('innerText' in document.getElementById("text")) {
    document.getElementById("text").innerText = response;
} else {
    document.getElementById("text").textContent = response;
}
}

function setCanvasSize() {
c.width = window.innerWidth -50;
c.height = window.innerHeight - 50;
reset_canvas();
}

// Event listener to update canvas size when the window is resized
window.addEventListener('resize', setCanvasSize);

// Initial canvas setup
setCanvasSize();


reset_canvas();
