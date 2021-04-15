// console.log("Hello World!");
// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
//https://learn.ml5js.org/#/reference/bodypix?id=segmentwithparts

let bodypix;
let video;
let segmentation;
let img;

const options = {
  multiplier: 0.5, // 1.0, 0.75, or 0.50, 0.25
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.8, // 0 - 1, defaults to 0.5
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
    image(segmentation.personMask, 0, 0, width, height);
  }
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  segmentation = result;
  segmentation.partMask.loadPixels();
  segmentation.personMask.loadPixels();

  console.log(segmentation);

  let leftFaceColor = JSON.stringify(segmentation.bodyParts.leftFace.color);
  let rightFaceColor = JSON.stringify(segmentation.bodyParts.rightFace.color);

  for (let i = 0; i < segmentation.personMask.pixels.length; i += 4) {
    let maskColor = JSON.stringify([
      segmentation.partMask.pixels[i],
      segmentation.partMask.pixels[i + 1],
      segmentation.partMask.pixels[i + 2],
    ]);
    // Compare pixel colors from partMask
    if (maskColor !== leftFaceColor && maskColor !== rightFaceColor) {
      // segmentation.personMask.pixels[i]
      // segmentation.personMask.pixels[i + 1]
      // segmentation.personMask.pixels[i + 2]
      segmentation.personMask.pixels[i + 3] = 0;
    }
  }

  segmentation.personMask.updatePixels();
}
