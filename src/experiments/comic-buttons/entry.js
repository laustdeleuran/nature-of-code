import Animator from 'koalition-utils/animation/animator';
// import Canvas from 'koalition-utils/browser/canvas';
import Label from '../../helpers/label';
// import { bindResizeEvents } from 'koalition-utils/browser/resize';

import '../experiments.scss';
import './style.scss';
import Button, {
	BUTTON_STATE_APPEAR,
	BUTTON_STATE_HIDDEN,
	BUTTON_STATE_HOVER,
	BUTTON_STATE_IDLE,
	BUTTON_STATE_SELECT,
	BUTTON_STATE_SELECT_DISAPPEAR,
	BUTTON_STATE_UNSELECT,
	BUTTON_STATE_UNSELECT_DISAPPEAR,
} from './button';

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
  <a href="#button" class="button button--left button--hidden">
    <span class="button__text">Smooth</span>
  </a>
  <a href="#button" class="button button--right button--hidden">
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
		const btn = new Button({
			element: element,
			shadow:
				element.className.indexOf('button--right') > -1 ? 'right' : 'left',
		});
		btns.push(btn);

		setTimeout(() => (btn.state = BUTTON_STATE_APPEAR), 10);
		element.addEventListener('mouseenter', () => {
			if (btn.state === BUTTON_STATE_IDLE) btn.state = BUTTON_STATE_HOVER;
		});
		element.addEventListener('mouseleave', () => {
			if (btn.state === BUTTON_STATE_HOVER) btn.state = BUTTON_STATE_IDLE;
		});
		element.addEventListener('click', () => (btn.state = BUTTON_STATE_SELECT));
	}

	animator.start(() => btns.forEach(btn => btn.draw()));
});
