const onecolor = one.color;

function hex2vector(cssHex) {
    const pc = onecolor(cssHex);

    return vec3.fromValues(
        pc.red(),
        pc.green(),
        pc.blue()
    );
}

const charW = 6;
const charH = 10;
const bufferCW = 80;
const bufferCH = 24;
const bufferW = bufferCW * charW;
const bufferH = bufferCH * charH;
const textureW = 512;
const textureH = 256;

const consolePad = 8; // in texels
const consoleW = bufferW + consolePad * 2;
const consoleH = bufferH + consolePad * 2;

const bufferCanvas = document.createElement('canvas');
bufferCanvas.width = bufferW;
bufferCanvas.height = bufferH;
// document.body.appendChild(bufferCanvas);

const bufferContext = bufferCanvas.getContext('2d');

bufferContext.fillStyle = '#000';
bufferContext.fillRect(0, 0, bufferW, bufferH);

function charRange(start, end) {
  return Array.apply(null, new Array(end - start)).map((_, index) => {
    return String.fromCharCode(start + index);
  });
}

const characterSet = ([]
  .concat(charRange(0x30, 0x3a)) // ASCII digits
  .concat(charRange(0x40, 0x5b)) // ASCII uppercase and @
  .concat(charRange(0x30a0, 0x30ff)) // kanji
);

// const bannerSet = [
//   '❤', '☠', '☣', '☻', '⚇', '⚿', '⛯'
// ];

const bannerImgSet = [
  new Image(),
  new Image(),
  new Image(),
  new Image()
];

bannerImgSet[0].src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px"><g><path d="M26,44H38a7.00818,7.00818,0,0,0,7-7V26H19V37A7.00818,7.00818,0,0,0,26,44Zm8.419-9.81348,7-5a.99968.99968,0,1,1,1.1621,1.627l-7,5a.99968.99968,0,1,1-1.1621-1.627ZM21.186,29.419a.99814.99814,0,0,1,1.395-.23243l7,5a.99968.99968,0,1,1-1.1621,1.627l-7-5A.9994.9994,0,0,1,21.186,29.419Z"/><path d="M13,53v3h6V50H16A3.00328,3.00328,0,0,0,13,53Z"/><rect x="23" y="10" width="2" height="14"/><path d="M45,24V9A5,5,0,0,0,35,9V24h2V9a.99974.99974,0,0,1,1-1h4a.99974.99974,0,0,1,1,1V24Z"/><path d="M29,24V9A5,5,0,0,0,19,9V24h2V9a.99974.99974,0,0,1,1-1h4a.99974.99974,0,0,1,1,1V24Z"/><rect x="39" y="10" width="2" height="14"/><rect x="13" y="58" width="6" height="2"/><rect x="45" y="58" width="6" height="2"/><path d="M40,46H37v5a.99974.99974,0,0,1-1,1H28a.99974.99974,0,0,1-1-1V46H24a3.00328,3.00328,0,0,0-3,3V60h2V57a.99974.99974,0,0,1,1-1H40a.99974.99974,0,0,1,1,1v3h2V49A3.00328,3.00328,0,0,0,40,46Z"/><rect x="33" y="58" width="6" height="2"/><path d="M48,50H45v6h6V53A3.00328,3.00328,0,0,0,48,50Z"/><rect x="29" y="46" width="2" height="4"/><rect x="33" y="46" width="2" height="4"/><rect x="25" y="58" width="6" height="2"/></g></svg>');

