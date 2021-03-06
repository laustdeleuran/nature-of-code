import Animator from 'koalition-utils/animation/animator';
import Canvas from 'koalition-utils/browser/canvas';
import Label from '../../helpers/label';
import { bindResizeEvents } from 'koalition-utils/browser/resize';

import Mote from './mote';
import Pointer from 'koalition-utils/animation/pointer';

import '../experiments.scss';
import './style.scss';

/**
 * Project label
 */
new Label({
  title: 'Dust motes in the upside down',
  desc: 'Dust motes',
});

/**
 * Basic setup
 */
const animator = new Animator(),
  canvas = new Canvas(),
  context = canvas.getContext();

// Init --------------------------------------------------------
let particles = [];

// Set canvas render mode
// context.globalCompositeOperation = 'lighter';

// Set up mouse tracking
const pointer = new Pointer({
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
});

const init = () => {
  animator.stop();

  // Create particles
  const particleCount = Math.round((canvas.width * canvas.height) / 3000);
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Mote({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      })
    );
  }

  // Animation loop
  animator.start(() => {
    const { width, height } = canvas;

    // Clear canvas
    context.clearRect(0, 0, width, height);

    // Update pointer position
    pointer.update();
    const { x: pointerX, y: pointerY } = pointer.position;
    let modX = (pointerX - width / 2) / -40,
      modY = (pointerY - height / 2) / -40;

    // Draw particles
    particles.forEach(particle => {
      particle.move();
      particle.draw(context, { x: modX, y: modY });
      particle.boundaryCheck(width, height);
    });
  });
};

bindResizeEvents(init);
init();
