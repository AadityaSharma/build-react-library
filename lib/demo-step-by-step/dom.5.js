// 1. createElement Stub
// 2. createElement simple implementation
// 3. createElement Handle true/false short circuiting
// 4. createElement remove undefined nodes
// 5. rendering native DOM elements along with children

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

	const render = function (vdom, container, oldDom = container.firstChild) {
		if (!oldDom) {
			mountElement(vdom, container, oldDom);
		}
	};

	/**
	 * This method is responsible for rendering
	 * native DOM elements as well as functions.
	 */
	const mountElement = function (vdom, container, oldDom) {
		return mountSimpleNode(vdom, container, oldDom);
	};

	const mountSimpleNode = function (
		vdom,
		container,
		oldDomElement,
		parentComponent,
	) {
		let newDomElement = null;
		const nextSibling = oldDomElement && oldDomElement.nextSibling;

		if (vdom.type === 'text') {
			newDomElement = document.createTextNode(vdom.props.textContent);
		} else {
			newDomElement = document.createElement(vdom.type);
		}

		// setting reference to vdom to dom
		newDomElement._virtualElement = vdom;
		if (nextSibling) {
			container.insertBefore(newDomElement, nextSibling);
		} else {
			container.appendChild(newDomElement);
		}

		// TODO: Render Children
		// Magic of recursion happens here
		vdom.children.forEach((child) => {
			mountElement(child, newDomElement);
		});
	};

	return {
		createElement,
		render,
	};
})();
