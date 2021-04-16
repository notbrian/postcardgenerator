// console.log("Hello World!");
// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
//https://learn.ml5js.org/#/reference/bodypix?id=segmentwithparts

// let bodypix;
// let video;
// let segmentation;
// let img;

let poseNet;
let tajIMG;
let poses = [];

///////1st canvas for bodyPix
var s1 = function (sketch) {
  let bodypix;
  //let video1;
  let segmentation1;
  let img1;

  const options = {
    multiplier: 0.5, // 1.0, 0.75, or 0.50, 0.25
    outputStride: 8, // 8, 16, or 32, default is 16
    segmentationThreshold: 0.8, // 0 - 1, defaults to 0.5
  };



  sketch.preload = function () {
    bodypix = ml5.bodyPix(options);
  };




  sketch.setup = function () {
    let canvas1 = sketch.createCanvas(320, 240,);
    //canvas1.position(0, 0);
    img1 = sketch.createImage("me.jpg");
    bodypix.segmentWithParts(img1, gotResults);
  };




  sketch.draw = function () {
    sketch.background(100);
    // if (segmentation1) {
    //   image(segmentation1.personMask, 0, 0, width, height);
    // }
  };

  function gotResults(error, result){
    if (error) {
      console.log(error);
      return;
    }
    segmentation1 = result;
    segmentation1.partMask.loadPixels();
    segmentation1.personMask.loadPixels();
  
    console.log(segmentation1);
  
    let leftFaceColor = JSON.stringify(segmentation1.bodyParts.leftFace.color);
    let rightFaceColor = JSON.stringify(segmentation1.bodyParts.rightFace.color);
  
    for (let i = 0; i < segmentation1.personMask.pixels.length; i += 4) {
      let maskColor = JSON.stringify([
        segmentation1.partMask.pixels[i],
        segmentation1.partMask.pixels[i + 1],
        segmentation1.partMask.pixels[i + 2],
      ]);
      // Compare pixel colors from partMask
      if (maskColor !== leftFaceColor && maskColor !== rightFaceColor) {
        // segmentation1.personMask.pixels[i]
        // segmentation1.personMask.pixels[i + 1]
        // segmentation1.personMask.pixels[i + 2]
        segmentation1.personMask.pixels[i + 3] = 0;
      }
    }
  
    segmentation1.personMask.updatePixels();
  };
};

new p5(s1);








const options = {
  multiplier: 0.5, // 1.0, 0.75, or 0.50, 0.25
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.8, // 0 - 1, defaults to 0.5
};

function preload() {
  bodypix = ml5.bodyPix(options);
}

function setup() {
  createCanvas(320, 240);

  //////Setup for BodyPix//////
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

////////2nd canvas for poseNet
// var s2 = function (sketch) {
//   sketch.setup = function () {
//     let canvas1 = sketch.createCanvas(320, 240);
//     //canvas1.position(320, 0);
//   };
//   sketch.draw = function () {
//     sketch.background(100, 100, 20);
//   };
// };

// new p5(s2);
