/**
 * @const animator
 * @desc
 * Singleton handling animating a given function and optionally clearing the canvas
 */
const animator = {
  fps: 1000 / 100,
  clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  },
  step() {
    //this.clear();
    if (this.draw) {
      this.draw();
    }
  },
  animate(draw) {
    var now = Date.now();

    if (typeof draw === 'function') {
      this.draw = draw;
    }

    if (this.lastFrameDate === undefined || (now - this.lastFrameDate > this.fps)) {
      this.lastFrameDate = now;
      this.step();
    }

    this.animationFrame = window.requestAnimationFrame(() => this.animate());
  },
  stop() {
    window.cancelAnimationFrame(this.animationFrame);
  }
};
