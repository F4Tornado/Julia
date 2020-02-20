// https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

//https://www.aspsnippets.com/Articles/Change-Browser-URL-without-reloading-refreshing-page-using-HTML5-in-JavaScript-and-jQuery.aspx
function changeUrl(title, url) {
  if (typeof (history.pushState) != "undefined") {
    var obj = { Title: title, Url: url };
    history.pushState(obj, obj.Title, obj.Url);
  } else {
    alert("Browser does not support HTML5.");
  }
}

const params = getUrlVars();
let moving = true;

const c = document.getElementById("c");
draw = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;
let targetZoom = 1;
let zoom = 1;
let x = parseFloat(params["x"]);
let y = parseFloat(params["y"]);
let addx = parseFloat(params["addx"]);
let addy = parseFloat(params["addy"]);
let mouseX = 0;
let mouseY = 0;
let autozoom = params["autozoom"] ? parseFloat(params["autozoom"]) : false;
let targetZoomLocation = [0, 0];
let zoomLocation = [0, 0];

let numToAdd = [-4, -2];
let target = [0, 0];
let maxNum = parseInt(params["maxnum"]);
let t = 0;
let pt = 0;
let control = params["control"] == "true";
let predefined = !(isNaN(x) && isNaN(y) && isNaN(addx) && isNaN(addy))
if (predefined) {
  control = false;
  target = [addx, addy];
  zoomLocation = [x, y];
}

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
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (control && moving) {
    numToAdd = [((mouseX - c.width / 2) / (256 * zoom) + zoomLocation[0]), ((mouseY - c.height / 2 + zoomLocation[1]) / (256 * zoom) + zoomLocation[1])];
    show();
  }
}

c.onclick = (e) => {
  moving = !moving;
}

c.oncontextmenu = () => {
  zoom = 1;
  if (!predefined) {
    zoomLocation = [0, 0];
  }
  return false;
}

c.onwheel = (e) => {
  if (!(autozoom && moving)) {
    zoomy(e);
  }
};

function zoomy(e) {
  let div = navigator.appVersion.indexOf("Mac") !== -1 && !autozoom ? -12 : 2; // Macs do this weird thing where they scroll really big and a lot of times
  // console.log(e.deltaY / div < 0 ? (e.deltaY / div) / 6 + 1 : 1 / ((-e.deltaY / div) / 6 + 1));
  let zoomAmt = e.deltaY / div < 0 ? (e.deltaY / div) / 6 + 1 : 1 / ((-e.deltaY / div) / 6 + 1);
  if (!predefined) {
    zoomLocation[0] += (((e.clientX - c.width / 2) / (256 * zoom) + zoomLocation[0]) - zoomLocation[0]) * (zoomAmt - 1);
    zoomLocation[1] += (((e.clientY - c.height / 2) / (256 * zoom) + zoomLocation[1]) - zoomLocation[1]) * (zoomAmt - 1);
    changeUrl("Julia sets & stuff", `${location.origin == "null" ? location.host : location.origin}${location.pathname}?iterator=${params["iterator"]}&maxnum=${params["maxnum"]}&control=false&addx=${numToAdd[0]}&addy=${numToAdd[1]}&x=${zoomLocation[0]}&y=${zoomLocation[1]}&autozoom=0.25`);
  }
  zoom *= zoomAmt;
}

function drawLoop() {
  setTimeout(drawLoop, 1000 / 30);
  show();
  if (autozoom && moving) {
    zoomy({ clientX: mouseX, clientY: mouseY, deltaY: autozoom });
  }
  if (!control) {
    numToAdd[0] -= (numToAdd[0] - target[0]) * 0.1;
    numToAdd[1] -= (numToAdd[1] - target[1]) * 0.1;
  }
  // zoomLocation[0] -= (zoomLocation[0] - targetZoomLocation[0]) * 0.2;
  // zoomLocation[1] -= (zoomLocation[1] - targetZoomLocation[1]) * 0.2;
  // zoom -= (zoom - targetZoom) * 0.2;
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
  },

  julia3: (xa, ya) => {
    let x = xa;
    let y = ya;
    let num = 0;
    while (!(x > 2 || y > 2 || x < -2 || y < -2 || num > maxNum)) {
      x1 = (x ** 2 - y ** 2);
      y1 = (2 * x * y);
      let temp = [(x1 * x - y1 * y) + numToAdd[0], (x1 * y + y1 * x) + numToAdd[1]];
      // let temp = [(x ** 2 - y ** 2) + numToAdd[0], (2 * x * y) + numToAdd[1]];
      x = temp[0];
      y = temp[1];
      num++;
    }

    return (num == 0 ? 1 : num) - 1;
  },

  mandelbrot3: (xb, yb) => {
    let x = numToAdd[0];
    let y = numToAdd[1];
    let xa = xb;
    let ya = yb;
    let num = 0;
    while (!(x > 3 || y > 2 || x < -3 || y < -2 || num > maxNum)) {
      x1 = (x ** 2 - y ** 2);
      y1 = (2 * x * y);
      let temp = [(x1 * x - y1 * y) + xa, (x1 * y + y1 * x) + ya];
      x = temp[0];
      y = temp[1];
      num++;
    }

    return (num < 2 ? 2 : num) - 2;
  },
}

const iterator = iterators[params["iterator"]];

function getColor(num) {
  return 255 * (num / (maxNum + 1));
}

drawLoop();