bannerImgSet[1].src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px"><path d="M20.67,28.71c6.92,0,7.67-4.23,7.67-6a7.67,7.67,0,0,0-15.33,0C13,24.48,13.75,28.71,20.67,28.71Zm0-9.71a3.67,3.67,0,0,1,3.67,3.67c0,.77,0,2-3.67,2S17,23.43,17,22.67A3.67,3.67,0,0,1,20.67,19Z"/><path d="M42.67,28.71c6.92,0,7.67-4.23,7.67-6a7.67,7.67,0,1,0-15.33,0C35,24.48,35.75,28.71,42.67,28.71Zm0-9.71a3.67,3.67,0,0,1,3.67,3.67c0,.77,0,2-3.67,2S39,23.43,39,22.67A3.67,3.67,0,0,1,42.67,19Z"/><path d="M25.14,34.5c0,2.49,4,3.21,6.5,3.21s6.5-.73,6.5-3.21-4-4.5-6.5-4.5S25.14,32,25.14,34.5Z"/><path d="M42,2H22A16,16,0,0,0,6,18V47a9,9,0,0,0,7.2,8.82A9,9,0,0,0,22,63H42a9,9,0,0,0,8.8-7.18A9,9,0,0,0,58,47V18A16,16,0,0,0,42,2ZM10,18A12,12,0,0,1,22,6H42A12,12,0,0,1,54,18V37.5A1.5,1.5,0,0,1,52.5,39,5.52,5.52,0,0,0,47,44.5V47H44V45a2,2,0,0,0-4,0v2H34V45a2,2,0,0,0-4,0v2H24V45a2,2,0,0,0-4,0v2H17V44.5A5.51,5.51,0,0,0,11.5,39a1.47,1.47,0,0,1-1.07-.46,1.45,1.45,0,0,1-.43-1V18Zm0,29V42.77a5.47,5.47,0,0,0,1.5.23A1.5,1.5,0,0,1,13,44.5v7.08A5,5,0,0,1,10,47Zm36.94,7.72A5,5,0,0,1,42,59H22a5,5,0,0,1-5-4.37A3.51,3.51,0,0,1,17,54V51h3v2a2,2,0,0,0,4,0V51h6v2a2,2,0,0,0,4,0V51h6v2a2,2,0,0,0,4,0V51h3v3A3.85,3.85,0,0,1,46.94,54.72ZM51,51.58V44.5a1.47,1.47,0,0,1,.46-1.07,1.45,1.45,0,0,1,1-.43,5.47,5.47,0,0,0,1.5-.21V47A5,5,0,0,1,51,51.58Z"/></svg>');

