let option = 1;

let pose = 1;
let frameCounter = 0;
let frameCounter2 = 0;
let frameCounter3 = 0;
const FRAME_DELAY = 60;
const FRAME_DELAY2 = 20;
const FRAME_DELAY3 = 20;

let posX = 44;
let posY = 684;
let walkSpeed = 2; 

let chainBroken = false;
let walk = false;

let isPaused = false;


function setup() {
  createCanvas(900, 900, WEBGL);
  background(255, 255, 255);
}

function draw() {
  if (isPaused) return;

  translate(-450, -450)
  background(255, 255, 255);

  if (option==1) {
    frameCounter++;
    if (frameCounter >= FRAME_DELAY) {
      frameCounter = 0;
      pose = (pose % 6) + 1; 
    }

    if (pose === 1) {
      drawCage();
      sitting();
    } else if (pose === 2) {
      drawCage();
      standing();
    } else if (pose === 3) {
      drawCage();
      push1();
    } else if (pose === 4) {
      bentCage();
      push2();
    } else if (pose == 5) {
      bentCage();
      walkAway1();
    } else if (pose == 6) {
      bentCage();
      walkAway2();
    }
  }

    if (option == 2) {
      if (frameCounter2++ >= FRAME_DELAY2) {
        frameCounter2 = 0;
        chainBroken = !chainBroken; 
      }
      drawChain(chainBroken);
    }

    if (option == 3) {
      fill(0);
      triangle(0,900,900,0,900,900);

      if (frameCounter3++ >= FRAME_DELAY2) {
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
      handDescend();
    }
  }

  function handDescend() {
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

  function drawChain(chainBroken) {
    let centerX = 450;
    let centerY = 450;
    let linkSize = 100; 
    let gap = 20;

    stroke(0);
    noFill();
    
    for (let i = -4; i <= 4; i++) {
          let x = centerX + i * (linkSize + gap);
          noFill();
          stroke(0);
          strokeWeight(8);
          ellipse(x, centerY, linkSize * 1.5 , linkSize, 8);
  }
  if (chainBroken) {
    background(255,255,255);
    for (let i = -4; i <= 4; i++) {
        let x = centerX + i * (linkSize + gap);
        if (i <= 0) {
          x -= 20;
        } else if (i > 0) {
          x += 20;
        }
        noFill();
        stroke(0);
        strokeWeight(8);
        ellipse(x, centerY, linkSize * 1.5 , linkSize, 8);

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
  if (option == 4) {
    option = 1;
  } else {
    option++;
  }
}
if (key =='p') {
  isPaused = !isPaused;
}
}

