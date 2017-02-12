var menubar = require('menubar')
var electron = require('electron');
var path = require('path');
var ipcMain = electron.ipcMain;
var systemPreferences = electron.systemPreferences;

var mb = menubar({
  'node-integration': true,
  'height': 400,
  'width': 350,
  'transparent': true,
  'vibrancy': 'ultra-dark',
  'preloadWindow': true,
  'resizable': false
});

var track = {};

mb.on('ready', function ready () {
  console.log('app is ready')
})

mb.on('after-create-window', function(){
    mb.window.openDevTools() 
    systemPreferences.subscribeNotification('com.spotify.client.PlaybackStateChanged', function(event, userInfo){
      mb.window.webContents.send('playbackStateChanged', userInfo);
    });
});
