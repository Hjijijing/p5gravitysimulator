import { clamp } from "./mathfunctions.js";
import { addCollision } from "./sketch.js";

const G = 6.6;

export default class Particle {
  constructor(mass, position, force, speed, id = 0) {
    this.mass = mass;
    this.position = position;
    this.force = force;
    this.speed = speed;
    this.id = id;
  }

  calculateForce(particles, { mergeDistance = -10, absorptionscale } = {}) {
    let resultingForce = createVector(0, 0);

    for (let particle of particles) {
      if (particle.id == this.id) continue;
      let distancex = particle.position.x - this.position.x;
      let distancey = particle.position.y - this.position.y;

      let distance = dist(
        this.position.x,
        this.position.y,
        particle.position.x,
        particle.position.y
      );

      if (distance < mergeDistance) {
        addCollision(this, particle);
        continue;
      }

      let magnitude = (G * (this.mass * particle.mass)) / distance ** 2;

      let gravityForce = createVector(distancex, distancey);
      gravityForce.normalize();
      gravityForce.mult(magnitude);

      resultingForce.add(gravityForce);
    }

    this.force = resultingForce;
  }

  move({
    timescale = 1,
    minimumx,
    maximumx,
    minimumy,
    maximumy,
    collisionscale,
  } = {}) {
    let speedIncrease = p5.Vector.div(this.force, this.mass).mult(
      timescale
    ); /*.mult(
      deltaTime / 1000
    );*/

    this.speed.add(speedIncrease);

    let positionIncrease = p5.Vector.mult(
      this.speed,
      timescale
    ); /*p5.Vector.mult(this.speed, deltaTime / 1000);*/

    this.position.add(positionIncrease);

    if (this.position.x < minimumx || this.position.x > maximumx) {
      let newX = clamp(this.position.x, minimumx, maximumx);
      this.position.x = newX;

      this.speed.x = -this.speed.x;
      this.speed.mult(collisionscale);
    }

    if (this.position.y < minimumy || this.position.y > maximumy) {
      let newY = clamp(this.position.y, minimumy, maximumy);
      this.position.y = newY;

      this.speed.y = -this.speed.y;
      this.speed.mult(collisionscale);
    }
  }

  draw({
    xscale = 1,
    yscale = 1,
    debug = false,
    offsetx = 0,
    offsety = 0,
    sizefunction = () => 10,
  } = {}) {
    push();
    fill("BLUE");

    let x = (this.position.x + offsetx) / xscale;
    let y = (this.position.y + offsety) / yscale;

    circle(x, y, sizefunction(this.mass));

    if (debug) {
      stroke("RED");
      line(x, y, x + this.force.x, y + this.force.y);

      stroke("GREEN");
      line(x, y, x + this.speed.x, y + this.speed.y);
    }

    pop();
  }
}
