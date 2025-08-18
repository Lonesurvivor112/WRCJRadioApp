# wrcjradioapp.netlify.app
# OG Script Credits to https://github.com/joeyboli/RadioPlayer
# Fully Modified script to play WRCJ Radio, Report current artist and title, Album cover (Using Deezer)
# Custom Built Functions to extract yp_currently_playing from status-json.xsl
# yp_currently_playing is pasted into Deezers NO API URL Example: https://api.deezer.com/search?q=%22Franz%20Joseph%20Haydn%20-%20Trumpet%20Concerto%22

# Documentation.

OG Script and Documentation is found HERE [Script.js](https://github.com/joeyboli/html5-shoutcast-icecast-zeno-player/blob/main/js/script.js) file and edit the lines Below.

The Following Below has been changed
```javascript
// RADIO NAME
const RADIO_NAME = 'WRCJ-Radio';

// SELECT ARTWORK PROVIDER, ITUNES, DEEZER & SPOTIFY. eg : spotify 
var API_SERVICE = 'DEEZER'; - no change

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR and any other stream service.
const URL_STREAMING = 'https://wrcj.streamguys1.com/live.aac';

// Change API URL to https://wrcj.streamguys1.com/status-json.xsl

// Custom Built function to pull from .xsl


// Reports on HTML Page from .xsl

// Recent Tracks

//API URL GET API On Joeycast Website --XXXNOT USEDXXX
const API_URL = 'https://api-v2.streamafrica.net/icyv2?url=' + URL_STREAMING;
//XXX

// Custom Functions to handle .xsl
 ```

## StreamAfrica's RadioAPI

[https://radioapi.me](https://radioapi.me/)

## Free Hosting
Deployed Using Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/joeyboli/RadioPlayer/)

 ## Change Logo.
 Open The img folder and add your logo named "cover.png"
 ## Change Background
 Open The img folder and add your background with the name "bg_site.jpg"

 
## Demo Screenshots
![Demo Screenshot](Uploading Soon)


## Supported Hosting Types
* Icecast / Shoutcast
* Zeno Radio
* RadioJar
* Azuracast
* Centova Cast
* Everest Cast
* MediaCP
* Sonic Panel
  
## Supported API/Data Sources
* Apple Music / Itunes
* Deezer
* Spotify


# JCPlayer Pro


## License

[MIT](https://github.com/gsavio/player-shoutcast-html5/blob/master/LICENSE)

## Credits
* [gsavio/player-shoutcast-html5](https://github.com/gsavio/player-shoutcast-html5)
* [Streamafrica's RadioAPI](https://api.streamafrica.net/)


