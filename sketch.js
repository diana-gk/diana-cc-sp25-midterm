// let option = 1;


// function setup() {
//   createCanvas(900,900);
//   background(255,255,255);


// }

// function draw() {
//   sitting();
//   drawCage();

// }

// function sitting() {
//   noFill();
//   strokeWeight(10);

//   fill(0);
//   circle(445,420,100);

//   push();
//   translate(370,575);
//   rotate(2);
//   ellipse(0,0,300,75);
//   pop();

//   strokeWeight(40);
//   line(313,714,477,580);
//   line(477,580,509,716);

//   strokeWeight(10);



// }



// function drawCage() {
//   stroke(0);
//   strokeWeight(8);
//   noFill();
  
//   // Cage base - a simple ellipse below the figure
//   ellipse(400, 800, 650, 100);
  
//   // Cage vertical bars
//   for (let i = 0; i < 10; i++) {
//     let angle = map(i, 0, 9, 0, PI);
//     let x1 = 400 + 325 * cos(angle);
//     let y1 = 800 + 50 * sin(angle);
//     let x2 = 400 + 325 * cos(angle);
//     let y2 = 250;
    
//     line(x1, y1, x2, y2);
//   }
  
//   // Cage top
//   ellipse(400, 250, 650, 100);
  
//   // Cage horizontal bars (optional - for a more complete cage effect)
//   strokeWeight(6);
//   ellipse(400, 400, 650, 200);
//   ellipse(400, 550, 650, 300);
// }


// function mouseClicked() {
//   print(mouseX,mouseY);
// }

let option = 1;

function setup() {
  createCanvas(900, 900);
  background(255, 255, 255);
}

function draw() {
  drawCage();
  sitting();
}

function sitting() {
  noFill();
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
  
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 9, 0, PI);
    let x1 = 400 + 325 * cos(angle);
    let y1 = 850 + 50 * sin(angle);
    let x2 = 400 + 325 * cos(angle);
    let y2 = 250;
    
    line(x1, y1, x2, y2);
  }
  
  ellipse(400, 250, 650, 100); 
}

function mouseClicked() {
  print(mouseX, mouseY);
}