// import PerlinNoise from 'koalition-utils/math/perlin-noise';
// import Pointer from 'koalition-utils/animation/pointer';
import Animator from 'koalition-utils/animation/animator';
import Canvas from 'koalition-utils/browser/canvas';
import Color from 'color';
import convertRange from 'koalition-utils/math/convert-range';
import dat from 'dat-gui';
import Label from '../../helpers/label';
import SimplexNoise from 'simplex-noise';
import Stats from 'stats.js';
import Vector from 'koalition-utils/math/vector';
import { bindResizeEvents } from 'koalition-utils/browser/resize';

import '../experiments.scss';
import './style.scss';

/**
 * Project label
 */
new Label({
  title: 'Rainbow colored wave form lines',
  desc: 'Website experiments',
});

/**
 * Basic setup
 */
const animator = new Animator(),
  canvas = new Canvas(),
  context = canvas.getContext(),
  simplex = new SimplexNoise(),
  gui = new dat.GUI(),
  stats = new Stats();

/**
 * Settings
 */
const settings = {
  colorA: 'rgb(255, 255, 0)',
  colorB: 'rgb(255, 0, 255)',
  colorRotation: 0.3,
  density: 0.15,
  dissonance: 0.009,
  emphasis: 50,
  margin: 0.1,
  noiseIncrement: 0.005,
  points: 0.05,
};

/**
 * Animation
 */
class Line {
  constructor({ color = '#fff', emphasis = 1, points = 0, start, stop }) {
    this._start = new Vector(start.x, stop.y);
    this._stop = new Vector(stop.x, stop.y);
    this.color = color;
    this.emphasis = emphasis;
    this.points = points;
  }

  get length() {
    return this._start.distance(this._stop);
  }

  get start() {
    return this._start.copy();
  }
  set start({ x, y }) {
    this._start = new Vector(x, y);
    return this._start.copy();
  }

  get stop() {
    return this._stop.copy();
  }
  set stop({ x, y }) {
    this._stop = new Vector(x, y);
    return this._stop.copy();
  }

  draw(context, noiseY) {
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo(this._start.x, this._start.y);

    const pointDistance = this.length / (this.points + 2);
    let lastPoint = { x: this._start.x, y: this._start.y };
    for (
      let x = this._start.x + pointDistance;
      x < this._stop.x - pointDistance;
      x += pointDistance
    ) {
      let emphasisX =
        1 - Math.abs(convertRange(x, this._start.x, this._stop.x, -1, 1));
      const point = {
        x,
        y:
          this._start.y +
          simplex.noise2D(x, this._start.y * settings.dissonance + noiseY) *
            this.emphasis *
            emphasisX,
      };
      const controlPoint = {
        x: (lastPoint.x + point.x) / 2,
        y: (lastPoint.y + point.y) / 2,
      };
      context.quadraticCurveTo(
        lastPoint.x,
        lastPoint.y,
        controlPoint.x,
        controlPoint.y
      );
      lastPoint = point;
    }

    const controlPoint = {
      x: (lastPoint.x + this._stop.x) / 2,
      y: (lastPoint.y + this._stop.y) / 2,
    };
    context.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      this._stop.x,
      this._stop.y
    );
    context.stroke();
  }
}

// Loop
let data;

const createLines = () => {
  const { width, height } = canvas;
  const { colorA, colorB, density, margin, points } = settings;
  let colorStart = Color(colorA).color;
  let colorEnd = Color(colorB).color;
  const marginY = height * margin;
  const marginX = width * margin;
  const innerHeight = height - marginY * 2;
  const lineCount = Math.round(innerHeight * density);
  const yGutter = Math.round(innerHeight / lineCount);
  const pointCount = Math.floor(
    new Vector(0, marginX).distance({ x: 0, y: width - marginX }) * points
  );
  const lines = [];
  const colors = [];
  const rest = (innerHeight - lineCount * yGutter) / 2;

  for (let y = marginY + rest; y <= height - marginY - rest; y += yGutter) {
    colors.push(
      Color({
        r: Math.round(
          convertRange(y, marginY, height - marginY, colorStart[0], colorEnd[0])
        ),
        g: Math.round(
          convertRange(y, marginY, height - marginY, colorStart[1], colorEnd[1])
        ),
        b: Math.round(
          convertRange(y, marginY, height - marginY, colorStart[2], colorEnd[2])
        ),
      })
    );
    lines.push(
      new Line({
        emphasis:
          settings.emphasis *
          (1 - Math.abs(convertRange(y, marginY, height - marginY, -1, 1))),
        points: pointCount,
        start: { x: marginX, y },
        stop: { x: width - marginX, y },
      })
    );
  }

  data = { colors, lines, colorRotation: 0 };
};

const init = () => {
  animator.stop();

  const { width, height } = canvas;
  createLines();

  let noiseY = 1000 * Math.random();

  // Animation loop
  animator.start(() => {
    stats.begin();

    // Clear canvas
    context.clearRect(0, 0, width, height);

    // Draw lines
    const { colors, lines } = data;
    for (let l = 0; l < lines.length; l++) {
      const color = colors[l],
        line = lines[l];
      line.color = color
        .rotate(-data.colorRotation)
        .rgb()
        .string();
      line.draw(context, noiseY);
    }
    noiseY += settings.noiseIncrement;
    data.colorRotation += settings.colorRotation;

    stats.end();
  });
};

bindResizeEvents(createLines);
init();

/**
 * Stats and dat.GUI
 */
gui.addColor(settings, 'colorA').onChange(createLines);
gui.addColor(settings, 'colorB').onChange(createLines);
gui.add(settings, 'colorRotation', -5, 5);
gui.add(settings, 'density', 0.001, 0.25).onChange(createLines);
gui.add(settings, 'dissonance', 0, 0.01);
gui.add(settings, 'emphasis', 1, 100).onChange(createLines);
gui.add(settings, 'margin', 0, 0.4).onChange(createLines);
gui.add(settings, 'noiseIncrement', -0.1, 0.1).name('speed');
gui.add(settings, 'points', 0.001, 0.25).onChange(createLines);

stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
