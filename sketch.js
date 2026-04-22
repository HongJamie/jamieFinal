let chords = {};
let electricChords = {};

let currentChord = null;

let sounds = {};
let electricSounds = {};

let mode = "acoustic";

let baseColor;
let bgColor;
let glowColor;
let glowAmount = 0;

let handImg;
let fretboardImg;

function preload() {
  soundFormats('mp3');
  
  handImg = loadImage("hand.png");
  fretboardImg = loadImage("fretboard.jpg");

  // Acoustic sounds
  sounds.C = loadSound("sounds/c.mp3");
  sounds.G = loadSound("sounds/g.mp3");
  sounds.D = loadSound("sounds/d.mp3");
  sounds.Em = loadSound("sounds/em.mp3");
  sounds.Am = loadSound("sounds/am.mp3");
  sounds.E = loadSound("sounds/e.mp3");
  sounds.A = loadSound("sounds/a.mp3");
  sounds.F = loadSound("sounds/f.mp3");
  
  // Electric sounds
  electricSounds.D1 = loadSound("electricSounds/d1.mp3");
  electricSounds.E5 = loadSound("electricSounds/e5.mp3");
  electricSounds.F5 = loadSound("electricSounds/f5.mp3");
  electricSounds.G5 = loadSound("electricSounds/g5.mp3");
  electricSounds.A5 = loadSound("electricSounds/a5.mp3");
  electricSounds.C2 = loadSound("electricSounds/c2.mp3");
}

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);

  userStartAudio();

  baseColor = color(20, 20, 20);
  bgColor = color(20, 20, 20);
  glowColor = color(20, 20, 20);
  
  // Acoustic chord finger positions
  chords = {
    "C": [[2,1,1],[4,2,2],[5,3,3]],
    "G": [[1,3,4],[2,3,3],[5,2,1],[6,3,2]],
    "D": [[1,2,2],[2,3,3],[3,2,1]],
    "Em": [[5,2,2],[4,2,3]],
    "Am": [[2,1,1],[3,2,2],[4,2,3]],
    "E": [[3,1,1],[5,2,2],[4,2,3]],
    "A": [[2,2,3],[3,2,2],[4,2,1]],
    "F": [[2,1,1],[3,2,2],[4,3,4],[5,3,3]]
  };

  // Electric chord finger positions
  electricChords = {
    "D1": [[5,5,1],[4,7,3],[3,7,4]],
    "E5": [[5,7,1],[3,9,2],[4,9,3]],
    "F5": [[5,8,1],[3,10,2],[4,10,3]],
    "G5": [[5,10,1],[4,12,2],[3,12,3]],
    "A5": [[4,2,1],[3,2,3]],
    "C2": [[5,3,1],[4,5,3],[3,5,4]]
  };
}

function draw() {
  let targetBg = lerpColor(baseColor, glowColor, glowAmount);
  bgColor = lerpColor(bgColor, targetBg, 0.12);

  background(bgColor);

  // fade glow out
  if (mode === "acoustic") {
    if (glowAmount > 0) {
      glowAmount -= 0.015;
    }
  } else if (mode === "electric") {
    if (glowAmount > 0) {
      glowAmount -= 0.03;
    }
  }

  if (glowAmount < 0) {
    glowAmount = 0;
  }

  if (
    glowAmount === 0 &&
    abs(red(bgColor) - red(baseColor)) < 1 &&
    abs(green(bgColor) - green(baseColor)) < 1 &&
    abs(blue(bgColor) - blue(baseColor)) < 1
  ) {
    bgColor = color(20, 20, 20);
  }

  drawModeLabel();

  if (mode === "acoustic") {
    drawAcousticView();
  } else if (mode === "electric") {
    drawElectricView();
  }

  if (currentChord) {
    if (mode === "acoustic") {
      drawChord(chords[currentChord], false);
    } else if (mode === "electric") {
      drawChord(electricChords[currentChord], true);
    }
    drawChordName(currentChord);
  }

  drawInstructions();
}

