/**
 * Utils
 */
export const createElement = (name, container = document.body) => {
	const element = document.createElement(name);
	if (container) container.appendChild(element);
	return element;
};

export const convertPosition = ({ x, y }, width, height) => ({
	x: x / window.innerWidth * width,
	y: y / window.innerHeight * height,
});
