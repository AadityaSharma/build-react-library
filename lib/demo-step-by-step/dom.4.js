// 1. createElement Stub
// 2. createElement simple implementation
// 3. createElement Handle true/false short circuiting
// 4. createElement remove undefined nodes

const TinyReact = (function () {
	function createElement(type, attributes = {}, ...children) {
		const childElements = [].concat(...children).reduce((acc, child) => {
			// "acc" is short form for - "accumulator"
			if (child != null && child !== true && child !== false) {
				child instanceof Object
					? acc.push(child)
					: acc.push(
							createElement('text', {
								textContent: child,
							}),
					  );
			}
			return acc;
		}, []);
		return {
			type,
			children: childElements,
			props: Object.assign({ children: childElements }, attributes),
		};
	}

	return {
		createElement,
	};
})();
