import { renderOptions, addParticle } from "./sketch.js";
import Particle from "./particle.js";

const editorOptions = {
  defaultMass: 100,
  scrollMassIncrement: 100,
};

let mass = editorOptions.defaultMass;

export function drawTools() {
  push();

  noFill();
  stroke("WHITE");
  strokeWeight(5);
  circle(mouseX, mouseY, renderOptions.sizefunction(mass));

  noStroke();
  fill("WHITE");
  text(
    `Mass: ${mass} x 10^11`,
    mouseX + renderOptions.sizefunction(mass) + 10,
    mouseY
  );

  pop();
}

window.mouseWheel = function (event) {
  mass += -Math.sign(event.delta) * editorOptions.scrollMassIncrement;
};

window.mousePressed = function (event) {
  console.log(mouseX, mouseY);

  if (event.button == 0) {
    let particle = new Particle(
      mass,
      createVector(mouseX, mouseY),
      createVector(0, 0),
      createVector(random(-10, 10), random(-10, 10))
    );
    addParticle(particle);
    console.log(particle);
  }
};
