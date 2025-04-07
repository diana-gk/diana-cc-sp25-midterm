let option = 1;

let pose = 1;
let sitOrStand = 1;
let frameCounter = 0;
let frameCounter2 = 0;
let frameCounter3 = 0;
let frameCounter4 = 0;
const FRAME_DELAY = 60;
const FRAME_DELAY1 = 600;
const FRAME_DELAY2 = 40;
const FRAME_DELAY3 = 20;

let posX = 44;
let posY = 684;
let walkSpeed = 2; 

let chainState = 0; // 0 = normal, 1 = vibrating, 2 = broken
let vibrationIntensity = 0;
let vibrationMaxIntensity = 8;
let vibrationTime = 0;
let vibrationDuration = 360; 
let walk = false;

let isPaused = false;

let timePassageCounter = 0;
let celestialAngle = 0;
const CELESTIAL_SPEED = 0.01;
let showSun = true;  

let clouds = [];
const NUM_CLOUDS = 10;
const CLOUD_SPEED = 0.5;

let animationStage = 0; // 0=sitting, 1=standing/pushing, 2=pulling cage, 3=breaking cage, 4=walking away, 5=off screen
let hasWalkedOff = false;
let pullCounter = 0;
const PULL_ATTEMPTS = 6; 
let barOffset = 0; 
let barBroken = false; 

function setup() {
  createCanvas(900, 900, WEBGL);
  background(255, 255, 255);
  let startAngle = PI;
  
  for (let i = 0; i < NUM_CLOUDS; i++) {
    clouds.push({
      x: random(-400, 1300),  
      y: random(100, 500),    
      width: random(30, 200), 
      height: random(40, 60), 
      speed: random(0.3, 1.2) * CLOUD_SPEED, 
      numBubbles: floor(random(3, 6)) 
    });
  }
}

function draw() {
  if (isPaused) return;

  translate(-450, -450);
  
  let skyColor;
  if (showSun) {
    skyColor = color(135, 206, 235);
  } else {
    skyColor = color(25, 25, 112);
  }
  
  if (showSun && celestialAngle > PI * 0.7) {
    //blend day to sunset
    let sunsetColor = color(255, 128, 77);
    skyColor = lerpColor(skyColor, sunsetColor, map(celestialAngle, PI * 0.7, PI, 0, 1));
  } else if (!showSun && celestialAngle > PI * 0.7) {
    // blend night to dawn
    let dawnColor = color(135, 81, 138);
    skyColor = lerpColor(skyColor, dawnColor, map(celestialAngle, PI * 0.7, PI, 0, 1));
  }
  
  background(skyColor);

  if (option == 1) {
    updateCelestialBodies();
    updateClouds();
    drawClouds();
    drawCelestialBodies();

    // sitting
    if (animationStage == 0) {
      frameCounter++;
      if (frameCounter >= FRAME_DELAY1) {
        frameCounter = 0;
        animationStage = 1; 
        pose = 1; 
      }
      
      drawCage();
      sitting();
    }
    // standing/pushing
    else if (animationStage == 1) {
      if (frameCounter4++ >= FRAME_DELAY2) {
        frameCounter4 = 0;
        pose++;
        
        if (pose > 3) {
          animationStage = 2; // start pulling cage
          pose = 1; 
          pullCounter = 0;
        }
      }

      if (pose == 1) {
        drawCage();
        standing();
      } else if (pose == 2) {
        drawCage();
        push1();
      } else if (pose == 3) {
        drawCage();
        push2();
      }
    }
    // pulling cage
    else if (animationStage == 2) {
      if (frameCounter4++ >= FRAME_DELAY2) {
        frameCounter4 = 0;
        pose = pose == 1 ? 2 : 1;
        
        if (pose == 1) {
          pullCounter++;
        }
        
        barOffset = sin(frameCount * 0.5) * (pullCounter + 5);
        
        if (pullCounter >= PULL_ATTEMPTS) {
          animationStage = 3;
          pose = 1;
          barBroken = true;
        }
      }
      
      drawShakingCage(barOffset);
      
      strokeWeight(20);
      
      if (pose == 1) {
        pullCage1();
      } else {
        pullCage2();
      }
    }
    // breaking cage
    else if (animationStage == 3) {
      if (frameCounter4 < FRAME_DELAY2) {
        background(skyColor);
        push();
        translate(random(-10, 10), random(-8, 8));
        drawBrokenCage();
        pop();
        
        stroke(0);
        strokeWeight(20);
        standing();
      } else {
        if (frameCounter4++ >= FRAME_DELAY2 * 3) { 
          frameCounter4 = 0;
          animationStage = 4; // move to walking away
          pose = 1;
        }
        
        drawBrokenCage();
        
        stroke(0);
        strokeWeight(20);
        standing();
      }
      
      frameCounter4++;
    }
    // walking away 
    else if (animationStage == 4) {
      if (frameCounter4++ >= FRAME_DELAY2) {
        frameCounter4 = 0;
        pose++;
        
        if (pose > 4) {
          animationStage = 5; // Off screen
        }
      }

      drawBrokenCage();
      
      stroke(0);
      strokeWeight(20);
  
      if (pose == 1) {
        walkAway1();
      } else if (pose == 2) {
        walkAway2();
      } else if (pose == 3) {
        walkAway3();
      } else if (pose == 4) {
        walkAway4();
      }
    }
    // off screen
    else if (animationStage == 5) {
      drawBrokenCage();
    }
  }

  if (option == 2) {
    background(255);
    
    if (chainState == 0) {
      if (frameCounter2++ >= FRAME_DELAY) {
        frameCounter2 = 0;
        chainState = 1; 
      }
      drawChain(false, 0); 
    } 
    else if (chainState == 1) { //chain vibrating
      vibrationTime++;
      
      vibrationIntensity = map(vibrationTime, 0, vibrationDuration, 0, vibrationMaxIntensity);
      
      if (vibrationTime >= vibrationDuration) {
        chainState = 2; 
        vibrationTime = 0;
      }
      
      drawChain(false, vibrationIntensity); 
    }
    else if (chainState == 2) { //chain broken
      drawChain(true, 0);
      
      if (frameCounter2++ >= FRAME_DELAY * 2) {
        frameCounter2 = 0;
        chainState = 0;
        vibrationIntensity = 0;
        vibrationTime = 0;
      }
    }
  }

  if (option == 3) {
    background(255);
    fill(0);
    triangle(0,900,900,0,900,900);

    if (frameCounter3++ >= FRAME_DELAY) {
      frameCounter3 = 0;
      walk = !walk; 
    }

    posX += walkSpeed;
    posY -= walkSpeed;
  
    if (posX > 337) {
      posX = 44;
      posY = 684;
    }
    
    uphill(walk, posX, posY);
    clawDescend();
  }
}

