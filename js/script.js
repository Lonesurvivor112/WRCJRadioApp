const RADIO_NAME = 'WRCJ Radio';

// SELECT ARTWORK PROVIDER, ITUNES, DEEZER & SPOTIFY  eg : spotify 
var API_SERVICE = 'deezer';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR ETC.... DOES NOT SUPPORT HLS
const URL_STREAMING = 'https://wrcj.streamguys1.com/live.aac';

//NOW PLAYING API.
const API_URL = 'https://wrcj.streamguys1.com/status-json.xsl';

window.onload = function () {
    var page = new Page;
    page.changeTitlePage();
    page.setVolume();
    window.addEventListener("load", showDeezerCoverArt);
    showDeezerCoverArt();

    var player = new Player();
    player.play();

    getStreamingData();
    // Interval to get streaming data in miliseconds
    setInterval(function () {
        showDeezerCoverArt();
        getStreamingData();
    }, 10000);

    var coverArt = document.getElementsByClassName('cover-album')[0];

    coverArt.style.height = coverArt.offsetWidth + 'px';
}

// DOM control
function Page() {
    this.changeTitlePage = function (title = RADIO_NAME) {
        document.title = title;
    };

    this.refreshCurrentSong = function (song, artist) {
        var currentSong = document.getElementById('currentSong');
        var currentArtist = document.getElementById('currentArtist');

        if (song !== currentSong.innerHTML) {
            // Animate transition
            currentSong.className = 'animated flipInY text-uppercase';
            currentSong.innerHTML = song;

            currentArtist.className = 'animated flipInY text-capitalize';
            currentArtist.innerHTML = artist;

            // Remove animation classes
            setTimeout(function () {
                currentSong.className = 'text-uppercase';
                currentArtist.className = 'text-capitalize';
            }, 2000);
        }
    }

    this.refreshHistoric = function (info, n) {
        var $historicDiv = document.querySelectorAll('#historicSong article');
        var $songName = document.querySelectorAll('#historicSong article .music-info .song');
        var $artistName = document.querySelectorAll('#historicSong article .music-info .artist');

        // Default cover art
        var urlCoverArt = 'img/cover.png';

        // Get cover art for song history
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var artwork = data.results.artwork;
                 var artworkXL = artwork.large;

                document.querySelectorAll('#historicSong article .cover-historic')[n].style.backgroundImage = 'url(' + artworkXL + ')';
            }
            // Formating characters to UTF-8
            var music = info.song.replace(/&apos;/g, '\'');
            var songHist = music.replace(/&amp;/g, '&');

            var artist = info.artist.replace(/&apos;/g, '\'');
            var artistHist = artist.replace(/&amp;/g, '&');

            $songName[n].innerHTML = songHist;
            $artistName[n].innerHTML = artistHist;

            // Add class for animation
            $historicDiv[n].classList.add('animated');
            $historicDiv[n].classList.add('slideInRight');
        }
        xhttp.open('GET', 'https://wrcj.streamguys1.com/status-json.xsl' + info.artist + ' ' + info.song);
        xhttp.send();

        setTimeout(function () {
            for (var j = 0; j < 2; j++) {
                $historicDiv[j].classList.remove('animated');
                $historicDiv[j].classList.remove('slideInRight');
            }
        }, 2000);
    }

    this.refreshCover = function (song = '', artist) {
        // Default cover art
        var urlCoverArt = 'img/cover.png';

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var coverArt = document.getElementById('currentCoverArt');
            var coverBackground = document.getElementById('bgCover');

            // Get cover art URL on iTunes API
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                var artworkUrl100 = data.results;
                var urlCoverArt = artworkUrl100.artwork.medium;

                coverArt.style.backgroundImage = 'url(' + urlCoverArt + ')';
                coverArt.className = 'animated bounceInLeft';

                coverBackground.style.backgroundImage = 'url(' + urlCoverArt + ')';

                setTimeout(function () {
                    coverArt.className = '';
                }, 2000);

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song,
                        artist: artist,
                        artwork: [{
                                src: urlCoverArt,
                                sizes: '96x96',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '128x128',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '192x192',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '256x256',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '384x384',
                                type: 'image/png'
                            },
                            {
                                src: urlCoverArt,
                                sizes: '512x512',
                                type: 'image/png'
                            }
                        ]
                    });
                }
            }
        }
        xhttp.open('GET', 'https://prod-api.radioapi.me/1ceb9727-3e36-4e64-99e7-f776b50c7f4f/musicsearch?query=' + artist + ' ' + song);
        xhttp.send();
    }

    this.changeVolumeIndicator = function (volume) {
        document.getElementById('volIndicator').innerHTML = volume;

        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('volume', volume);
        }
    }

    this.setVolume = function () {
        if (typeof (Storage) !== 'undefined') {
            var volumeLocalStorage = (!localStorage.getItem('volume')) ? 80 : localStorage.getItem('volume');
            document.getElementById('volume').value = volumeLocalStorage;
            document.getElementById('volIndicator').innerHTML = volumeLocalStorage;
        }
    }
}

