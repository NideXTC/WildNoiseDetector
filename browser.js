const DecibelMeter = require('decibel-meter');
const {ipcRenderer} = require('electron');
const request = require('request');
const conf = require('./conf.json');

const meter = new DecibelMeter('wildMicro');
const level = document.querySelector('h1');
const maxDisplay = document.querySelector('h2');
let max = 0; 
let readyToNotify = true;
let realDb;



meter.connectTo('default'); 
meter.listen();
meter.on('sample', (dB, percent, value) => {

	realDb = Math.round(dB) + 100;

	// notification 
	if(realDb > conf.maxDb){
		console.log(readyToNotify, conf.secondsBetweenNotifications);
		if(readyToNotify){
			ipcRenderer.send('tooLoud', 'ping');
			readyToNotify = !readyToNotify;
			setTimeout(() => readyToNotify = !readyToNotify, conf.secondsBetweenNotifications * 1000);
		}
	}

	// rendering 
	level.textContent = `${realDb} dB`;
	if(realDb > max) {
		max = realDb;
		maxDisplay.textContent = `Max : ${max} dB`;
	}

}) 