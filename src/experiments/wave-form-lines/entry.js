import Label from '../../helpers/label';
import convertRange from 'utils/convert-range';
import Canvas from 'utils/canvas';
import Animator from 'utils/animator';
import Vector from 'utils/vector';
// import PerlinNoise from 'utils/perlin-noise';
// import Pointer from 'utils/pointer';
import Stats from 'stats.js';
import { bindResizeEvents } from 'utils/resize';
import dat from 'dat-gui';

import '../experiments.scss';
import './style.scss';



/**
 * Project label
 */
new Label({
	title: 'Wave form lines',
	desc: 'Website experiments'
});



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();



/**
 * Stats and dat.GUI
 */
const gui = new dat.GUI(),
	stats = new Stats();
// gui.add(settings, 'coordinateFactor', 1, 100).onChange(init);
// gui.add(settings, 'fieldMap', Object.keys(getVelocity)).onChange(init);
// gui.add(settings, 'particles', 1, 2000).onChange(init);
// gui.add(settings, 'randomReset', 0, 0.1).onChange(init);


stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
// context.fillStyle = 'rgba(0, 0, 0, 0.0625)';



/**
 * Animation
 */
const init = () => {
	animator.stop();

	// Animation loop
	animator.start(() => {

		stats.begin();

		// DO ANIMATION HERE

		stats.end();
	});

};

bindResizeEvents(init);
init();


