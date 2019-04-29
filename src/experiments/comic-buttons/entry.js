import Animator from 'koalition-utils/animation/animator';
import Canvas from 'koalition-utils/browser/canvas';
import Label from '../../helpers/label';
// import { bindResizeEvents } from 'koalition-utils/browser/resize';

import '../experiments.scss';
import './style.scss';

/**
 * Project label
 */
new Label({
  title: 'Comic buttons',
  desc: 'Website experiments',
});

/**
 * Basic setup
 */
const animator = new Animator(),
  canvas = new Canvas(),
  context = canvas.getContext();
