/** @jsx TinyReact.createElement */

/*** step 1,2,3,4 - createElement */

const root = document.getElementById('root');

var step1 = (
	<div>
		<h1 className='header'>Hello Tiny React!</h1>
		<h2>(coding nirvana)</h2>
		<div>
			nested 1<div>nested</div>1.1
		</div>
		<h3>(OBSERVE: This will change)</h3>
		{2 == 1 && <div>Render this if 2==1</div>}
		{2 == 2 && <div>{2}</div>}
		<span>This is a text</span>
		<button onClick={() => alert('Hi')}>Click Me!</button>
		<h3>This will be deleted</h3>
		2,3
	</div>
);

// console.log(step1);

/** Steps 5, 6 */
// TinyReact.render(step1, root);

var step2 = (
	<div>
		<h1 className='header'>Hello Tiny React!</h1>
		<h2>(coding nirvana)</h2>
		<div>
			nested 1<div>nested</div>1.1
		</div>
		<h3 style='background-color: yellow;'>(OBSERVE: I said it!!!)</h3>
		{2 == 1 && <div>Render this if 2==1</div>}
		{2 == 2 && <div>{2}</div>}
		<span>Something goes here...</span>
		<button onClick={() => alert('This has been changed')}>Click Me!</button>
	</div>
);

// setTimeout(() => {
// 	alert('Re-rendering...');
// 	TinyReact.render(step2, root);
// }, 4000);

const Heart = (props) => <span style={props.style}>yoyo&hearts;</span>;

// console.log(Heart);

// TinyReact.render(<Heart style='color:green;' />, root);

const Button = (props) => (
	<button onClick={props.onClick}>{props.children}</button>
);

// Testing functional components, props, nested components
const Greeting = function (props) {
	return (
		<div className='greeting'>
			<h2>Welcome {props.message}</h2>
			<Button onClick={() => alert('I love React!')}>
				I <Heart /> React
			</Button>
		</div>
	);
};

// TinyReact.render(<Greeting message='Good Day!' />, root);

// setTimeout(() => {
// 	alert('Re-rendering...');
// 	TinyReact.render(<Greeting message='Good Night!' />, root);
// }, 4000);

// Stateful component
class Alert extends TinyReact.Component {
	constructor(props) {
		// As we pass props to the super(),
		// these props will be available to the instance of this Alert class
		super(props);
		this.state = {
			title: 'Default Title',
		};

		// Binding the context to the instance of Alert
		this.changeTitle = this.changeTitle.bind(this);
	}

	changeTitle() {
		this.setState({ title: new Date().toString() });
	}

	render() {
		return (
			<div className='alert-container'>
				<h2>{this.state.title}</h2>
				<div>{this.props.message}</div>
				<Button onClick={this.changeTitle}>Change Title</Button>
			</div>
		);
	}
}

// TinyReact.render(<Alert message='Are you sure?' />, root);

// Diffing / Reconciliation of two stateful components
class Stateful extends TinyReact.Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	render() {
		return (
			<div>
				<h2>{this.props.title.toString()}</h2>
				<button onClick={update}>Update</button>
			</div>
		);
	}
}

// TinyReact.render(<Stateful title='Task 1' />, root);

function update() {
	TinyReact.render(<Stateful title={new Date()} />, root);
}

class WishList extends TinyReact.Component {
	constructor(props) {
		super(props);
		this.state = {
			wish: { title: 'Default Wish!' },
		};
		this.update = this.update.bind(this);
	}

	update(e) {
		let newValue = this.inputWishElem.value;
		let wish = Object.assign({}, this.state.wish);
		wish.title = newValue;
		this.setState({
			wish,
		});
	}

	render() {
		return (
			<div>
				<h2>Your wish list</h2>
				<input
					type='text'
					ref={(elem) => {
						this.inputWishElem = elem;
					}}
					placeholder="What's your wish?"
				/>
				<button onClick={this.update}>Update</button>

				<div>
					<b>Wish:</b> {this.state.wish.title}
				</div>
			</div>
		);
	}
}

// TinyReact.render(<WishList />, root);
let newElement = (
	<div>
		<p>One</p>
		<p>Two</p>
	</div>
);

// TinyReact.render(<WishList />, root);
TinyReact.render(newElement, root);

setTimeout(() => {
	alert('Re-rendering...');
	TinyReact.render(<WishList />, root);
	// TinyReact.render(newElement, root);
}, 4000);
