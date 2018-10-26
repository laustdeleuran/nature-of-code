import Pointer from 'utils/pointer';

const pointer = new Pointer({
	acceleration: 0.1,
	position: {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}
});

export default pointer;
