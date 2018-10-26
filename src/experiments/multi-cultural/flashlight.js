
import { createElement } from './utils';
import { CANVAS_CONTAINER, WIDTH, HEIGHT } from './settings';

/**
 * Overlay
 */
const overlayCanvas = createElement('canvas', CANVAS_CONTAINER);
overlayCanvas.width = WIDTH;
overlayCanvas.height = HEIGHT;
overlayCanvas.className = 'canvas--overlay';
const overlayContext = overlayCanvas.getContext('2d');

const drawFlashlight = ({ x, y }, radius = (WIDTH / 4)) => {
	overlayContext.globalCompositeOperation = 'source-over';

	overlayContext.fillStyle = 'rgba(0, 0, 0, 0.25)';
	overlayContext.clearRect(0, 0, overlayContext.canvas.width, overlayContext.canvas.height);
	overlayContext.fillRect(0, 0, overlayContext.canvas.width, overlayContext.canvas.height);

	overlayContext.beginPath();
	const radialGradient = overlayContext.createRadialGradient(x, y, 1, x, y, radius);
	radialGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

	overlayContext.globalCompositeOperation = 'destination-out';

	overlayContext.fillStyle = radialGradient;
	overlayContext.arc(x, y, radius, 0, Math.PI * 2, false);
	overlayContext.fill();
	overlayContext.closePath();
};

export default drawFlashlight;
