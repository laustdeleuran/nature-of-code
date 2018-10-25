import '../experiments.scss';
import './style.scss';

import constrain from 'utils/constrain';
import convertRange from 'utils/convert-range';




/**
 * Utils
 */
const createElement = (name, container = document.body) => {
	const element = document.createElement(name);
	if (container) container.appendChild(element);
	return element;
};



/**
 * Set up videos and vizualizations
 */
import VIDEOS from './data';
import Seriously from 'seriously';
import '../../../lib/seriouslyjs/effects/seriously.falsecolor.js';

// const videoContainer = createElement('div');
const canvasContainer = createElement('figure');

class MultiVideoplayer {
	static videos = VIDEOS;

	static selectedVideos = [];

	static getRandomUniqueVideoIndex = () => {
		const index = Math.floor(Math.random() * MultiVideoplayer.videos.length);
		if (MultiVideoplayer.selectedVideos.indexOf(index) > -1) return MultiVideoplayer.getRandomUniqueVideoIndex();
		else return index;
	}

	index = MultiVideoplayer.selectedVideos.push(null) - 1;
	elements = {
		canvas: createElement('canvas', canvasContainer),
		video: createElement('video', false),
	};
	seriously = new Seriously();

	constructor(posX = 'center', posY = 'center', width = 640, height = 360) {
		this.elements.canvas.addEventListener('click', () => this.init());
		this.width = width;
		this.height = height;
		this.position = { x: posX, y: posY };
	}

	init() {
		this.addVideoListener();

		this.elements.canvas.width = this.width;
		this.elements.canvas.height = this.height;
		this.elements.video.width = this.width;
		this.elements.video.height = this.height;

		this.start();
		this.bindSeriously();
	}

	bindSeriously() {
		const { canvas, video } = this.elements;
		let source = this.seriously.source(video),
			target = this.seriously.target(canvas),
			effect = this.seriously.effect('falsecolor');

		effect.source = source;
		target.source = effect;
		this.seriously.go();
	}

	addVideoListener() {
		const { video } = this.elements;
		video.addEventListener('ended', this.start);
	}

	start() {
		const src = this.selectVideoSrc();
		const { video } = this.elements;
		video.src = src;

		video.play();
	}

	selectVideoSrc() {
		const index = MultiVideoplayer.getRandomUniqueVideoIndex();
		MultiVideoplayer.selectedVideos[this.index] = index;
		return MultiVideoplayer.videos[index];
	}

	set volume(volume) {
		const { video } = this.elements;
		video.volume = volume;
		return video.volume;
	}

	getDistance = ({ x: xCur, y: yCur }) => {
		const { canvas } = this.elements;
		let { x, y, width, height } = canvas.getBoundingClientRect();
		switch (this.position.x) {
			case 'center':
				x += width / 2;
				break;
			case 'right':
				x += width;
				break;
		}
		switch (this.position.y) {
			case 'center':
				y += height / 2;
				break;
			case 'bottom':
				y += height;
				break;
		}
		const distance = Math.sqrt(Math.pow(Math.abs(x - xCur), 2) + Math.pow(Math.abs(y - yCur), 2));
		const radius = height / 2;
		return constrain(convertRange(distance, radius, radius * 3, 1, 0), 0, 1);
	};

	setVolume = position => {
		const { video } = this.elements;
		let distance = this.getDistance(position);
		video.volume = constrain(distance, 0.2, 1);
		this.elements.canvas.style.opacity = constrain(distance, 0.5, 1);
	};
}

const players = [];
for (let i = 0; i < 4; i++) {
	let player = new MultiVideoplayer(
		(i  === 0 || i === 2) ? 'left' : 'right',
		(i  === 0 || i === 1) ? 'top' : 'bottom',
	);
	players.push(player);
	player.init();
}

/**
 * Set up mouse and volume tracking
 */
import Animator from 'utils/animator';
import Pointer from 'utils/pointer';

const animator = new Animator();
const pointer = new Pointer({
	acceleration: 0.1,
	position: {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}
});

animator.start(() => {
	pointer.update();

	for (let p = 0; p < players.length; p++) {
		players[p].setVolume(pointer.position);
	}
});



/**
 * Project label
 */
import Label from '../../helpers/label';

new Label({
	title: 'MultiCULTural',
	desc: 'Let me tell you how to do that'
});

