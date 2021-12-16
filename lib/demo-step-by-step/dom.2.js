// 1. createElement Stub
// 2. createElement simple implementation

const TinyReact = (function () {
	function createElement(type, attributes = {}, ...children) {
		const childElements = [].concat(...children).map((child) => {
			// console.table({
			// 	child,
			// 	type: typeof child,
			// 	instanceOfObject: child instanceof Object,
			// });
			return child instanceof Object
				? child
				: createElement('text', {
						textContent: child,
				  });
		});
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
