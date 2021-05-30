const G = 6.6;

export default class Particle {
  constructor(mass, position, force, speed, id = 0) {
    this.mass = mass;
    this.position = position;
    this.force = force;
    this.speed = speed;
    this.id = id;
  }

  calculateForce(particles, { mergeDistance = -10 } = {}) {
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
        particle.mass += this.mass;
        this.mass = 0;
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

  move({ timescale = 1 } = {}) {
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
  }

  draw({
    xscale = 1,
    yscale = 1,
    debug = false,
    sizefunction = () => 10,
  } = {}) {
    push();
    fill("BLUE");
    circle(
      this.position.x / xscale,
      this.position.y / yscale,
      sizefunction(this.mass)
    );

    if (debug) {
      stroke("RED");
      line(
        this.position.x,
        this.position.y,
        this.position.x + this.force.x,
        this.position.y + this.force.y
      );
    }

    pop();
  }
}