bannerImgSet[2].src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125"><symbol viewBox="-27.299 -39.024 54.598 78.047"><path fill="none" d="M11.157,34.02c-1.275-1.85-3.408-3.026-5.733-3.026c-2.13,0-4.118,0.985-5.424,2.607   c-1.306-1.622-3.294-2.607-5.423-2.607c-2.325,0-4.457,1.176-5.734,3.026c-1.275-1.85-3.408-3.026-5.733-3.026   c-1.913,0-3.648,0.776-4.908,2.029v-66.474c1.26,1.253,2.995,2.029,4.908,2.029c2.325,0,4.458-1.176,5.733-3.026   c1.277,1.85,3.409,3.026,5.734,3.026c2.129,0,4.117-0.986,5.423-2.607c1.306,1.622,3.294,2.607,5.424,2.607   c2.325,0,4.458-1.176,5.733-3.026c1.277,1.85,3.409,3.026,5.734,3.026c1.913,0,3.647-0.776,4.907-2.028v66.473   c-1.26-1.253-2.994-2.028-4.907-2.028C14.567,30.995,12.435,32.17,11.157,34.02z"/><path fill="#000000" stroke="#000000" stroke-width="3" stroke-miterlimit="10" d="M-20.463-37.524   c0.391,1.615,1.839,2.822,3.573,2.822c1.733,0,3.181-1.207,3.572-2.822h4.323c0.391,1.615,1.839,2.822,3.573,2.822   s3.182-1.207,3.573-2.822h3.701c0.391,1.615,1.839,2.822,3.573,2.822s3.182-1.207,3.573-2.822h4.322   c0.391,1.615,1.839,2.822,3.573,2.822s3.182-1.207,3.573-2.822h5.335v75.047h-5.266c-0.219-1.825-1.759-3.25-3.641-3.25   s-3.423,1.425-3.641,3.25H9.065c-0.219-1.825-1.759-3.25-3.641-3.25s-3.423,1.425-3.641,3.25h-3.564   c-0.219-1.825-1.759-3.25-3.641-3.25s-3.423,1.425-3.641,3.25h-4.186c-0.219-1.825-1.758-3.25-3.641-3.25   c-1.883,0-3.423,1.425-3.641,3.25h-5.267v-75.047H-20.463z"/></symbol><symbol viewBox="-30.282 -48.056 60.563 94.113"><path fill="#000000" stroke="#000000" stroke-width="6" stroke-miterlimit="10" d="M16.006,43.056   c-3.233-4.883-8.77-8.108-15.065-8.108s-11.832,3.225-15.065,8.108h-10.584v-88.113h10.584c3.233,4.883,8.77,8.108,15.065,8.108   s11.832-3.224,15.065-8.108H26.59v88.113H16.006z"/><line fill="none" stroke="#000000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="7,8" x1="27.781" y1="-20.755" x2="-27.782" y2="-20.755"/></symbol><symbol viewBox="-24.712 -42.834 54.356 85.667"><path fill="#000000" stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M17.181,40.333h-4.475   c-0.466-2.355-2.539-4.131-5.031-4.131c-2.491,0-4.565,1.776-5.03,4.131h-4.883c-0.466-2.355-2.539-4.131-5.031-4.131   c-2.491,0-4.565,1.776-5.03,4.131h-4.883c-0.466-2.355-2.539-4.131-5.03-4.131v-72.023c2.622,0,4.76-1.974,5.069-4.512h4.806   c0.309,2.539,2.447,4.512,5.069,4.512c2.622,0,4.76-1.974,5.069-4.512h4.806c0.309,2.539,2.447,4.512,5.069,4.512   c2.622,0,4.76-1.974,5.069-4.512h4.398c0.309,2.539,2.447,4.512,5.069,4.512v72.023C19.72,36.202,17.647,37.978,17.181,40.333z"/><line fill="none" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="7,6" x1="-22.644" y1="-17.395" x2="27.644" y2="-17.395"/></symbol><symbol viewBox="-23.971 -42.094 47.944 84.188"><g><path fill="#000000" stroke="#000000" stroke-width="3.521" stroke-miterlimit="10" d="M17.182,40.333h-4.475    c-0.466-2.355-2.539-4.131-5.031-4.131c-2.491,0-4.565,1.776-5.03,4.131h-4.883c-0.466-2.355-2.539-4.131-5.031-4.131    c-2.491,0-4.565,1.776-5.03,4.131h-4.883c-0.466-2.355-2.539-4.131-5.03-4.131v-72.023c2.622,0,4.76-1.974,5.069-4.512h4.806    c0.309,2.539,2.447,4.512,5.069,4.512c2.622,0,4.76-1.974,5.069-4.512h4.806c0.309,2.539,2.447,4.512,5.069,4.512    c2.622,0,4.76-1.974,5.069-4.512h4.398c0.309,2.539,2.447,4.512,5.069,4.512v72.023C19.721,36.202,17.648,37.978,17.182,40.333z"/></g><polygon fill="#000000" stroke="#000000" stroke-width="3.8113" stroke-miterlimit="10" points="5.14,17.02 11.952,13.853    8.431,7.217 7.524,-0.241 0.124,1.057 -7.248,-0.385 -8.301,7.053 -11.951,13.62 -5.201,16.919 -0.084,22.42  "/></symbol><symbol id="a" viewBox="-21.087 -31.266 42.17 72.87"><path fill="#000000" stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M6.373,39.104h5.21c0-3.87,3.13-7,7-7v-53.87   c-3.87,0-7-3.14-7-7h-5.21"/><path fill="#000000" stroke="#000000" stroke-width="5" stroke-miterlimit="10" d="M-6.377-28.766h-5.21c0,3.86-3.13,7-7,7v53.87   c3.87,0,7,3.13,7,7h5.21"/><line fill="none" stroke="#000000" stroke-width="5" stroke-miterlimit="10" x1="2.373" y1="39.104" x2="-2.377" y2="39.104"/><line fill="none" stroke="#000000" stroke-width="5" stroke-miterlimit="10" x1="2.373" y1="-28.766" x2="-2.377" y2="-28.766"/><g><path stroke="#000000" stroke-width="0.9" stroke-miterlimit="10" d="M-9.901-10.118c0-0.994-0.806-1.8-1.8-1.8    s-1.8,0.806-1.8,1.8s0.806,1.8,1.8,1.8S-9.901-9.124-9.901-10.118z"/><path stroke="#000000" stroke-width="0.9" stroke-miterlimit="10" d="M-2.101-10.118c0-0.994-0.806-1.8-1.8-1.8    s-1.8,0.806-1.8,1.8s0.806,1.8,1.8,1.8S-2.101-9.124-2.101-10.118z"/><path stroke="#000000" stroke-width="0.9" stroke-miterlimit="10" d="M5.699-10.118c0-0.994-0.806-1.8-1.8-1.8s-1.8,0.806-1.8,1.8    s0.806,1.8,1.8,1.8S5.699-9.124,5.699-10.118z"/><path stroke="#000000" stroke-width="0.9" stroke-miterlimit="10" d="M13.499-10.118c0-0.994-0.806-1.8-1.8-1.8    s-1.8,0.806-1.8,1.8s0.806,1.8,1.8,1.8S13.499-9.124,13.499-10.118z"/></g></symbol><symbol viewBox="-21.086 -31.266 42.17 72.87"><use xlink:href="#a" width="42.17" height="72.87" x="-21.087" y="-31.266" transform="matrix(1 0 0 1 6.996482e-004 -2.671033e-004)" overflow="visible"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="9.224" y1="13.75" x2="-9.223" y2="13.75"/></symbol><g display="none"><path display="inline" fill="#000000" d="M828.792,474.743H-409.006c-2.084,0-3.789-1.705-3.789-3.789V-716.211   c0-2.084,1.705-3.789,3.789-3.789H828.792c2.084,0,3.789,1.705,3.789,3.789V470.954   C832.582,473.038,830.877,474.743,828.792,474.743z"/></g><g><g><path d="M50,91.998c23.195,0,41.998-18.803,41.998-41.998C91.998,26.805,73.195,8.002,50,8.002    C26.805,8.002,8.002,26.805,8.002,50C8.002,73.195,26.805,91.998,50,91.998z M31.914,67.307l2.067-4.598    c0.255-0.569,0.734-1.003,1.318-1.213c0.24-0.075,0.479-0.12,0.719-0.12c0.374,0,0.734,0.09,1.063,0.27    c3.145,1.677,7.369,2.681,11.293,2.681c4.613,0,7.968-1.887,7.968-4.478c0-1.678-0.974-3.7-8.148-6.036    c-7.773-2.441-15.697-6.006-15.697-14.004c0-6.066,4.418-10.814,11.817-12.686l1.123-0.285v-5.018    c0-1.228,1.018-2.232,2.247-2.232h5.317c1.243,0,2.247,1.003,2.247,2.232v4.508l1.318,0.165c3.16,0.374,5.961,1.153,8.537,2.367    c0.539,0.255,0.959,0.704,1.153,1.273c0.21,0.554,0.18,1.183-0.075,1.707l-2.142,4.538c-0.374,0.779-1.168,1.288-2.037,1.288    c-0.315,0-0.629-0.075-0.929-0.21c-1.393-0.644-4.658-2.127-9.87-2.127c-4.733,0-6.845,1.827-6.845,3.655    c0,2.037,2.202,3.415,9.091,5.692c7.339,2.396,14.828,6.006,14.828,14.693c0,4.688-3.25,10.994-12.417,13.3l-1.123,0.299v5.197    c0,1.243-1.018,2.247-2.247,2.247h-5.407c-1.243,0-2.247-1.003-2.247-2.247v-4.763l-1.333-0.135    c-4.134-0.464-8.028-1.588-10.649-3.1C31.839,69.598,31.45,68.37,31.914,67.307z"/></g></g></svg>');

