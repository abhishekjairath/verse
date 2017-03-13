var {ipcRenderer, shell} = require('electron');
var request = require('request');
var cheerio = require('cheerio');

var currentTrack = null;

function getLyrics(song, artist, cb){
    var url = 'https://genius.com/'
    artist = makeName(artist);
    song = makeName(song);
    var final = url+artist+'-'+song+'-lyrics';
    request.get(final, function(err, response, body){
        if(err || response.statusCode != 200){
            return cb(null, null);
        }
        else{
            var $ = cheerio.load(body);
            var lyrics = $('lyrics').text();
            var albumArt = $('img', '.song_album-album_art').attr('src');
            return cb(lyrics, albumArt);
        }
    });

};

function makeName(name){
    if(name) return name.replace(/[ /]/g,'-').replace(/[,.']/g,'');
    else return '';
}

function quitApp(){
    ipcRenderer.send('quit');
};

function openBrowser(){
    shell.openExternal('https://genius.com');
}

ipcRenderer.on('playbackStateChanged', (event, arg) => {  
    if(currentTrack == null || currentTrack['Track ID'] != arg['Track ID']){
        currentTrack = arg;
        
        document.getElementById('lyrics').style.display = 'none';
        document.getElementById('lyrics-loader').style.display = 'inline-block';        
        document.getElementById('name').innerText = currentTrack['Name'];
        document.getElementById('artist').innerText = currentTrack['Artist']; 
        document.getElementById('album').innerText = currentTrack['Album'];
        document.getElementById('footer').style.position = 'fixed';

        getLyrics(currentTrack['Name'], currentTrack['Artist'], function(lyrics, albumArt){
            document.getElementById('lyrics').innerText = lyrics ? lyrics : '\n\rOops, lyrics not found.';
            document.getElementById('track-album-art-image').setAttribute('src', albumArt ? albumArt : './assets/default-album-art.png');
            document.getElementById('lyrics-loader').style.display = 'none';        
            document.getElementById('lyrics').style.display = 'block';
            if(lyrics){
                document.getElementById('footer').style.position = 'relative';     
            }
        }); 
    }    
});