function drawModeLabel() {
  noStroke();
  fill(220);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Mode: " + mode.toUpperCase(), 15, 12);
  textAlign(CENTER, CENTER);
}

function drawAcousticView() {
  image(handImg, 450, 60, 350, 300);

  // Finger labels on hand
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("1", 590, 118);
  text("2", 638, 100);
  text("3", 675, 110);
  text("4", 709, 145);

  drawAcousticFretboard();
  drawAcousticStringLabels();
}

function drawElectricView() {
  drawElectricFretboard();
  drawElectricStringLabels();
}

function drawAcousticFretboard() {
  stroke(255);

  let startX = 150;
  let startY = 80;
  let spacingX = 80;
  let spacingY = 40;
  
  image(fretboardImg, 144, 70, 330, 220);
  
  let weights = [1, 1.5, 2, 2.5, 3, 3.5];

  for (let i = 0; i < 6; i++) {
    strokeWeight(weights[i]);
    line(startX, startY + i * spacingY, startX + 4 * spacingX, startY + i * spacingY);
  }
}

function drawAcousticStringLabels() {
  stroke(0);
  strokeWeight(3);
  fill(255);
  textSize(18);

  let startY = 80;
  let spacingY = 40;

  text("E", 130, startY + 0 * spacingY);
  text("B", 130, startY + 1 * spacingY);
  text("G", 130, startY + 2 * spacingY);
  text("D", 130, startY + 3 * spacingY);
  text("A", 130, startY + 4 * spacingY);
  text("E", 130, startY + 5 * spacingY);
}

function drawElectricFretboard() {
  let startX = 95;
  let startY = 82;
  let spacingX = 52;
  let spacingY = 38;
  let fretsToDraw = 12;

  let weights = [1, 1.5, 2, 2.5, 3, 3.5];

  // Strings
  stroke(235);
  for (let i = 0; i < 6; i++) {
    strokeWeight(weights[i]);
    line(
      startX,
      startY + i * spacingY,
      startX + fretsToDraw * spacingX,
      startY + i * spacingY
    );
  }

  // Nut
  stroke(255);
  strokeWeight(6);
  line(startX, startY - 8, startX, startY + 5 * spacingY + 8);

  // Frets
  stroke(180);
  strokeWeight(2);
  for (let i = 1; i <= fretsToDraw; i++) {
    line(
      startX + i * spacingX,
      startY - 8,
      startX + i * spacingX,
      startY + 5 * spacingY + 8
    );
  }

  // Fret markers
  noStroke();
  fill(160);

  let markers = [3, 5, 7, 9];
  for (let f of markers) {
    ellipse(startX + (f - 0.5) * spacingX, startY + 2.5 * spacingY, 8);
  }

  // Double marker at 12th fret
  ellipse(startX + (12 - 0.5) * spacingX, startY + 2 * spacingY, 8);
  ellipse(startX + (12 - 0.5) * spacingX, startY + 3 * spacingY, 8);

  // Fret numbers
  fill(180);
  textSize(11);
  for (let i = 1; i <= fretsToDraw; i++) {
    text(i, startX + (i - 0.5) * spacingX, startY + 5 * spacingY + 24);
  }
}

function drawElectricStringLabels() {
  fill(255);
  textSize(18);

  let startY = 82;
  let spacingY = 38;

  text("E", 72, startY + 0 * spacingY);
  text("B", 72, startY + 1 * spacingY);
  text("G", 72, startY + 2 * spacingY);
  text("D", 72, startY + 3 * spacingY);
  text("A", 72, startY + 4 * spacingY);
  text("E", 72, startY + 5 * spacingY);
}

