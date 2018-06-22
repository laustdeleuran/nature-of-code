export default function addMarkup(labels) {
	if (!Array.isArray(labels) || labels.length < 1) return;

	const container = document.createElement('div');
	container.className = 'markup';
	document.body.appendChild(container);

	return labels.map(label => {
		const element = document.createElement('a');
		element.className = 'label';
		element.innerHTML = label;
		container.appendChild(element);
		return element;
	});
}
