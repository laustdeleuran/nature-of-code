/**
 * Credit: A lot of the code here was inspired by https://github.com/anvaka/fieldplay
 */

import Label from '../../helpers/label';
import convertRange from 'koalition-utils/math/convert-range';
import Canvas from 'koalition-utils/browser/canvas';
import Animator from 'koalition-utils/animation/animator';
import Vector from 'koalition-utils/math/vector';
import Color from 'color';
// import PerlinNoise from 'koalition-utils/math/perlin-noise';
// import Pointer from 'koalition-utils/animation/pointer';
import Stats from 'stats.js';
import { bindResizeEvents } from 'koalition-utils/browser/resize';
import dat from 'dat-gui';

import '../experiments.scss';
import './style.scss';

/**
 * Project label
 */
new Label({
  title: 'Vector field and particles',
  desc: 'Website experiments',
});

/**
 * Basic setup
 */
const animator = new Animator(),
  canvas = new Canvas(),
  context = canvas.getContext(),
  stats = new Stats();

stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
// context.fillStyle = 'rgba(0, 0, 0, 0.0625)';

/**
 * Particle
 */
class Particle {
  constructor({
    color = '#fff',
    diameter = Math.random() * 2 + 0.5,
    position: { x, y },
  }) {
    this.color = color;
    this.diameter = diameter;
    this.position = { x, y };
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }

  move(velocity) {
    let { x, y } = this.position;
    x += velocity.x;
    y += velocity.y;
    this.position = { x, y };
  }

  draw(context = context) {
    const { color, diameter, position } = this;
    var { x, y } = position;
    var radius = diameter / 2;

    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }
}

/**
 * Draw
 */
const settings = {
  coordinateFactor: 8,
  fieldMap: 'burst',
  bgColorA: '#5a007f',
  bgColorB: '#7d0000',
  particleColorA: '#c3bbff',
  particleColorB: '#ffc864',
  particles: 700,
  randomReset: 0.01,
  trailVisibility: 0.65,
};

let particles;

const getColorFromPosition = (
  { x, y },
  colorA,
  colorB,
  length = new Vector(canvas.width, canvas.height).magnitude
) => {
  const magnitude = new Vector(x, y).magnitude;
  return {
    r: convertRange(magnitude, 0, length, colorA.r, colorB.r),
    g: convertRange(magnitude, 0, length, colorA.g, colorB.g),
    b: convertRange(magnitude, 0, length, colorA.b, colorB.b),
  };
};

const convertPosition = ({ x, y }, { width, height } = canvas) => ({
  x: convertRange(
    x,
    0,
    width,
    -settings.coordinateFactor,
    settings.coordinateFactor
  ),
  y: convertRange(
    y,
    0,
    height,
    -settings.coordinateFactor,
    settings.coordinateFactor
  ),
});

const isOutOfBounds = ({ x, y }, { width, height } = canvas) =>
  x < 0 || x > width || y < 0 || y > height;

// These "algorithms" in particular were sourced from https://github.com/anvaka/fieldplay
const getVelocity = {
  diamonds: position => ({
    x: -2 * (Math.floor(Math.abs(position.y)) % 2) + 1,
    y: -2 * (Math.floor(Math.abs(position.x)) % 2) + 1,
  }),
  burst: position => ({
    x: position.x,
    y: position.x / new Vector(position.x, position.y).magnitude,
  }),
  lines: position => ({
    x: Math.sin(position.y * Math.sin(position.y + position.y)),
    y: Math.sin(Math.cos(position.y)),
  }),
  rings: position => {
    const magnitude = new Vector(position.x, position.y).magnitude;
    return {
      x: Math.cos(Math.log(magnitude) * magnitude) / magnitude,
      y: position.y - position.y,
    };
  },
  twirl: position => ({
    x: position.x - Math.sin(new Vector(position.x, position.y).magnitude),
    y: position.x,
  }),
  waterfall: position => ({
    x: position.x / position.y,
    y: Math.sin(position.y),
  }),
};

const init = () => {
  animator.stop();

  particles = [];
  for (let p = 0; p < settings.particles; p++) {
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
      })
    );
  }

  const colorA = new Color(settings.particleColorA).rgb().object();
  const colorB = new Color(settings.particleColorB).rgb().object();
  const fieldMap = getVelocity[settings.fieldMap];
  const length = new Vector(canvas.width, canvas.height).magnitude;

  const gradient = context.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );
  gradient.addColorStop(0, new Color(settings.bgColorA).string());
  gradient.addColorStop(1, new Color(settings.bgColorB).string());
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Animation loop
  animator.start(() => {
    stats.begin();

    // Overlay canvas with semi-transparent gradient
    const gradient = context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(
      0,
      new Color(settings.bgColorA).fade(1 - settings.trailVisibility).string()
    );
    gradient.addColorStop(
      1,
      new Color(settings.bgColorB).fade(1 - settings.trailVisibility).string()
    );
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let p = 0; p < particles.length; p++) {
      let particle = particles[p];
      let velocity = fieldMap(convertPosition(particle.position));
      if (
        Math.random() < settings.randomReset ||
        isOutOfBounds(particle.position) ||
        Math.abs(velocity.x) + Math.abs(velocity.y) <= 0.001
      ) {
        particle.position = {
          x: canvas.width * Math.random(),
          y: canvas.height * Math.random(),
        };
        particles[p] = particle;
        velocity = fieldMap(convertPosition(particle.position));
      }

      const { r, g, b } = getColorFromPosition(
        particle.position,
        colorA,
        colorB,
        length
      );
      particle.color = `rgb(${r}, ${g}, ${b})`;

      particle.move(velocity);
      particle.draw(context);
    }

    stats.end();
  });
};

bindResizeEvents(init);
init();

// Set up dat.GUI
const gui = new dat.GUI();
gui.addColor(settings, 'bgColorA').onChange(init);
gui.addColor(settings, 'bgColorB').onChange(init);
gui.add(settings, 'coordinateFactor', 1, 100).onChange(init);
gui.add(settings, 'fieldMap', Object.keys(getVelocity)).onChange(init);
gui.addColor(settings, 'particleColorA').onChange(init);
gui.addColor(settings, 'particleColorB').onChange(init);
gui.add(settings, 'particles', 1, 2000).onChange(init);
gui.add(settings, 'randomReset', 0, 0.1).onChange(init);
gui.add(settings, 'trailVisibility', 0, 1).onChange(init);
