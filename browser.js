const meter = new DecibelMeter('unique-id');
const level = document.querySelector('h1');
const maxDisplay = document.querySelector('h2');
let max = 0; 
let realDb;

meter.connectTo('default'); 
meter.listen();
meter.on('sample', (dB, percent, value) => {
	realDb = Math.round(dB) + 100;
	level.textContent = `${realDb} dB`;
	if(realDb > max) {
		max = realDb;
		maxDisplay.textContent = `Max : ${max} dB`;
	}
}) 