function drawChainLinkInnerEllipses(x, y, width, height) {
  const numInnerEllipses = 3;
  const stepSize = 8; 
  
  for (let i = 1; i <= numInnerEllipses; i++) {
    let innerWidth = width - (i * stepSize * 1.5);
    let innerHeight = height - (i * stepSize);
    
    if (innerWidth > 20 && innerHeight > 10) {
      strokeWeight(3);
      ellipse(x, y + (i * 3), innerWidth, innerHeight);
    }
  }
  strokeWeight(8); 
}

function drawChain(chainBroken, vibration) {
  let centerX = 450;
  let centerY = 450;
  let linkSize = 100; 
  let gap = 20;

  stroke(0);
  noFill();
  
  if (!chainBroken) {
    for (let i = -4; i <= 4; i++) {
      let vibOffset = 0;
      if (vibration > 0) {
        // creates a wave pattern along the chain
        vibOffset = sin(frameCount * 0.2 + i * 0.5) * vibration * (1 - abs(i)/5);
      }
      
      let x = centerX + i * (linkSize + gap);
      let y = centerY + vibOffset;
      
      noFill();
      stroke(0);
      strokeWeight(8);
      
      if (vibration > 0 && abs(i) <= 2) {
        // middle links stretch slightly when under tension
        let stretchFactor = map(vibration, 0, vibrationMaxIntensity, 1, 1.2);
        let linkWidth = linkSize * 1.5 * (i == 0 ? stretchFactor : 1);
        ellipse(x, y, linkWidth, linkSize * (i == 0 ? 0.9 : 1), 8);
        
        drawChainLinkInnerEllipses(x, y, linkWidth, linkSize * (i == 0 ? 0.9 : 1));
      } else {
        ellipse(x, y, linkSize * 1.5, linkSize, 8);
        drawChainLinkInnerEllipses(x, y, linkSize * 1.5, linkSize);
      }
    }
  } else {
    // broken chain
    background(255,255,255);
    
    for (let i = -4; i <= 0; i++) {
      let horizontalShift = i == 0 ? -35 : -20;
      let x = centerX + i * (linkSize + gap) + horizontalShift;
      
      noFill();
      stroke(0);
      strokeWeight(8);
      ellipse(x, centerY, linkSize * 1.5, linkSize, 8);
      
      drawChainLinkInnerEllipses(x, centerY, linkSize * 1.5, linkSize);
    }
    
    for (let i = 1; i <= 4; i++) {
      let horizontalShift = i == 1 ? 35 : 20;
      let x = centerX + i * (linkSize + gap) + horizontalShift;
      
      noFill();
      stroke(0);
      strokeWeight(8);
      ellipse(x, centerY, linkSize * 1.5, linkSize, 8);
      
      drawChainLinkInnerEllipses(x, centerY, linkSize * 1.5, linkSize);
    }
    
    fill(255,255,255);
    stroke(255,255,255);
    rect(430,336,120,220);

    stroke(0);
    line(436, 339, 468, 370);
    line(562,342,539,369);
    line(441, 545, 406, 577);
    line(522,544,547,566);
  }
}

