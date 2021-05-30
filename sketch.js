import Particle from "./particle.js";
import init from "./initialise.js";
import Counter from "./counter.js";

let particles = [];

let idCounter = new Counter(0);

const renderOptions = {
  xscale: 1,
  yscale: 1,
  debug: false,
};

const options = {
  timescale: 1,
};

window.setup = function () {
  createCanvas(innerWidth, innerHeight);

  init(particles, idCounter);
};

window.draw = function () {
  background("BLACK");
  moveParticles();
  updateForces();
  drawParticles();
};

function updateForces() {
  particles.forEach((particle) => {
    particle.calculateForce(particles);
  });
}

function moveParticles() {
  particles.forEach((particle) => {
    particle.move(options);
  });
}

function drawParticles() {
  particles.forEach((particle) => {
    particle.draw(renderOptions);
  });
}

function convertMass(number, tenExponent) {
  return number * Math.pow(10, tenExponent - 11);
}

export function massToSize(mass) {
  return max(10, sqrt(mass / PI));
}
