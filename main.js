var menubar = require('menubar')
var electron = require('electron');
var path = require('path');
var spotify = require('spotify-node-applescript');
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
  ipcMain.on('quit', function(){
    mb.app.quit()
  });
})

mb.on('after-create-window', function(){
    //mb.window.openDevTools()

    spotify.getTrack(function(err, track){
      if(track){
        var currentTrack = {};
        currentTrack['Track ID'] = track.id;
        currentTrack['Name'] = track.name;
        currentTrack['Artist'] = track.artist;
        currentTrack['Album'] = track.album;
        mb.window.webContents.send('playbackStateChanged', currentTrack);
      }
    }); 

    systemPreferences.subscribeNotification('com.spotify.client.PlaybackStateChanged', function(event, userInfo){
      mb.window.webContents.send('playbackStateChanged', userInfo);
    });
});
