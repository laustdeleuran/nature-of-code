import Label from '../../helpers/label';
import Canvas from 'koalition-utils/browser/canvas';
import Vector from 'koalition-utils/math/vector';

import '../examples.scss';

/**
 * Project label
 */
new Label({
  title: 'Vectors - try moving your pointer(s) around',
  desc: '1.3 - Nature of Code',
});

/**
 * Basic setup
 */
const canvas = new Canvas({
    resizeListener: (event, canvas) => {
      canvas.getContext().translate(canvas.width / 2, canvas.height / 2);
    },
  }),
  context = canvas.getContext(),
  clear = () =>
    context.clearRect(
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

/**
 * Draw vector
 */
const centerVector = new Vector(0, 0);

function draw(pointerVector) {
  // Draw line to pointer
  context.beginPath();
  context.moveTo(centerVector.x, centerVector.y);
  context.lineWidth = 1;
  context.lineTo(pointerVector.x, pointerVector.y);
  context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  context.stroke();

  // Draw rectangle the size of the distance to the pointer
  context.rect(
    -canvas.width / 2,
    -canvas.height / 2,
    pointerVector.magnitude,
    10
  );
  context.fillStyle = 'rgba(255, 255, 255, 0.25)';
  context.fill();

  // Draw line 50px towards pointer
  var lineVector = pointerVector
    .copy()
    .normalize()
    .multiply(50);
  context.beginPath();
  context.moveTo(centerVector.x, centerVector.y);
  context.lineWidth = 3;
  context.lineTo(lineVector.x, lineVector.y);
  context.strokeStyle = 'rgba(255, 255, 255, 1)';
  context.stroke();
}

/**
 * Listen
 */
canvas.element.addEventListener(
  'mousemove',
  function(event) {
    clear();
    draw(
      new Vector(
        event.clientX - canvas.width / 2,
        event.clientY - canvas.height / 2
      )
    );
  },
  { passive: true }
);

canvas.element.addEventListener(
  'touchmove',
  function(event) {
    event.preventDefault();
    clear();
    for (let i = 0; i < event.touches.length; i++) {
      let touch = event.touches[i];
      draw(
        new Vector(
          touch.clientX - canvas.width / 2,
          touch.clientY - canvas.height / 2
        )
      );
    }
  },
  { passive: true }
);
