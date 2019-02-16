/**
 * Credit: A lot of the code here was inspired by https://github.com/anvaka/fieldplay
 */

import Label from '../../helpers/label';
import convertRange from 'utils/convert-range';
import Canvas from 'utils/canvas';
import Animator from 'utils/animator';
import Vector from 'utils/vector';
import Color from 'color';
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
	title: 'Vector field and particles',
	desc: 'Website experiments'
});



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	gl = canvas.getContext('webgl'),
	stats = new Stats();

stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
// context.fillStyle = 'rgba(0, 0, 0, 0.0625)';



/**
 * Draw
 */
// const settings = {
// };

const init = () => {
	animator.stop();

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1, 1, 1, 1);

	let vs = '';
	vs += 'void main(void) {';
	vs += '  gl_Position = vec4(0.5, 0.5, 0.0, 1.0);';
	vs += '  gl_PointSize = 100.0;';
	vs += '}';

	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vs);
	gl.compileShader(vertexShader);

	let fs = '';
	fs += 'void main(void) {';
	fs += '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);';
	fs += '}';

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fs);
	gl.compileShader(fragmentShader);

	let shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

	// Animation loop
	animator.start(() => {

		stats.begin();

		// Draw stuff
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS, 0, 1);

		stats.end();
	});
};

bindResizeEvents(init);
init();



// Set up dat.GUI
// const gui = new dat.GUI();
