// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
//https://learn.ml5js.org/#/reference/bodypix?id=segmentwithparts

// let bodypix;
// let video;
// let segmentation;
// let img;

function draw() {}

let segmentation1;
let newImage;

let video = document.getElementById("video");

///////1st canvas for bodyPix
var s1 = function (sketch) {
  //let video1;
  let img1;
  let bodypix;

  const options = {
    multiplier: 0.5, // 1.0, 0.75, or 0.50, 0.25
    outputStride: 8, // 8, 16, or 32, default is 16
    segmentationThreshold: 0.8, // 0 - 1, defaults to 0.5
  };

  sketch.preload = function () {
    bodypix = ml5.bodyPix(options);
    img1 = sketch.loadImage("me.jpg");
  };

  sketch.setup = function () {
    // let canvas1 = sketch.createCanvas(320, 240);
    //canvas1.position(0, 0);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
    });
    // bodypix.segmentWithParts(img1, gotResults);
  };

  let button = document.getElementById("startBtn");
  button.addEventListener("click", handleButton);

  function handleButton() {
    bodypix.segmentWithParts(video, gotResults);
  }
  function gotResults(error, result) {
    if (error) {
      console.log(error);
      return;
    }
    segmentation1 = result;
    segmentation1.partMask.loadPixels();
    segmentation1.personMask.loadPixels();

    console.log(segmentation1);

    let leftFaceColor = JSON.stringify(segmentation1.bodyParts.leftFace.color);
    let rightFaceColor = JSON.stringify(
      segmentation1.bodyParts.rightFace.color
    );

    let pixels = segmentation1.personMask.pixels;
    let startingPos = undefined;
    let finalWidthHeight = [0, 0];
    for (let y = 0; y < segmentation1.personMask.height; y++) {
      for (let x = 0; x < segmentation1.personMask.width; x++) {
        let index = (x + y * segmentation1.personMask.width) * 4;

        let maskColor = JSON.stringify([
          segmentation1.partMask.pixels[index],
          segmentation1.partMask.pixels[index + 1],
          segmentation1.partMask.pixels[index + 2],
        ]);

        if (maskColor !== leftFaceColor && maskColor !== rightFaceColor) {
          // segmentation1.personMask.pixels[i]
          // segmentation1.personMask.pixels[i + 1]
          // segmentation1.personMask.pixels[i + 2]
          // segmentation1.personMask.pixels[index + 3] = 0;
        } else if (startingPos == undefined) {
          startingPos = [x, y];
        } else if (x < startingPos[0] && y < startingPos[1]) {
          startingPos = [x, y];
        } else {
          finalWidthHeight = [x, y - startingPos[1]];
        }
      }
    }
    newImage = new p5.Image(finalWidthHeight[0], finalWidthHeight[1]);
    newImage.copy(
      segmentation1.personMask,
      startingPos[0] - finalWidthHeight[0] / 2,
      startingPos[1],
      finalWidthHeight[0],
      finalWidthHeight[1],
      0,
      0,
      newImage.width,
      newImage.height
    );
    segmentation1.personMask.updatePixels();
  }

  // sketch.draw = function () {
  //   sketch.background(100);
  //   if (segmentation1) {
  //     sketch.image(segmentation1.personMask, 0, 0, sketch.width, sketch.height);
  //     sketch.image(
  //       newImage,
  //       50,
  //       0,
  //       newImage.width * 0.3,
  //       newImage.height * 0.3
  //     );
  //   }
  // };
};

new p5(s1);

////////2nd canvas for poseNet
var s2 = function (sketch) {
  let imgPose;
  let imgBP;
  let poseNet;
  let poses = [];
  let width = 569;
  let height = 320;
  let noseX = 0;
  let noseY = 0;

  sketch.setup = function () {
    let canvas2 = sketch.createCanvas(width, height);

    imgPose = sketch.createImg("tajMahal.png", imageReady);
    imgPose.hide();
    sketch.frameRate(1);

    imgBP = sketch.createImg("me.jpg");
    imgBP.hide();
  };

  function imageReady() {
    const options = {
      minConfidenc: 0.1,
      //resolution needs to be same width and height to have better results
      inputResolution: { width, height },
    };
    //initialising ml5 poseNet
    poseNet = ml5.poseNet(modelReady, options);
    poseNet.on("pose", function (results) {
      poses = results;
    });
  }
  //model that will define if multiple or single(singlePose) detection
  function modelReady() {
    poseNet.multiPose(imgPose);
  }

  sketch.draw = function () {
    if (poses.length > 0) {
      sketch.image(imgPose, 0, 0, width, height);
      // drawSkeleton(poses);
      // drawKeypoints(poses);
      if (segmentation1) {
        poses.forEach((pose, i) => {
          drawOnFace(i);
        });
      }
      // sketch.noLoop();
    }
  };

  // function drawOnFace2(num) {
  //   noseX = poses[num].pose.keypoints[0].position.x;
  //   noseY = poses[num].pose.keypoints[0].position.y;
  //   sketch.fill(255, 255, 255);
  //   sketch.ellipse(noseX, noseY, 50);
  // }

  function drawOnFace(num) {
    noseX = poses[num].pose.keypoints[0].position.x;
    noseY = poses[num].pose.keypoints[0].position.y;
    sketch.fill(255, 255, 0);
    sketch.ellipse(noseX, noseY, 10);
    sketch.push();
    sketch.imageMode(CENTER);
    sketch.image(
      newImage,
      noseX,
      noseY,
      // 210,
      // (newImage.height / newImage.width) * 210
      70,
      60
    );
    sketch.pop();
  }

  // A function to draw ellipses over the detected keypoints
  function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          sketch.fill(255, 0, 0);
          sketch.noStroke();
          sketch.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
      }
    }
  }
  // A function to draw the skeletons
  function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
      let skeleton = poses[i].skeleton;
      // For every skeleton, loop through all body connections
      for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        sketch.stroke(255, 0, 0);
        sketch.line(
          partA.position.x,
          partA.position.y,
          partB.position.x,
          partB.position.y
        );
      }
    }
  }
};

new p5(s2);

//reference that explains which array refers to which bodypart
//https://github.com/ml5js/ml5-library/issues/540