function drawChord(fingers, isElectric) {
  let startX, startY, spacingX, spacingY;

  if (isElectric) {
    startX = 95;
    startY = 82;
    spacingX = 52;
    spacingY = 38;
  } else {
    startX = 150;
    startY = 80;
    spacingX = 80;
    spacingY = 40;
  }

  for (let f of fingers) {
    let string = f[0] - 1;
    let fret = f[1];
    let fingerNum = f[2];

    let x;
    if (fret === 0) {
      x = startX - 24;
    } else {
      x = startX + (fret - 0.5) * spacingX;
    }

    let y = startY + string * spacingY;

    if (fret === 0) {
      noFill();
      stroke(255);
      strokeWeight(2);
      ellipse(x, y, 18);
      continue;
    }

    if (isElectric) {
      fill(255, 90, 90);
      stroke(255, 210, 210);
      strokeWeight(2);
      ellipse(x, y, 24);
    } else {
      fill(255, 120, 120);
      stroke(255, 200, 200);
      strokeWeight(1.5);
      ellipse(x, y, 24);
    }

    fill(255);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(fingerNum, x, y);
  }
}

function drawChordName(name) {
  fill(255);
  noStroke();
  textSize(32);
  text(name, width / 2, 40);
}

function drawInstructions() {
  noStroke();
  fill(200);
  textSize(14);

  if (mode === "acoustic") {
    text(
      "Press keys: 1 = G | 2 = C | 3 = D | 4 = Em | 5 = Am | 6 = E | 7 = A | 8 = F | Press E for electric mode",
      width / 2,
      height - 20
    );
  } else if (mode === "electric") {
    text(
      "Press keys: 1 = D1 | 2 = E5 | 3 = F5 | 4 = G5 | 5 = A5 | 6 = C2 | Press A for acoustic mode",
      width / 2,
      height - 20
    );
  }
}

function keyPressed() {
  // mode switching
  if (key === 'e' || key === 'E') {
    mode = "electric";
    currentChord = null;
    return;
  }

  if (key === 'a' || key === 'A') {
    mode = "acoustic";
    currentChord = null;
    return;
  }

  if (mode === "acoustic") {
    if (key === '1') playChord("G");
    if (key === '2') playChord("C");
    if (key === '3') playChord("D");
    if (key === '4') playChord("Em");
    if (key === '5') playChord("Am");
    if (key === '6') playChord("E");
    if (key === '7') playChord("A");
    if (key === '8') playChord("F");
  }

  if (mode === "electric") {
    if (key === '1') playChord("D1");
    if (key === '2') playChord("E5");
    if (key === '3') playChord("F5");
    if (key === '4') playChord("G5");
    if (key === '5') playChord("A5");
    if (key === '6') playChord("C2");
  }
}

function playChord(name) {
  currentChord = name;

  if (mode === "acoustic") {
    // warmer, softer acoustic colors
    if (name === "G") glowColor = color(180, 100, 50);
    if (name === "C") glowColor = color(205, 140, 70);
    if (name === "D") glowColor = color(220, 170, 90);
    if (name === "Em") glowColor = color(160, 110, 70);
    if (name === "Am") glowColor = color(190, 120, 85);
    if (name === "E") glowColor = color(170, 90, 55);
    if (name === "A") glowColor = color(210, 150, 85);
    if (name === "F") glowColor = color(150, 95, 65);
  }

  if (mode === "electric") {
    // brighter, more vivid electric colors
    if (name === "D1") glowColor = color(255, 60, 60);
    if (name === "E5") glowColor = color(255, 120, 40);
    if (name === "F5") glowColor = color(255, 230, 60);
    if (name === "G5") glowColor = color(80, 255, 140);
    if (name === "A5") glowColor = color(70, 170, 255);
    if (name === "C2") glowColor = color(210, 90, 255);
  }

  glowAmount = 1;

  stopAllSounds();

  if (mode === "acoustic") {
    if (sounds[name] && sounds[name].isLoaded()) {
      sounds[name].play();
    }
  }

  if (mode === "electric") {
    if (electricSounds[name] && electricSounds[name].isLoaded()) {
      electricSounds[name].play();
    }
  }
}

function stopAllSounds() {
  for (let chord in sounds) {
    if (sounds[chord].isPlaying()) {
      sounds[chord].stop();
    }
  }

  for (let chord in electricSounds) {
    if (electricSounds[chord].isPlaying()) {
      electricSounds[chord].stop();
    }
  }
}
