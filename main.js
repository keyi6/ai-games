const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({width: 800, height: 465});

	mainWindow.loadURL('http://cjhahaha.github.io/ai-games/');

	mainWindow.on('closed', function () {
		mainWindow = null
	})
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('activate', () => {
	if (mainWindow === null)
		createWindow();
});

