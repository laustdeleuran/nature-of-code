import Label from '../../helpers/label';
import Canvas from 'koalition-utils/browser/canvas';
import Animator from 'koalition-utils/animation/animator';
import convertRange from 'koalition-utils/math/convert-range';
import PerlinNoise from 'koalition-utils/math/perlin-noise';

import '../examples.scss';

/**
 * Project label
 */
new Label({
  title: 'Perlin walker',
  desc: 'I.7 - Nature of Code',
});

/**
 * Basic setup
 */
const animator = new Animator(),
  canvas = new Canvas(),
  context = canvas.getContext();

/**
 * Perlin noise walker
 */
class Walker {
  constructor(
    size = 20,
    color = 'rgba(255, 255, 255, 0.1)',
    increment = 0.0025
  ) {
    this.size = size;
    this.color = color;
    this.increment = increment;
    this.perlin = new PerlinNoise();
    this.xOff = Math.round(1000 * Math.random());
    this.yOff = Math.round(1000 * Math.random());

    this.move();
  }

  draw() {
    const radius = this.size / 2;

    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }

  move() {
    this.x = convertRange(this.perlin.noise(this.xOff), 0, 1, 0, canvas.width);
    this.y = convertRange(this.perlin.noise(this.yOff), 0, 1, 0, canvas.height);

    this.xOff += this.increment;
    this.yOff += this.increment;
  }
}

// Get this show moving
var wlkr = new Walker();
animator.start(function() {
  wlkr.draw();
  wlkr.move();
});
