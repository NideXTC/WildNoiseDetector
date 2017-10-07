'use strict';
const electron = require('electron');
const {ipcMain} = require('electron');

const conf = require('./conf.json');

const app = electron.app;

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 200,
		height: 150,
		titleBarStyle: 'hidden'
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	
	// Connection to RocketChat
});

ipcMain.on('tooLoud', (event, arg) => {
  console.log(conf.rocketchatUsername,conf.rocketchatPassword);
})