var audio = new Audio(URL_STREAMING);

// Player control
function Player() {
    this.play = function () {
        audio.play();

        var defaultVolume = document.getElementById('volume').value;

        if (typeof (Storage) !== 'undefined') {
            if (localStorage.getItem('volume') !== null) {
                audio.volume = intToDecimal(localStorage.getItem('volume'));
            } else {
                audio.volume = intToDecimal(defaultVolume);
            }
        } else {
            audio.volume = intToDecimal(defaultVolume);
        }
        document.getElementById('volIndicator').innerHTML = defaultVolume;
    };

    this.pause = function () {
        audio.pause();
    };
}

// On play, change the button to pause
audio.onplay = function () {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    if (botao.className === 'fa fa-play') {
        botao.className = 'fa fa-pause';
        bplay.firstChild.data = 'PAUSE';
    }
}

// On pause, change the button to play
audio.onpause = function () {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    if (botao.className === 'fa fa-pause') {
        botao.className = 'fa fa-play';
        bplay.firstChild.data = 'PLAY';
    }
}

// Unmute when volume changed
audio.onvolumechange = function () {
    if (audio.volume > 0) {
        audio.muted = false;
    }
}

audio.onerror = function () {
    var confirmacao = confirm('Stream Down / Network Error. \nClick OK to try again.');

    if (confirmacao) {
        window.location.reload();
    }
}

document.getElementById('volume').oninput = function () {
    audio.volume = intToDecimal(this.value);

    var page = new Page();
    page.changeVolumeIndicator(this.value);
}

function togglePlay() {
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.load();
        audio.play();
    }
}

function volumeUp() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0 && audio.volume < 1) {
            audio.volume = (vol + .01).toFixed(2);
        }
    }
}

function volumeDown() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0.01 && audio.volume <= 1) {
            audio.volume = (vol - .01).toFixed(2);
        }
    }
}

function mute() {
    if (!audio.muted) {
        document.getElementById('volIndicator').innerHTML = 0;
        document.getElementById('volume').value = 0;
        audio.volume = 0;
        audio.muted = true;
    } else {
        var localVolume = localStorage.getItem('volume');
        document.getElementById('volIndicator').innerHTML = localVolume;
        document.getElementById('volume').value = localVolume;
        audio.volume = intToDecimal(localVolume);
        audio.muted = false;
    }
}

function getStreamingData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.response.length === 0) {
                console.log('%cdebug', 'font-size: 22px');
            }

            var data = JSON.parse(this.responseText);
            console.log('Received data:', data);

            var page = new Page();

            // Formating characters to UTF-8
            let song = data.song ? data.song.replace(/&apos;/g, '\'') : '';
            let artist = data.artist ? data.artist.replace(/&apos;/g, '\'') : '';

            // Change the title
            document.title = song + ' - ' + artist + ' | ' + RADIO_NAME;

            if (document.getElementById('currentSong').innerHTML !== song) {
                page.refreshCover(song, artist);
                page.refreshCurrentSong(song, artist);

                for (var i = 0; i < 2; i++) {
                    page.refreshHistoric(data.history[i], i);
                }
            }
        }
    };

    var d = new Date();

    // Requisition with timestamp to prevent cache on mobile devices
    xhttp.open('GET', API_URL);
    xhttp.send();
}

