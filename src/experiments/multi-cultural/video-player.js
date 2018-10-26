
import VIDEOS from './data';
import { CANVAS_CONTAINER, WIDTH, HEIGHT } from './settings';

import Seriously from 'seriously';
import '../../../lib/seriouslyjs/effects/seriously.ascii.js';

import { createElement } from './utils';
import constrain from 'utils/constrain';
import convertRange from 'utils/convert-range';



/**
 * Video players
 */
export default class MultiVideoplayer {
	static videos = VIDEOS;

	static selectedVideos = [];

	static getRandomUniqueVideoIndex = () => {
		const index = Math.floor(Math.random() * MultiVideoplayer.videos.length);
		if (MultiVideoplayer.selectedVideos.indexOf(index) > -1) return MultiVideoplayer.getRandomUniqueVideoIndex();
		else return index;
	}

	index = MultiVideoplayer.selectedVideos.push(null) - 1;
	elements = {
		canvas: createElement('canvas', CANVAS_CONTAINER),
		video: createElement('video', false),
	};
	seriously = new Seriously();

	constructor(posX = 'center', posY = 'center', width = WIDTH / 2, height = HEIGHT / 2) {
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
			effect = this.seriously.effect('ascii');

		effect.source = source;
		target.source = effect;
		this.seriously.go();

		this.srsly = { effect, source, target };
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
		return convertRange(distance, radius, radius * 3, 1, 0);
	};

	setVolume(distance) {
		const { video } = this.elements;
		video.volume = constrain(distance, 0.2, 1);
	}

	// setEffectAmount(distance) {
	// 	this.srsly.effect.size = constrain(convertRange(distance, 0, 3, 0.4, 0.001), 0.001, 0.4);
	// 	this.elements.canvas.style.opacity = constrain(distance, 0.5, 1);
	// }

	update(position) {
		let distance = this.getDistance(position);
		this.setVolume(distance);
		// this.setEffectAmount(distance);
	}
}
