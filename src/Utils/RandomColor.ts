const colorSchemes = [
	'red',
	'orange',
	'yellow',
	'green',
	'teal',
	'blue',
	'cyan',
	'pink',
];

const randomColor = () => {
	return colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
};

export default randomColor;
