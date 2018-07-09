const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow

const createWindow = () => {
	mainWindow = new BrowserWindow({width: 800, height: 600})

	mainWindow.loadURL('http://localhost:3000/');

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

