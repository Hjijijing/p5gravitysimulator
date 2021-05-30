import Particle from "./particle.js";
import { massToSize } from "./sketch.js";

export default function initializeParticles(particles, counter) {
  particles.push(
    new Particle(
      10000,
      createVector(400, 400),
      createVector(0, 0),
      createVector(0, 0),
      counter.increment(),
      massToSize
    )
  );
  particles.push(
    new Particle(
      15,
      createVector(200, 400),
      createVector(0, 0),
      createVector(0, -16),
      counter.increment(),
      massToSize
    )
  );

  particles.push(
    new Particle(
      50,
      createVector(400, 700),
      createVector(0, 0),
      createVector(15, 0),
      counter.increment(),
      massToSize
    )
  );

  particles.push(
    new Particle(
      100,
      createVector(400, 0),
      createVector(0, 0),
      createVector(13, 0),
      counter.increment(),
      massToSize
    )
  );
}
