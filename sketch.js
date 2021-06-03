import Particle from "./particle.js";
import init from "./initialise.js";
import Counter from "./counter.js";
import { drawTools, initEditor } from "./editor.js";
import disableContextMenu from "./disableContextMenu.js";

document.oncontextmenu = disableContextMenu;

let particles = [];

let collisions = [];

let idCounter = new Counter(0);

export const renderOptions = {
  xscale: 1,
  yscale: 1,
  debug: false,
  fitToAll: false,
  trackfirst: false,
  offsetx: 0,
  offsety: 0,
  sizefunction: massToSize,
};

export const movementOptions = {
  timescale: 1,
  playing: true,
  minimumx: Number.MIN_SAFE_INTEGER + 10,
  maximumx: Number.MAX_SAFE_INTEGER - 10,
  minimumy: Number.MIN_SAFE_INTEGER + 10,
  maximumy: Number.MAX_SAFE_INTEGER - 10,
  collisionscale: 0.7,
};

export const calculateForceOptions = {
  mergeDistance: -10,
  absorptionscale: 0.2,
};

export function particleCount() {
  return particles.length;
}

window.setup = function () {
  createCanvas(innerWidth, innerHeight).position(0, 0);

  init(particles, idCounter);

  initEditor();

  movementOptions.minimumx = 0;
  movementOptions.maximumx = width;
  movementOptions.minimumy = 0;
  movementOptions.maximumy = height;
};

window.draw = function () {
  background("BLACK");

  if (movementOptions.playing) {
    moveParticles();
    updateForces();
    handleCollisions();
  }

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

    console.log(miny, maxy);

    let w = maxx - minx;
    let h = maxy - miny;

    renderOptions.xscale = w / width;
    renderOptions.yscale = h / height;
  }

  if (renderOptions.trackfirst && particles.length > 0) {
    let first = particles[0];

    renderOptions.offsetx = width / 2 - first.position.x;
    renderOptions.offsety = height / 2 - first.position.y;
  }

  particles.forEach((particle) => {
    particle.draw(renderOptions);
  });
}

function handleCollisions() {
  collisions.forEach((collision) => {
    let par1 = collision[0];
    let par2 = collision[1];

    let winner = 0;
    let loser = 0;

    if (par1.mass > par2.mass) loser = 1;
    else winner = 1;

    collision[winner].mass += collision[loser].mass;
    collision[winner].speed.mult(calculateForceOptions.absorptionscale);
    collision[winner].force.mult(calculateForceOptions.absorptionscale);

    let loserIndex = particles.indexOf(collision[loser]);
    particles.splice(loserIndex, 1);
  });

  collisions = [];
}

export function addCollision(par1, par2) {
  let alreadyExists = false;
  collisions.forEach((collision) => {
    if (
      (collision[0].id == par1.id && collision[1].id == par2.id) ||
      (collision[0].id == par2.id && collision[1].id == par1.id)
    )
      alreadyExists = true;
  });

  if (alreadyExists) return;

  collisions.push([par1, par2]);
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
