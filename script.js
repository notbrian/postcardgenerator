// console.log("Hello World!");
// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
//https://learn.ml5js.org/#/reference/bodypix?id=segmentwithparts

let bodypix;
let video;
let segmentation;
let img;

const options = {
  multiplier: 0.75, // 1.0, 0.75, or 0.50, 0.25
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.2, // 0 - 1, defaults to 0.5
  //   palette: leftFace,
};

function preload() {
  bodypix = ml5.bodyPix(options);
}

function setup() {
  createCanvas(320, 240);
  // load up your video
  // video = createCapture(VIDEO, videoReady);
  img = loadImage("me.jpg");
  bodypix.segmentWithParts(img, gotResults);

  // video.size(width, height);
}

function videoReady() {
  // bodypix.segment(img, gotResults);
}

function draw() {
  background(0);
  if (segmentation) {
    image(segmentation.partMask, 0, 0, width, height);
  }
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  segmentation = result;
  console.log(segmentation);
}
