import Particle from "./particle.js";
import init from "./initialise.js";
import Counter from "./counter.js";
import { drawTools } from "./editor.js";
import disableContextMenu from "./disableContextMenu.js";

document.oncontextmenu = disableContextMenu;

let particles = [];

let idCounter = new Counter(0);

export const renderOptions = {
  xscale: 1,
  yscale: 1,
  debug: false,
  fitToAll: true,
  sizefunction: massToSize,
};

export const movementOptions = {
  timescale: 1,
};

export const calculateForceOptions = {
  mergeDistance: 50,
};

window.setup = function () {
  createCanvas(innerWidth, innerHeight).position(0, 0);

  init(particles, idCounter);
};

window.draw = function () {
  background("BLACK");

  moveParticles();
  updateForces();
  drawParticles();

  drawTools();
};

function updateForces() {
  particles.forEach((particle) => {
    particle.calculateForce(particles, calculateForceOptions);
  });
}

function moveParticles() {
  particles.forEach((particle, index) => {
    particle.move(movementOptions);
    if (particle.mass <= 0) {
      particles.splice(index, 1);
    }
  });
}

function drawParticles() {
  if (renderOptions.fitToAll) {
    let minx = 0,
      miny = 0,
      maxx = width,
      maxy = height;

    particles.forEach((particle) => {
      minx = min(minx, particle.position.x);
      miny = min(miny, particle.position.y);
      maxx = max(maxx, particle.position.x);
      maxy = max(maxy, particle.position.y);
    });

    let w = maxx - minx;
    let h = maxy - miny;

    renderOptions.xScale = w / width;
    renderOptions.yScale = h / height;
  }

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

export function addParticle(particle) {
  particle.id = idCounter.increment();
  particles.push(particle);
}
