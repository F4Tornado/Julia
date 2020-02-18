// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

const params = getUrlVars();
let moving = true;

const c = document.getElementById("c");
draw = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;
let targetZoom = 1;
let zoom = 1;
let targetZoomLocation = [0, 0];
let zoomLocation = [0, 0];

let numToAdd = [-4, -2];
let target = [0, 0];
let maxNum = parseInt(params["maxnum"]);
let t = 0;
let pt = 0;
let control = params["control"] == "true" ? true : false;

let image = draw.createImageData(c.clientWidth, c.height);
let pixels = image.data;

function iToCoords(i) {
  return [(i) % c.width, (i) / c.width];
}

function coordsToI(x, y) {
  return (y * c.width + x) * 4;
}

function show() {
  for (let i = 0; i < pixels.length / 4; i++) {
    let pos = iToCoords(i)
    let color = getColor(iterator(((pos[0] - c.width / 2) / (256 * zoom) + zoomLocation[0]), ((pos[1] - c.height / 2) / (256 * zoom) + zoomLocation[1])));
    pixels[i * 4 + 0] = color;
    pixels[i * 4 + 1] = color;
    pixels[i * 4 + 2] = color;
    pixels[i * 4 + 3] = 255;
  }

  draw.putImageData(image, 0, 0);
}

c.onmousemove = (e) => {
  if (control && moving) {
    numToAdd = [((e.clientX - c.width / 2) / (256 * zoom) + zoomLocation[0]), ((e.clientY - c.height / 2 + zoomLocation[1]) / (256 * zoom) + zoomLocation[1])];
    show();
  }
}

c.onclick = (e) => {
  moving = !moving;
}

c.oncontextmenu = () => {
  targetZoom = 1;
  targetZoomLocation = [0, 0];
  return false;
}

c.onwheel = (e) => {
  targetZoom *= e.deltaY < 0 ? 1.5 : (1 / 1.5);
  targetZoomLocation = [((e.clientX - c.width / 2) / (256 * zoom) + zoomLocation[0]), ((e.clientY - c.height / 2 + zoomLocation[1]) / (256 * zoom) + zoomLocation[1])];
}

function drawLoop() {
  setTimeout(drawLoop, 1000 / 30);
  show();
  if (!control) {
    numToAdd[0] -= (numToAdd[0] - target[0]) * 0.1;
    numToAdd[1] -= (numToAdd[1] - target[1]) * 0.1;
  }
  zoomLocation[0] -= (zoomLocation[0] - targetZoomLocation[0]) * 0.2;
  zoomLocation[1] -= (zoomLocation[1] - targetZoomLocation[1]) * 0.2;
  zoom -= (zoom - targetZoom) * 0.2;
}

c.onmousedown = show;

const iterators = {
  julia: (xa, ya) => {
    let x = xa;
    let y = ya;
    let num = 0;
    while (!(x > 2 || y > 2 || x < -2 || y < -2 || num > maxNum)) {
      let temp = [(x ** 2 - y ** 2) + numToAdd[0], (2 * x * y) + numToAdd[1]];
      x = temp[0];
      y = temp[1];
      num++;
    }

    return (num == 0 ? 1 : num) - 1;
  },

  mandelbrot: (xb, yb) => {
    let x = numToAdd[0];
    let y = numToAdd[1];
    let xa = xb;
    let ya = yb;
    let num = 0;
    while (!(x > 3 || y > 2 || x < -3 || y < -2 || num > maxNum)) {
      let temp = [(x ** 2 - y ** 2) + xa, (2 * x * y) + ya];
      x = temp[0];
      y = temp[1];
      num++;
    }

    return (num < 2 ? 2 : num) - 2;
  }
}

const iterator = iterators[params["iterator"]];

function getColor(num) {
  return 255 * (num / (maxNum + 1));
}

drawLoop();