// Player control by keys
document.addEventListener('keydown', function (k) {
    var k = k || window.event;
    var key = k.keyCode || k.which;
    
    var slideVolume = document.getElementById('volume');

    var page = new Page();

    switch (key) {
        // Arrow up
        case 38:
            volumeUp();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Arrow down
        case 40:
            volumeDown();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Spacebar
        case 32:
            togglePlay();
            break;
        // P
        case 80:
            togglePlay();
            break;
        // M
        case 77:
            mute();
            break;
        // 0
        case 48:
            audio.volume = 0;
            slideVolume.value = 0;
            page.changeVolumeIndicator(0);
            break;
        // 0 numeric keyboard
        case 96:
            audio.volume = 0;
            slideVolume.value = 0;
            page.changeVolumeIndicator(0);
            break;
        // 1
        case 49:
            audio.volume = .1;
            slideVolume.value = 10;
            page.changeVolumeIndicator(10);
            break;
        // 1 numeric key
        case 97:
            audio.volume = .1;
            slideVolume.value = 10;
            page.changeVolumeIndicator(10);
            break;
        // 2
        case 50:
            audio.volume = .2;
            slideVolume.value = 20;
            page.changeVolumeIndicator(20);
            break;
        // 2 numeric key
        case 98:
            audio.volume = .2;
            slideVolume.value = 20;
            page.changeVolumeIndicator(20);
            break;
        // 3
        case 51:
            audio.volume = .3;
            slideVolume.value = 30;
            page.changeVolumeIndicator(30);
            break;
        // 3 numeric key
        case 99:
            audio.volume = .3;
            slideVolume.value = 30;
            page.changeVolumeIndicator(30);
            break;
        // 4
        case 52:
            audio.volume = .4;
            slideVolume.value = 40;
            page.changeVolumeIndicator(40);
            break;
        // 4 numeric key
        case 100:
            audio.volume = .4;
            slideVolume.value = 40;
            page.changeVolumeIndicator(40);
            break;
        // 5
        case 53:
            audio.volume = .5;
            slideVolume.value = 50;
            page.changeVolumeIndicator(50);
            break;
        // 5 numeric key
        case 101:
            audio.volume = .5;
            slideVolume.value = 50;
            page.changeVolumeIndicator(50);
            break;
        // 6 
        case 54:
            audio.volume = .6;
            slideVolume.value = 60;
            page.changeVolumeIndicator(60);
            break;
        // 6 numeric key
        case 102:
            audio.volume = .6;
            slideVolume.value = 60;
            page.changeVolumeIndicator(60);
            break;
        // 7
        case 55:
            audio.volume = .7;
            slideVolume.value = 70;
            page.changeVolumeIndicator(70);
            break;
        // 7 numeric key
        case 103:
            audio.volume = .7;
            slideVolume.value = 70;
            page.changeVolumeIndicator(70);
            break;
        // 8
        case 56:
            audio.volume = .8;
            slideVolume.value = 80;
            page.changeVolumeIndicator(80);
            break;
        // 8 numeric key
        case 104:
            audio.volume = .8;
            slideVolume.value = 80;
            page.changeVolumeIndicator(80);
            break;
        // 9
        case 57:
            audio.volume = .9;
            slideVolume.value = 90;
            page.changeVolumeIndicator(90);
            break;
        // 9 numeric key
        case 105:
            audio.volume = .9;
            slideVolume.value = 90;
            page.changeVolumeIndicator(90);
            break;
    }
});

function intToDecimal(vol) {
    return vol / 100;
}

function decimalToInt(vol) {
    return vol * 100;
}

let recentTracks = [];

function loadRecentTracks() {
    const stored = localStorage.getItem("recentTracks");
    if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        // Filter out tracks older than 7 days
        recentTracks = parsed.filter(item => now - item.timestamp < 7 * 24 * 60 * 60 * 1000);
        updateRecentTracksUI();
    }
}

function saveRecentTracks() {
    localStorage.setItem("recentTracks", JSON.stringify(recentTracks));
}