function pullCage1() {
  fill(0);
  strokeWeight(20);
  stroke(0);
  
  // head
  circle(445, 440, 100);
  
  // body
  ellipse(450, 600, 50, 230);
  
  // arms - pulling position
  line(436, 500, 380, 400); // left arm 
  line(380, 400, 400, 250); 
  
  line(458, 503, 520, 400); // right arm 
  line(520, 400, 480, 250); 
  
  // legs
  line(440, 703, 379, 881);
  line(455, 705, 518, 874);
}

function pullCage2() {
  fill(0);
  strokeWeight(20);
  stroke(0);
  
  // head
  circle(445, 440, 100);
  
  // body
  ellipse(450, 600, 50, 230);
  
  // arms 
  line(436, 500, 360, 420); // left arm 
  line(360, 420, 395, 250); 
  
  line(458, 503, 540, 420); // right arm 
  line(540, 420, 485, 250); 
  
  // legs 
  line(440, 703, 379, 881);
  line(455, 705, 518, 874);
}

function drawShakingCage(offset) {
  push();
  translate(sin(frameCount * 0.3) * (offset * 0.15), 0);
  
  stroke(0);
  strokeWeight(8);
  noFill();
  
  ellipse(400, 850, 650, 100);
  
  line(725, 850, 725, 250);
  line(695, 855, 695, 250);
  line(637, 867, 637, 250);
  line(559, 878, 559, 250);
  
  // center bars shaking
  line(472 + offset * 1.5, 883, 472 + offset * 0.8, 250);
  line(400 + offset * -1.5, 885, 400 + offset * -0.8, 250);
  
  // other bars
  line(328, 883, 328, 250);
  line(241, 878, 241, 250);
  line(163, 867, 163, 250);
  line(105, 855, 105, 250);
  
  ellipse(400, 250, 650, 100);
  
  pop(); 
}

function drawBrokenCage() {
  push();
  translate(sin(frameCount * 0.2) * 4, cos(frameCount * 0.15) * 3);
  
  stroke(0);
  strokeWeight(8);
  noFill();
  
  ellipse(400, 850, 650, 100);
  
  line(725, 850, 725, 250);
  line(695, 855, 695, 250);
  line(637, 867, 637, 250);
  line(559, 878, 559, 250);
  
  // broken center bars upper half
  let topShake = sin(frameCount * 0.3) * 8;
  line(472 + topShake, 450, 472, 250);
  line(400 - topShake, 450, 400, 250);
  
  // broken center bars bottom half 
  let bottomShake = sin(frameCount * 0.4) * 12;
  line(472, 883, 480 + bottomShake, 500);
  line(400, 885, 390 - bottomShake, 500);
  
  line(328, 883, 328, 250);
  line(241, 878, 241, 250);
  line(163, 867, 163, 250);
  line(105, 855, 105, 250);
  
  ellipse(400, 250, 650, 100);
}

function updateCelestialBodies() {
  timePassageCounter++;
  
  celestialAngle += CELESTIAL_SPEED;
  
  if (celestialAngle >= PI) {
    celestialAngle = 0;
    showSun = !showSun;  
  }
}