bannerImgSet[3].src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 55" x="0px" y="0px"><circle cx="22" cy="22" r="15.25" transform="translate(-9.11 22) rotate(-45)" style="" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px"/><line x1="18.41" y1="14.99" x2="19.9" y2="18.82" style="" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px"/><line x1="25.92" y1="14.99" x2="24.44" y2="18.82" style="" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px"/><line x1="16.29" y1="18.84" x2="27.71" y2="18.84" style="" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px"/><line x1="16.29" y1="24.41" x2="27.71" y2="24.41" style="" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px"/><line x1="22" y1="18.84" x2="22" y2="29.01" style="" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3px"/></svg>');

// pseudo-random
// credit: https://gist.github.com/blixt/f17b47c62508be59987b
const SEED_OFFSET = new Date().getTime();

function randomize(seed) {
    const intSeed = seed % 2147483647;
    const safeSeed = intSeed > 0 ? intSeed : intSeed + 2147483646;
    return safeSeed * 16807 % 2147483647;
}

function getRandomizedFraction(seed) {
    return (seed - 1) / 2147483646;
}

// main character trail state
function createTrail() {
  const cx = Math.floor(Math.random() * bufferCW);
  const cy = 0;
  const cvy = 5 + Math.random() * 15;

  return [ cx, cy, cvy ];
}