function updateNowPlaying() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            try {
                var data = JSON.parse(this.responseText);
                let source = data.icestats.source;
                let currentlyPlaying = Array.isArray(source)
                    ? source[0].yp_currently_playing
                    : source.yp_currently_playing;

                if (!currentlyPlaying) return;

                document.getElementById("customNowPlaying").innerText = currentlyPlaying;

                // Check if this might be classical music and get additional info
                getClassicalInfo(currentlyPlaying);

                if (recentTracks.length === 0 || recentTracks[0].track !== currentlyPlaying) {
                    recentTracks.unshift({
                        track: currentlyPlaying,
                        timestamp: Date.now()
                    });
                    if (recentTracks.length > 5) recentTracks.pop();
                    saveRecentTracks();
                    updateRecentTracksUI();
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                document.getElementById("customNowPlaying").innerText = "Error loading track info.";
            }
        }
    };
    xhttp.open("GET", "https://wrcj.streamguys1.com/status-json.xsl", true);
    xhttp.send();
}

function updateRecentTracksUI() {
    const list = document.getElementById("recentTracksList");
    list.innerHTML = "";

    recentTracks.slice(1).forEach(item => {
        const li = document.createElement("li");

        const timeAgo = getTimeAgo(item.timestamp);
        li.textContent = `${item.track} (${timeAgo})`;

        list.appendChild(li);
    });
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `just now`;
}

function showDeezerCoverArt() {
    const streamUrl = "https://wrcj.streamguys1.com/status-json.xsl";

    fetch(streamUrl)
        .then(response => response.json())
        .then(data => {
            let source = data.icestats.source;
            let currentlyPlaying = Array.isArray(source)
                ? source[0].yp_currently_playing
                : source.yp_currently_playing;

            if (!currentlyPlaying) return;

            const query = encodeURIComponent(currentlyPlaying);
            const deezerUrl = `https://api.deezer.com/search?q=${query}`;
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(deezerUrl)}`;

            fetch(proxyUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.data && data.data.length > 0) {
                        const existingOverlay = document.getElementById('deezerOverlay');
                        if (existingOverlay) existingOverlay.remove();
                        const albumCover = data.data[0].album.cover_medium;
                        const target = document.getElementById("currentCoverArt");
                        if (!target) return;

                        const rect = target.getBoundingClientRect();
                        const img = document.createElement("img");
                        img.id = 'deezerOverlay';
                        img.src = albumCover;
                        img.style.position = "absolute";
                        img.style.top = `${rect.top + window.scrollY}px`;
                        img.style.left = `${rect.left + window.scrollX}px`;
                        img.style.width = `${rect.width}px`;
                        img.style.height = `${rect.height}px`;
                        img.style.border = "none";
                        img.style.borderRadius = "8px";
                        img.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                        img.style.zIndex = 9999;
                        img.style.pointerEvents = "none";

                        document.body.appendChild(img);
                    } else {
                        console.log("No album art found for:", currentlyPlaying);
                    }
                })
                .catch(error => {
                    console.error("Error fetching album art from Deezer:", error);
                });
        })
        .catch(error => {
            console.error("Error fetching stream metadata:", error);
        });
}

// Load from localStorage on page load
loadRecentTracks();
updateNowPlaying();
setInterval(updateNowPlaying, 30000);

// Classical Music Information Functions
function getClassicalInfo(trackName) {
    // Show the classical info box
    document.getElementById('classicalInfo').style.display = 'block';
    
    // Reset fields
    document.getElementById('composer').textContent = 'Searching...';
    document.getElementById('era').textContent = 'Searching...';
    document.getElementById('compositionYear').textContent = 'Searching...';
    document.getElementById('description').textContent = 'Loading classical information...';
    
    // Try to parse classical music format (WRCJ uses: Composer - Title)
    const classicalPattern = /^(.+?)\s*-\s*(.+)$/;
    const match = trackName.match(classicalPattern);
    
    if (match) {
        const composerName = match[1].trim();
        const workTitle = match[2].trim();
        
        // Try multiple data sources
        tryMusicBrainz(composerName, workTitle)
            .then(result => {
                if (result) {
                    updateClassicalDisplay(result);
                } else {
                    return tryWikidata(composerName, workTitle);
                }
            })
            .then(result => {
                if (result) {
                    updateClassicalDisplay(result);
                } else {
                    return tryOpenOpus(composerName, workTitle);
                }
            })
            .then(result => {
                if (result) {
                    updateClassicalDisplay(result);
                } else {
                    showFallbackInfo(composerName, workTitle);
                }
            })
            .catch(error => {
                console.error('Error fetching classical info:', error);
                showFallbackInfo(composerName, workTitle);
            });
    } else {
        // Try to detect if it might still be classical
        if (isLikelyClassical(trackName)) {
            tryGeneralClassicalSearch(trackName);
        } else {
            // Hide classical info for non-classical tracks
            document.getElementById('classicalInfo').style.display = 'none';
        }
    }
}

function tryMusicBrainz(composer, work) {
    const query = encodeURIComponent(`${composer} ${work}`);
    const url = `https://musicbrainz.org/ws/2/work?query=${query}&fmt=json&limit=1`;
    
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.works && data.works.length > 0) {
                const work = data.works[0];
                return {
                    composer: composer,
                    era: guessEraFromComposer(composer),
                    year: extractYear(work),
                    description: `${work.title} - A classical composition by ${composer}.`
                };
            }
            return null;
        })
        .catch(() => null);
}

