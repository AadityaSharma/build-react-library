// 1. createElement Stub
// 2. createElement simple implementation
// 3. createElement Handle true/false short circuiting
// 4. createElement remove undefined nodes
// 5. rendering native DOM elements along with children
// 6. set DOM attributes and events
// 7. diffing two trees of native DOM elements
// 8. removing extra nodes

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
		diff(vdom, container, oldDom);
	};

	const diff = function (vdom, container, oldDom) {
		let oldvdom = oldDom && oldDom._virtualElement;
		if (!oldDom) {
			mountElement(vdom, container, oldDom);
		} else if (oldvdom && oldvdom.type === vdom.type) {
			if (oldvdom.type === 'text') {
				updateTextNode(oldDom, vdom, oldvdom);
			} else {
				updateDomElement(oldDom, vdom, oldvdom);
			}

			// set a reference to updated vdom
			oldDom._virtualElement = vdom;

			// Recursively diff children...
			// Doing an index by index diffing (because we don't have keys yet)
			vdom.children.forEach((child, i) => {
				diff(child, oldDom, oldDom.childNodes[i]);
			});

			// Remove old nodes
			let oldNodes = oldDom.childNodes;
			if (oldNodes.length > vdom.children.length) {
				for (let i = oldNodes.length - 1; i >= vdom.children.length; i -= 1) {
					let nodeToBeRemoved = oldNodes[i];
					unmountNode(nodeToBeRemoved, oldDom);
				}
			}
		}
	};

	function unmountNode(domElement, parentComponent) {
		domElement.remove();
	}

	function updateTextNode(domElement, newVirtualElement, oldVirtualElement) {
		if (
			newVirtualElement.props.textContent !==
			oldVirtualElement.props.textContent
		) {
			domElement.textContent = newVirtualElement.props.textContent;
		}
		// set a reference to the newvdom in oldDom
		domElement._virtualElement = newVirtualElement;
	}

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
			updateDomElement(newDomElement, vdom);
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

	// TODO: set DOM attributes and events
	function updateDomElement(
		domElement,
		newVirtualElement,
		oldVirtualElement = {},
	) {
		const newProps = newVirtualElement.props || {};
		const oldProps = oldVirtualElement.props || {};
		Object.keys(newProps).forEach((propName) => {
			const newProp = newProps[propName];
			const oldProp = oldProps[propName];
			if (newProp !== oldProp) {
				if (propName.slice(0, 2) === 'on') {
					// prop is an event handler
					const eventName = propName.toLowerCase().slice(2);
					domElement.addEventListener(eventName, newProp, false);

					if (oldProp) {
						domElement.removeEventListener(eventName, oldProp, false);
					}
				} else if (propName === 'value' || propName === 'checked') {
					// these are special attributes that cannot be set
					// using setAttribute
					domElement[propName] = newProp;
				} else if (propName !== 'children') {
					// ignore the 'children' prop
					if (propName === 'className') {
						domElement.setAttribute('class', newProps[propName]);
					} else {
						domElement.setAttribute(propName, newProps[propName]);
					}
				}
			}
		});

		// remove oldProps
		Object.keys(oldProps).forEach((propName) => {
			const newProp = newProps[propName];
			const oldProp = oldProps[propName];
			if (!newProp) {
				if (propName.slice(0, 2) === 'on') {
					// prop is an event handler
					domElement.removeEventListener(propName, oldProp, false);
				} else if (propName !== 'children') {
					// ignore the 'children' prop
					domElement.removeAttribute(propName);
				}
			}
		});
	}

	return {
		createElement,
		render,
	};
})();
