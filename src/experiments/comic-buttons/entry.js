import Animator from 'koalition-utils/animation/animator';
// import Canvas from 'koalition-utils/browser/canvas';
import Label from '../../helpers/label';
// import { bindResizeEvents } from 'koalition-utils/browser/resize';

import '../experiments.scss';
import './style.scss';
import Button from './button';

/**
 * Project label
 */
new Label({
	title: 'Comic buttons',
	desc: 'Website experiments',
});

/**
 * Player mockup
 */
const player = document.createElement('div');
player.className = 'player';
player.innerHTML = `
  <a href="#button" class="button button--left">
    <span class="button__text">Smooth</span>
  </a>
  <a href="#button" class="button button--right">
    <span class="button__text">Super<br/>crunchy</span>
  </a>
`;
document.body.appendChild(player);

/**
 * Init
 */
const animator = new Animator();
window.addEventListener('load', () => {
	const elements = document.getElementsByClassName('button');
	const btns = [];

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		btns.push(
			new Button({
				element: element,
				shadow:
					element.className.indexOf('button--right') > -1 ? 'right' : 'left',
			})
		);
	}

	animator.start(() => btns.forEach(btn => btn.draw()));
});