function tryWikidata(composer, work) {
    // This is a simplified approach - in practice, Wikidata queries are more complex
    return new Promise((resolve) => {
        // Fallback to era guessing
        const era = guessEraFromComposer(composer);
        if (era !== 'Unknown') {
            resolve({
                composer: composer,
                era: era,
                year: guessYearFromEra(era),
                description: `A ${era.toLowerCase()} composition by ${composer}.`
            });
        } else {
            resolve(null);
        }
    });
}

function tryOpenOpus(composer, work) {
    // OpenOpus API for classical music (if available)
    return fetch(`https://api.openopus.org/work/list/composer/${encodeURIComponent(composer)}.json`)
        .then(response => response.json())
        .then(data => {
            if (data.works && data.works.length > 0) {
                const matchingWork = data.works.find(w => 
                    w.title.toLowerCase().includes(work.toLowerCase().substring(0, 20))
                );
                if (matchingWork) {
                    return {
                        composer: composer,
                        era: data.composer?.epoch || guessEraFromComposer(composer),
                        year: matchingWork.year || 'Unknown',
                        description: `${matchingWork.title} by ${composer}.`
                    };
                }
            }
            return null;
        })
        .catch(() => null);
}

function isLikelyClassical(trackName) {
    const classicalKeywords = [
        'symphony', 'concerto', 'sonata', 'quartet', 'quintet', 'opus', 'op.', 'op6',
        'movement', 'allegro', 'andante', 'adagio', 'presto', 'largo', 'vivace',
        'bach', 'mozart', 'beethoven', 'chopin', 'brahms', 'tchaikovsky', 
        'vivaldi', 'handel', 'haydn', 'schubert', 'liszt', 'debussy', 'ravel',
        'concerto grosso', 'brandenburg', 'partita', 'prelude', 'fugue', 'suite',
        'no.', 'bwv', 'k.', 'hob', 'woo'
    ];
    
    const trackLower = trackName.toLowerCase();
    return classicalKeywords.some(keyword => trackLower.includes(keyword));
}