function updateClouds() {
  for (let i = 0; i < clouds.length; i++) {
    let cloud = clouds[i];
    
    cloud.x -= cloud.speed;
    
    if (cloud.x < -200) {
      cloud.x = 1100;
      cloud.y = random(100, 500);
      cloud.width = random(70, 150);
      cloud.height = random(40, 70);
      cloud.numBubbles = floor(random(3, 6));
    }
  }
}

function drawClouds() {
  noStroke();
  
  let cloudColor;
  if (showSun) {
    cloudColor = color(255, 255, 255);
  } else {
    cloudColor = color(200, 200, 220);
  }
  
  fill(cloudColor);
  
  for (let i = 0; i < clouds.length; i++) {
    let cloud = clouds[i];
    push();
    translate(cloud.x, cloud.y);
    
    for (let i = 0; i < cloud.numBubbles; i++) {
      // //Version 1  
      //   let xOffset = (i - cloud.numBubbles/2) * (cloud.width/cloud.numBubbles);
      //   let yOffset = sin(i * 0.8) * (cloud.height * 0.2);
      //   let bubbleSize = random(0.7, 1.0) * cloud.height;
      //   ellipse(xOffset, yOffset, bubbleSize, bubbleSize);
      // }

      //Version2
      let xOffset = (i - cloud.numBubbles/2) * (cloud.width/cloud.numBubbles);
    
      let noiseValue = noise(i * 0.2);
      let yOffset = map(noiseValue, 0, 1, -cloud.height * 0.2, cloud.height * 0.2);
      
      let sizeNoise = noise(i * 0.3 + 100);
      let bubbleSize = map(sizeNoise, 0, 1, 0.7 * cloud.height, cloud.height);
    
      ellipse(xOffset, yOffset, bubbleSize, bubbleSize);
    }
    
    pop();
  }
}

function drawCelestialBodies() {
  push();
  let x = 800 * cos(PI - celestialAngle); 
  let y = -400 * sin(PI - celestialAngle); 
  
  translate(450 + x, 750 + y); 
  if (showSun) {
    fill(255, 215, 0);  
    noStroke();
    circle(0, 0, 60);
  } else {
    //moon
    fill(220, 220, 255); 
    noStroke();
    circle(0, 0, 50);
    
    fill(180, 180, 220);
    ellipse(-10, -5, 15, 15);
    ellipse(5, 10, 10, 10);
    ellipse(15, -12, 8, 8);
  }
  
  pop();
}

function clawDescend() {
  stroke(0);
  strokeWeight(4);
  beginShape();
  
  vertex(378, 65);
  vertex(376, 173);
  vertex(411,173);
  vertex(411,106);
  vertex(539, 106);
  vertex(536, 179);
  vertex(571,179);
  vertex(567,65);

  endShape();
}

function uphill(walk, x, y) {
  for (let i=0; i<200; i++) {
    fill(0);
    circle(x,y,40);

    strokeWeight(4);
    
    //torso
    line(x,y,x , y+ 76);
    //arms
    line(x, y + 43, x + 65, y + 10);

    //legs1
    if (walk) {
      // Walking stance 1
      line(x, y + 76, x + 56, y + 108);
      line(x, y + 76, x + 6, y + 165);
    } else {
      // Walking stance 2
      line(x, y + 76, x + 34, y + 140);
      line(x, y + 76, x + 77, y + 91);
    }
    fill(0);
    circle(x+137,y-16,200);
  } 
}

function walking(walk, x, y) {
  fill(0);
  circle(x,y,40);

  strokeWeight(4);
  
  //torso
  line(x,y,x , y+ 76);
  //arms
  line(x, y + 43, x + 65, y + 10);

  //legs1
  if (walk) {
    // Walking stance 1
    line(x, y + 76, x + 56, y + 108);
    line(x, y + 76, x + 6, y + 165);
  } else {
    // Walking stance 2
    line(x, y + 76, x + 34, y + 140);
    line(x, y + 76, x + 77, y + 91);
  }
}

function walkAway1() {
  fill(0);
  
  circle(550, 440, 100);
  
  ellipse(555, 600, 50, 230);

  strokeWeight(20);
  
  line(541, 500, 485, 570);
  line(563, 503, 625, 570);
  
  line(545, 703, 505, 881);
  line(560, 705, 595, 820);
  line(595,820,560,891);
}

