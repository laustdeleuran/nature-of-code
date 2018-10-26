import { WIDTH, OVERLAY_CONTEXT } from './settings';

/**
 * Overlay
 */

const drawFlashlight = ({ x, y }, radius = (WIDTH / 4)) => {
	OVERLAY_CONTEXT.globalCompositeOperation = 'source-over';

	OVERLAY_CONTEXT.fillStyle = 'rgba(0, 0, 0, 0.75)';
	OVERLAY_CONTEXT.clearRect(0, 0, OVERLAY_CONTEXT.canvas.width, OVERLAY_CONTEXT.canvas.height);
	OVERLAY_CONTEXT.fillRect(0, 0, OVERLAY_CONTEXT.canvas.width, OVERLAY_CONTEXT.canvas.height);

	OVERLAY_CONTEXT.beginPath();
	const radialGradient = OVERLAY_CONTEXT.createRadialGradient(x, y, 1, x, y, radius);
	radialGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

	OVERLAY_CONTEXT.globalCompositeOperation = 'destination-out';

	OVERLAY_CONTEXT.fillStyle = radialGradient;
	OVERLAY_CONTEXT.arc(x, y, radius, 0, Math.PI * 2, false);
	OVERLAY_CONTEXT.fill();
	OVERLAY_CONTEXT.closePath();
};

export default drawFlashlight;
