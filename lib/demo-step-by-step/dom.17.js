// 1. createElement Stub
// 2. createElement simple implementation
// 3. createElement Handle true/false short circuiting
// 4. createElement remove undefined nodes
// 5. rendering native DOM elements along with children
// 6. set DOM attributes and events
// 7. diffing two trees of native DOM elements
// 8. removing extra nodes
// 9. rendering functional component
// 10. passing props to functional component
// 11. nest functional components (no change in code here -> check demo app)
// 11.1. diffing functional components (just remove extra nodes for now)
// 12. render stateful component
// 13. passing props to stateful component
// 14. implement setState method in base component -> parameter as object
// 15. implement the stub for lifecycle method
// 16. diffing stateful components (ISSUE: new props coming as #text->object should be toString() in app)
// 17. Adding ref support

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
		let oldComponent = oldvdom && oldvdom.component;

		if (!oldDom) {
			mountElement(vdom, container, oldDom);
		} else if (typeof vdom.type === 'function') {
			diffComponent(vdom, oldComponent, container, oldDom);
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
		const virtualElement = domElement._virtualElement;
		if (!virtualElement) {
			domElement.remove();
			return;
		}

		if (virtualElement.props && virtualElement.props.ref) {
			virtualElement.props.ref(null);
		}
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

	function diffComponent(
		newVirtualElement,
		oldComponent,
		container,
		domElement,
	) {
		if (isSameComponentType(oldComponent, newVirtualElement)) {
			updateComponent(newVirtualElement, oldComponent, container, domElement);
		} else {
			mountElement(newVirtualElement, container, domElement);
		}
	}

	function updateComponent(
		newVirtualElement,
		oldComponent,
		container,
		domElement,
	) {
		// Invoke Lifecycle Method
		oldComponent.componentWillReceiveProps(newVirtualElement.props);

		// Invoke Lifecycle Method
		if (oldComponent.shouldComponentUpdate(newVirtualElement.props)) {
			const prevProps = oldComponent.props;

			// Invoke Lifecycle Method
			oldComponent.componentWillUpdate(
				newVirtualElement.props,
				oldComponent.state,
			);

			// update component
			oldComponent.updateProps(newVirtualElement.props);

			// Call render()
			// Generate new vdom
			const nextElement = oldComponent.render();
			nextElement.component = oldComponent;

			// Recursively diff again
			diff(nextElement, container, domElement, oldComponent);

			// Invoke Lifecycle Method
			oldComponent.componentDidUpdate(prevProps);
		}
	}

	function isSameComponentType(oldComponent, newVirtualElement) {
		return oldComponent && newVirtualElement.type === oldComponent.constructor;
	}

	/**
	 * This method is responsible for rendering
	 * native DOM elements as well as functions.
	 */
	function mountElement(vdom, container, oldDom) {
		if (isFunction(vdom)) {
			return mountComponent(vdom, container, oldDom);
		} else {
			return mountSimpleNode(vdom, container, oldDom);
		}
	}

	function isFunction(obj) {
		return obj && 'function' === typeof obj.type;
	}

	function isFunctionalComponent(vnode) {
		let nodeType = vnode && vnode.type;
		return (
			nodeType &&
			isFunction(vnode) &&
			!(nodeType.prototype && nodeType.prototype.render)
		);
	}

	function buildFunctionalComponent(vnode, context) {
		return vnode.type(vnode.props || {});
	}

	function buildStatefulComponent(virtualElement) {
		const component = new virtualElement.type(virtualElement.props);
		const nextElement = component.render(); // new virtual dom

		// This 'component' reference will be needed later
		// for 'diffing/reconciling' stateful component
		// and also to invoke the lifecycle method
		nextElement.component = component;
		return nextElement;
	}

	function mountComponent(vdom, container, oldDomElement) {
		let nextvDom = null,
			component = null,
			newDomElement = null;
		if (isFunctionalComponent(vdom)) {
			nextvDom = buildFunctionalComponent(vdom);
		} else {
			nextvDom = buildStatefulComponent(vdom);
			component = nextvdom.component;
		}

		// Recursively render child components
		if (isFunction(nextvDom)) {
			return mountComponent(nextvDom, container, oldDomElement);
		} else {
			newDomElement = mountElement(nextvDom, container, oldDomElement);
		}

		if (component) {
			// Invoke Lifecycle Method
			component.componentDidMount();

			if (component.props.ref) {
				component.props.ref(component);
			}
		}

		return newDomElement;
	}

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

		// TODO: Remove old nodes
		if (oldDomElement) {
			unmountNode(oldDomElement, parentComponent);
		}

		if (nextSibling) {
			container.insertBefore(newDomElement, nextSibling);
		} else {
			container.appendChild(newDomElement);
		}

		let component = vdom.component;
		if (component) {
			component.setDomElement(newDomElement);
		}

		// TODO: Render Children
		// Magic of recursion happens here
		vdom.children.forEach((child) => {
			mountElement(child, newDomElement);
		});

		if (vdom.props && vdom.props.ref) {
			vdom.props.ref(newDomElement);
		}
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

	class Component {
		constructor(props) {
			// now we're storing these props
			// in the instance of the derived class
			this.props = props;
			this.state = {};
			this.prevState = {};
		}

		setState(nextState) {
			if (!this.prevState) {
				this.prevState = this.state;
			}

			this.state = Object.assign({}, this.state, nextState);

			let dom = this.getDomElement();
			let container = dom.parentNode;

			let newvdom = this.render();

			// Recursively diff
			diff(newvdom, container, dom);
		}

		// Helper Methods
		setDomElement(dom) {
			this._dom = dom;
		}

		getDomElement() {
			return this._dom;
		}

		updateProps(props) {
			this.props = props;
		}

		// Lifecycle methods
		componentWillUnmount() {}
		componentDidMount() {}
		componentWillReceiveProps(nextProps) {}

		shouldComponentUpdate(nextProps, nextState) {
			return nextProps != this.props || nextState != this.state;
		}

		componentWillUpdate(nextProps, nextState) {}
		componentDidUpdate(nextProps, nextState) {}
		componentWillUnmount(nextProps, nextState) {}
	}

	return {
		createElement,
		render,
		Component,
	};
})();