function walkAway2() {
  fill(0);
  
  circle(650, 440, 100);
  
  ellipse(655, 600, 50, 230);

  strokeWeight(20);
  
  line(641, 500, 605, 570);
  line(663, 503, 705, 570);
  
  line(645, 703, 615, 820);
  line(660, 705, 685, 881);
  line(615,820,547,881);
}

function walkAway3() {
  fill(0);
  
  circle(750, 440, 100);
  
  ellipse(755, 600, 50, 230);

  strokeWeight(20);
  
  line(741, 500, 685, 570);
  line(763, 503, 825, 570);
  
  line(745, 703, 705, 881);
  line(760, 705, 795, 820);
  line(795, 820, 760, 891);
}

function walkAway4() {
  fill(0);
  
  circle(850, 440, 100);
  
  ellipse(855, 600, 50, 230);

  strokeWeight(20);
  
  line(841, 500, 805, 570);
  line(863, 503, 905, 570);
  
  line(845, 703, 815, 820);
  line(860, 705, 885, 881);
  line(815, 820, 747, 881);
}

function standing() {
  fill(0);
  circle(445, 440, 100);
  
  ellipse(450,600,50,230);

  strokeWeight(20);

  line(436,500,378,663);

  line(458,503, 503, 663);
  
  line(440,703,379,881);
  line(455,705,518,874);
}

function push1() {
  fill(0);
  circle(445, 440, 100);
  
  ellipse(450,600,50,230);

  strokeWeight(20);
  
  line(426,531,410,595);
  line(410,595,398,527);
  
  line(470, 527, 487,594);
  line(487,594,478, 518);

  line(440,703,379,881);
  line(455,705,518,874);
}

function push2() {
  fill(0);
  circle(445, 440, 100);
  
  ellipse(450,600,50,230);

  strokeWeight(20);
  
  line(432,496,348,521);
  line(348,521,376,482);

  line(462,495,539,523);
  line(539,523,500,496);

  line(440,703,379,881);
  line(455,705,518,874);
}

function bentCage() {
  stroke(0);
  strokeWeight(8);
  noFill();
  
  ellipse(400, 850, 650, 100);
  
  line(725, 850, 725, 250);
  line(695, 855, 695, 250);
  line(637, 867, 637, 250);
  line(559, 878, 559, 250);

  line(472, 250, 472, 450 );
  line(472, 883, 472, 700 );

  bezier(402,701,361,608,356,499,399,419);

  line(400, 885, 400, 700);
  line(400, 420, 400, 250);

  bezier(473,443,513,486,514,629,472,700);

  line(328, 883, 328, 250);
  line(241, 878, 241, 250);
  line(163, 867, 163, 250);
  line(105, 855, 105, 250);
  
  ellipse(400, 250, 650, 100); 
}

function sitting() {
  strokeWeight(10);
  
  fill(0);
  circle(445, 550, 100);
  
  push();
  translate(370, 705);
  rotate(2);
  ellipse(0, 0, 300, 75);
  pop();
  
  strokeWeight(40);
  line(313, 844, 477, 710);
  line(477, 710, 509, 846);
  
  strokeWeight(10);
}

function drawCage() {
  stroke(0);
  strokeWeight(8);
  noFill();
  
  ellipse(400, 850, 650, 100);
  
  line(725, 850, 725, 250);
  line(695, 855, 695, 250);
  line(637, 867, 637, 250);
  line(559, 878, 559, 250);
  line(472, 883, 472, 250);
  line(400, 885, 400, 250);
  line(328, 883, 328, 250);
  line(241, 878, 241, 250);
  line(163, 867, 163, 250);
  line(105, 855, 105, 250);
  
  ellipse(400, 250, 650, 100); 
}

function mouseClicked() {
  print(mouseX, mouseY);
}

function keyTyped() {
  if (key=='r') {
    animationStage = 0;
    pose = 1;
    celestialAngle = 0;
    showSun = true;
    frameCounter = 0;
    frameCounter4 = 0;
    pullCounter = 0;
    barOffset = 0;
    barBroken = false;
    
    chainState = 0;
    vibrationIntensity = 0;
    vibrationTime = 0;
    
    for (i = 0; i < clouds.length; ++i) {
      let cloud = clouds[i];
      cloud.x = random(-400, 1300);
      cloud.y = random(100, 500);
    }
    
    if (option == 3) {
      option = 1;
    } else {
      option++;
    }
  }
  if (key =='p') {
    isPaused = !isPaused;
  }
}