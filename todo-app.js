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

console.log(step1);

/** Steps 5, 6 */
TinyReact.render(step1, root);

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

TinyReact.render(<Greeting message='Good Day!' />, root);

setTimeout(() => {
	alert('Re-rendering...');
	TinyReact.render(<Greeting message='Good Night!' />, root);
}, 4000);
