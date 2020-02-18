// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

const params = getUrlVars();

const c = document.getElementById("c");
draw = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;
frames = 0;

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
  frames++;
  for (let i = 0; i < pixels.length / 4; i++) {
    let pos = iToCoords(i)
    let color = getColor(iterator((pos[0] - c.width / 2) / 256, (pos[1] - c.height / 2) / 256))
    pixels[i * 4 + 0] = color;
    pixels[i * 4 + 1] = color;
    pixels[i * 4 + 2] = color;
    pixels[i * 4 + 3] = 255;
  }

  draw.putImageData(image, 0, 0);
}

c.onmousemove = (e) => {
  if (control) {
    numToAdd = [(e.clientX - c.width / 2) / 256, (e.clientY - c.height / 2) / 256];
    show();
  }
}

function drawLoop() {
  setTimeout(drawLoop, 1000 / 30);
  show();
  numToAdd[0] -= (numToAdd[0] - target[0]) * 0.1;
  numToAdd[1] -= (numToAdd[1] - target[1]) * 0.1;
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

if (control) {
  show();
} else {
  drawLoop();
}