import { createElement } from './utils';

/**
 * Settings
 */
export const WIDTH = 1280;
export const HEIGHT = 720;
export const CANVAS_CONTAINER = createElement('figure');

export const OVERLAY_CANVAS = createElement('canvas', CANVAS_CONTAINER);
OVERLAY_CANVAS.width = WIDTH;
OVERLAY_CANVAS.height = HEIGHT;
OVERLAY_CANVAS.className = 'canvas--overlay';
export const OVERLAY_CONTEXT = OVERLAY_CANVAS.getContext('2d');