const trails = Array.apply(null, new Array(30)).map((_, index) => {
  return createTrail();
});

function updateWorld(delta) {
  trails.forEach((trail, index) => {
    trail[1] += trail[2] * delta;

    if (trail[1] > bufferCH) {
      trails[index] = createTrail();
    }
  });
}

// "warm up" the state by simulating the world for a bit
Array.apply(null, new Array(100)).forEach(() => {
  updateWorld(0.1);
});

let fadeCountdown = 0;
let bannerCountdown = 8.0;
let bannerChoice = 0;

function renderWorld(delta) {
  // fade screen every few frames
  // (not every frame, for long trails without rounding artifacts)
  fadeCountdown -= delta;

  if (fadeCountdown < 0) {
    bufferContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    bufferContext.fillRect(0, 0, bufferW, bufferH);

    fadeCountdown += 0.2;
  }

  // redraw
  bufferContext.textAlign = 'center';
  bufferContext.font = '12px "Inconsolata"';

  trails.forEach((trail, index) => {
    const k = index / trails.length;
    const charY = Math.floor(trail[1]);

    // randomize based on character position
    const charSeed = index + (trail[0] + charY * bufferCW) * 50;
    const outSeed = randomize(charSeed * 1500 + SEED_OFFSET);

    const char = characterSet[Math.floor(getRandomizedFraction(outSeed) * characterSet.length)];

    bufferContext.fillStyle = `hsl(${180 + k * 120}, 100%, 60%)`;
    bufferContext.fillText(
      char,
      (trail[0] + 0.5) * charW, // center inside character box
      charY * charH + charH,
      charW // restrict width, but allow a tiny bit of spillover
    );
  });

  // fade screen every few frames
  // (not every frame, for long trails without rounding artifacts)
  bannerCountdown -= delta;

  if (bannerCountdown < 1.5) {
    bufferContext.fillStyle = `hsla(${180 + Math.random() * 220}, 100%, 30%, 1)`;
    bufferContext.fillRect(0, 0, bufferW, bufferH);

    if (bannerCountdown > 0.8) {
      bannerChoice = Math.floor(Math.random() * bannerImgSet.length);
    }

    const bannerImg = bannerImgSet[bannerChoice];
    bufferContext.drawImage(bannerImg, 0, 10, bufferW, bufferH + 40);

    // bufferContext.fillStyle = `hsla(${100 + Math.random() * 220}, 100%, 10%, 1)`;
    // bufferContext.font = '250px sans-serif';

    // bufferContext.save();
    // bufferContext.scale(2, 1);
    // bufferContext.fillText(
    //   bannerSet[Math.floor(Math.random() * bannerSet.length)],
    //   240 / 2, 200
    // );
    // bufferContext.restore();
  }

  if (bannerCountdown < 0) {
      bannerCountdown += 10 + Math.random() * 10;
  }
}

// init WebGL
const regl = createREGL({
    canvas: document.body.querySelector('canvas'),
    attributes: { antialias: true, alpha: false, preserveDrawingBuffer: true }
});

const spriteTexture = regl.texture({
    width: 512,
    height: 256,
    mag: 'linear'
});

const termFgColor = hex2vector('#fee');
const termBgColor = hex2vector('#002a2a');