function guessEraFromComposer(composer) {
    const composerLower = composer.toLowerCase();
    
    // Baroque (1600-1750)
    if (composerLower.includes('bach') || composerLower.includes('vivaldi') || 
        composerLower.includes('handel') || composerLower.includes('scarlatti') ||
        composerLower.includes('purcell') || composerLower.includes('corelli') ||
        composerLower.includes('telemann') || composerLower.includes('rameau')) {
        return 'Baroque';
    }
    
    // Classical (1750-1820)
    if (composerLower.includes('mozart') || composerLower.includes('haydn') || 
        composerLower.includes('clementi') || composerLower.includes('boccherini') ||
        composerLower.includes('salieri') || composerLower.includes('early beethoven')) {
        return 'Classical';
    }
    
    // Romantic (1820-1900)
    if (composerLower.includes('beethoven') || composerLower.includes('chopin') || 
        composerLower.includes('brahms') || composerLower.includes('tchaikovsky') ||
        composerLower.includes('liszt') || composerLower.includes('schumann') ||
        composerLower.includes('mendelssohn') || composerLower.includes('wagner') ||
        composerLower.includes('verdi') || composerLower.includes('dvorak') ||
        composerLower.includes('grieg') || composerLower.includes('rachmaninoff')) {
        return 'Romantic';
    }
    
    // Impressionist (1890-1930)
    if (composerLower.includes('debussy') || composerLower.includes('ravel') ||
        composerLower.includes('satie') || composerLower.includes('faure')) {
        return 'Impressionist';
    }
    
    // Modern/Contemporary (1900+)
    if (composerLower.includes('stravinsky') || composerLower.includes('bartok') ||
        composerLower.includes('schoenberg') || composerLower.includes('berg') ||
        composerLower.includes('webern') || composerLower.includes('copland') ||
        composerLower.includes('ives') || composerLower.includes('cage') ||
        composerLower.includes('glass') || composerLower.includes('reich') ||
        composerLower.includes('adams') || composerLower.includes('part') ||
        composerLower.includes('hawes') || composerLower.includes('pärt')) {
        return 'Contemporary';
    }
    
    return 'Unknown';
}

function guessYearFromEra(era) {
    const eras = {
        'Baroque': '1600-1750',
        'Classical': '1750-1820', 
        'Romantic': '1820-1900',
        'Impressionist': '1890-1930',
        'Contemporary': '1900-present',
        'Modern': '1900-present'
    };
    return eras[era] || 'Unknown';
}

function extractYear(work) {
    // Try to extract year from work data
    if (work.disambiguation) {
        const yearMatch = work.disambiguation.match(/(\d{4})/);
        if (yearMatch) return yearMatch[1];
    }
    return 'Unknown';
}

function tryGeneralClassicalSearch(trackName) {
    // For tracks that seem classical but don't match composer:title format
    document.getElementById('composer').textContent = 'Detecting...';
    document.getElementById('era').textContent = 'Unknown';
    document.getElementById('compositionYear').textContent = 'Unknown';
    document.getElementById('description').textContent = 'This appears to be a classical piece. More specific information may be available when the format includes the composer name.';
}

function showFallbackInfo(composer, work) {
    const era = guessEraFromComposer(composer);
    const yearRange = guessYearFromEra(era);
    
    // Create more detailed descriptions based on the work type
    let description = `${work} by ${composer}.`;
    
    // Check if we have meaningful era information
    if (era === 'Unknown' || yearRange === 'Unknown') {
        description += ` There are unknown details about this piece.`;
    } else {
        // Add work-specific information only if we have era info
        if (work.toLowerCase().includes('concerto grosso')) {
            description += ` A concerto grosso is a form of baroque concerto featuring a small group of soloists (concertino) against a full orchestra (ripieno). `;
        } else if (work.toLowerCase().includes('concerto')) {
            description += ` A concerto featuring solo instrument(s) accompanied by orchestra. `;
        } else if (work.toLowerCase().includes('symphony')) {
            description += ` A large-scale orchestral composition typically in multiple movements. `;
        } else if (work.toLowerCase().includes('sonata')) {
            description += ` A musical composition typically for a solo instrument or instrument with piano accompaniment. `;
        } else if (work.toLowerCase().includes('reflexion') || work.toLowerCase().includes('reflection')) {
            description += ` A contemplative musical piece, often featuring introspective and meditative qualities. `;
        } else if (work.toLowerCase().includes('prelude')) {
            description += ` An introductory piece of music, often serving as an opening to a larger work. `;
        } else if (work.toLowerCase().includes('etude')) {
            description += ` A study or exercise piece designed to develop particular technical skills. `;
        }
        
        description += `This ${era.toLowerCase()} composition showcases the musical style and characteristics typical of the ${era} period (${yearRange}).`;
    }
    
    document.getElementById('composer').textContent = composer;
    document.getElementById('era').textContent = era;
    document.getElementById('compositionYear').textContent = yearRange;
    document.getElementById('description').textContent = description;
}

function updateClassicalDisplay(info) {
    document.getElementById('composer').textContent = info.composer;
    document.getElementById('era').textContent = info.era;
    document.getElementById('compositionYear').textContent = info.year;
    document.getElementById('description').textContent = info.description;
}
