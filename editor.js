import {
  renderOptions,
  addParticle,
  movementOptions,
  particleCount,
} from "./sketch.js";
import Particle from "./particle.js";

const editorOptions = {
  defaultMass: 100,
  scrollMassIncrement: 100,
  forcescale: 1,
  speedscale: 0.5,
};

const current = {
  mass: editorOptions.defaultMass,
  position: null,
  force: null,
  speed: null,
  state: 1,
  states: 3,
};

export function initEditor() {
  current.position = createVector(mouseX, mouseY);
  current.force = createVector(0, 0);
  current.speed = createVector(0, 0);
}

export function drawTools() {
  push();

  drawCurrent();

  noStroke();
  fill("WHITE");
  text(
    `Mass: ${current.mass} x 10^11 kg\n` +
      (current.force
        ? `Impulse: ${current.force.mag()}N (${current.force.x},${
            current.force.y
          })\n`
        : "") +
      (current.speed
        ? `Velocity: ${current.speed.mag()}m/s (${current.speed.x},${
            current.speed.y
          })\n`
        : ""),
    mouseX + renderOptions.sizefunction(current.mass) + 10,
    mouseY
  );

  text(
    renderOptions.fitToAll +
      "\n" +
      renderOptions.yscale +
      "\n" +
      renderOptions.xscale +
      "\n" +
      particleCount(),
    10,
    10
  );

  pop();
}

function drawCurrent() {
  push();

  //CIRCLE
  noFill();
  stroke("WHITE");
  strokeWeight(5);
  circle(
    current.position.x,
    current.position.y,
    renderOptions.sizefunction(current.mass)
  );

  //IMPULSE
  if (current.force) {
    stroke("RED");
    line(
      current.position.x,
      current.position.y,
      current.position.x + current.force.x,
      current.position.y + current.force.y
    );
  }

  //SPEED
  if (current.speed) {
    stroke("GREEN");
    line(
      current.position.x,
      current.position.y,
      current.position.x + current.speed.x,
      current.position.y + current.speed.y
    );
  }

  pop();
}

window.mouseWheel = function (event) {
  current.mass += -Math.sign(event.delta) * editorOptions.scrollMassIncrement;
};

window.mousePressed = function (event) {
  console.log(mouseX, mouseY);

  if (event.button == 0) {
    leftClick();
  }
};

function leftClick() {
  if (keyIsDown(16)) {
    switch (current.state) {
      case 2:
        current.force = createVector(0, 0);
        break;
      case 3:
        current.speed = createVector(0, 0);
    }
  }
  if (keyIsDown(17)) {
    current.state = current.states;
  }

  current.state++;

  if (current.state > current.states) {
    current.state = 1;

    let particle = new Particle(
      current.mass,
      createVector(
        current.position.x - renderOptions.offsetx,
        current.position.y - renderOptions.offsety
      ),
      createVector(current.force.x, current.force.y),
      createVector(current.speed.x, current.speed.y)
    );

    addParticle(particle);

    current.force = createVector(0, 0);
    current.speed = createVector(0, 0);
  }
}

window.mouseMoved = function () {
  switch (current.state) {
    case 1:
      current.position.set(mouseX, mouseY);
      break;
    case 2:
      current.force.set(
        mouseX - current.position.x,
        mouseY - current.position.y
      );
      current.force.mult(editorOptions.forcescale);
      break;
    case 3:
      current.speed.set(
        mouseX - current.position.x,
        mouseY - current.position.y
      );
      current.speed.mult(editorOptions.speedscale);
      break;
  }
};

window.keyPressed = function () {
  if (keyCode == 32) {
    movementOptions.playing = !movementOptions.playing;
  }
};