const quadCommand = regl({
    vert: `
        precision mediump float;

        attribute vec3 position;

        varying vec2 uvPosition;

        void main() {
            uvPosition = position.xy * vec2(0.5, -0.5) + vec2(0.5);

            gl_Position = vec4(
                vec2(-1.0, 1.0) + (position.xy - vec2(-1.0, 1.0)) * 1.0,
                0.0,
                1.0
            );
        }
    `,

    frag: `
        precision mediump float;

        varying vec2 uvPosition;
        uniform sampler2D sprite;
        uniform float time;
        uniform vec3 bgColor;
        uniform vec3 fgColor;

        #define textureW ${textureW + '.0'}
        #define textureH ${textureH + '.0'}
        #define consoleW ${consoleW + '.0'}
        #define consoleH ${consoleH + '.0'}
        #define consolePadUVW ${consolePad / consoleW}
        #define consolePadUVH ${consolePad / consoleH}
        #define charUVW ${charW / consoleW}
        #define charUVH ${charH / consoleH}

        void main() {
            // @todo use uniform
            vec2 consoleWH = vec2(consoleW, consoleH);

            // @todo use uniforms
            float glitchLine = mod(0.8 + time * 0.07, 1.0);
            float glitchFlutter = mod(time * 40.0, 1.0); // timed to be slightly out of sync from main frame rate
            float glitchAmount = 0.06 + glitchFlutter * 0.01;
            float glitchDistance = 0.04 + glitchFlutter * 0.15;

            vec2 center = uvPosition - vec2(0.5);
            float factor = dot(center, center) * 0.2;
            vec2 distortedUVPosition = uvPosition + center * (1.0 - factor) * factor;

            vec2 fromEdge = vec2(0.5, 0.5) - abs(distortedUVPosition - vec2(0.5, 0.5));

            if (fromEdge.x > 0.0 && fromEdge.y > 0.0) {
                vec2 fromEdgePixel = min(0.2 * consoleWH * fromEdge, vec2(1.0, 1.0));

                // simulate 2x virtual pixel size, for crisp display on low-res
                vec2 inTexel = mod(distortedUVPosition * consoleWH * 0.5, vec2(1.0));

                float distToGlitch = glitchLine - (distortedUVPosition.y - inTexel.y / consoleH);
                float glitchOffsetLinear = step(0.0, distToGlitch) * max(0.0, glitchDistance - distToGlitch) / glitchDistance;
                float glitchOffset = glitchOffsetLinear * glitchOffsetLinear;

                vec2 inTexelOffset = inTexel - 0.5;
                float scanlineAmount = inTexelOffset.y * inTexelOffset.y / 0.25;
                float intensity = 8.0 - scanlineAmount * 5.0 + glitchOffset * 2.0; // ray intensity is over-amped by default
                vec2 uvAdjustment = inTexelOffset * vec2(0.0, .5 / consoleH); // remove vertical texel interpolation

                distortedUVPosition.x -= glitchOffset * glitchAmount + 0.011 * (glitchFlutter * glitchFlutter * glitchFlutter);

                vec4 sourcePixel = texture2D(
                    sprite,
                    (distortedUVPosition - uvAdjustment) * consoleWH / vec2(textureW, textureH)
                );

                vec3 pixelRGB = sourcePixel.rgb * sourcePixel.a;

                // multiply by source alpha as well
                float screenFade = 1.0 - dot(center, center) * 1.8;
                float edgeFade = fromEdgePixel.x * fromEdgePixel.y;
                gl_FragColor = vec4(edgeFade * screenFade * mix(
                    bgColor,
                    fgColor,
                    intensity * pixelRGB + glitchOffset * 1.5
                ) * (1.0 - 0.2 * scanlineAmount), 0.2);
            } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        }
    `,

    attributes: {
        position: regl.buffer([
            [ -1, -1, 0 ],
            [ 1, -1, 0 ],
            [ -1, 1, 0 ],
            [ 1, 1, 0 ]
        ])
    },

    uniforms: {
        time: regl.context('time'),
        camera: regl.prop('camera'),
        sprite: spriteTexture,
        bgColor: regl.prop('bgColor'),
        fgColor: regl.prop('fgColor')
    },

    primitive: 'triangle strip',
    count: 4,

    depth: {
        enable: false
    },

    blend: {
        enable: true,
        func: {
            src: 'src alpha',
            dst: 'one minus src alpha'
        }
    }
});

regl.clear({
    depth: 1,
    color: [ 0, 0, 0, 1 ]
});

// main loop
let currentTime = performance.now();

function rafBody() {
  // measure time
  const newTime = performance.now();
  const delta = Math.min(0.05, (newTime - currentTime) / 1000); // apply limiter to avoid frame skips
  currentTime = newTime;

  updateWorld(delta);
  renderWorld(delta);

  regl.poll();
  spriteTexture.subimage(bufferContext, consolePad, consolePad);
  quadCommand({
      bgColor: termBgColor,
      fgColor: termFgColor
  });

  requestAnimationFrame(rafBody);
}

// kickstart the loop
rafBody();

