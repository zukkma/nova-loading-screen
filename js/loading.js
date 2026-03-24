var fill = document.getElementById('_pf');
var fileList = document.getElementById('_fl');
var music = document.getElementById('music');
var steamIdEl = document.getElementById('_si');
var background = document.getElementById('_bg');

var total = 0;
var needed = 0;
var MAX_ENTRIES = 6;
var entries = [];
var musicStarted = false;

var params = new URLSearchParams(window.location.search);
var urlMap = params.get('Map') || params.get('map') || '';
var urlSteam = params.get('SteamId') || params.get('steamid') || '';

function setBackground(mapName) {
    var img = new Image();
    img.onload = function() {
        background.style.backgroundImage = 'url(images/' + mapName + '.jpg)';
    };
    img.onerror = function() {
        background.style.backgroundImage = 'url(images/gm_bigcity.jpg)';
    };
    img.src = 'images/' + mapName + '.jpg';
}

if (urlMap) {
    setBackground(urlMap);
} else {
    background.style.backgroundImage = 'url(images/gm_bigcity.jpg)';
}

if (urlSteam) {
    steamIdEl.textContent = 'STEAM ID: ' + urlSteam;
}

function startMusic(vol) {
    if (musicStarted) return;
    musicStarted = true;
    music.volume = (vol !== undefined) ? vol : 0.3;
    music.play();
}

function addEntry(text) {
    var el = document.createElement('div');
    el.className = '_fe _nw';
    el.textContent = text;
    fileList.insertBefore(el, fileList.firstChild);
    entries.unshift(el);
    if (entries.length > MAX_ENTRIES) {
        var removed = entries.pop();
        fileList.removeChild(removed);
    }
    void el.offsetWidth;
    updateOpacities();
}

function updateOpacities() {
    var count = entries.length;
    for (var i = 0; i < count; i++) {
        var opacity = 1 - (i / (MAX_ENTRIES - 1)) * 0.85;
        entries[i].style.opacity = opacity;
        if (i > 0) entries[i].classList.remove('_nw');
    }
}

var pages = document.querySelectorAll('._rg');
var dots = document.querySelectorAll('._dt');
var currentPage = 0;

function switchPage() {
    var outPage = pages[currentPage];
    currentPage = (currentPage + 1) % pages.length;
    var inPage = pages[currentPage];

    outPage.style.transition = 'opacity 0.5s ease';
    outPage.style.opacity = '0';

    setTimeout(function() {
        outPage.classList.remove('_ac');
        outPage.style.display = 'none';
        outPage.style.opacity = '';
        outPage.style.transition = '';

        inPage.style.display = 'flex';
        inPage.style.opacity = '0';
        inPage.style.transition = 'none';

        void inPage.offsetWidth;

        inPage.style.transition = 'opacity 0.5s ease';
        inPage.style.opacity = '1';
        inPage.classList.add('_ac');

        dots.forEach(function(d, i) {
            d.classList.toggle('active', i===currentPage);
        });

        setTimeout(function() {
            inPage.style.transition = '';
            inPage.style.opacity = '';
        }, 500);

    }, 500);
}

setInterval(switchPage, 5000);

window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gameMode, volume, language) {
    startMusic(volume);

    if (steamID) {
        steamIdEl.textContent = 'STEAM ID: ' + steamID;
    }

    if (mapName) {
        setBackground(mapName);
        addEntry(mapName);
    }
};

window.SetFilesTotal = function(t) {
    total = t;
};

window.SetFilesNeeded = function(n) {
    needed = n;
    if (total > 0) {
        fill.style.width = ((total - needed) / total * 100) + '%';
    }
};

window.DownloadingFile = function(fileName) {
    var parts = fileName.split('/');
    addEntry(parts[parts.length - 1]);
};

window.SetStatusChanged = function(s) {
    addEntry(s);
    if (s === 'Sending client info...' || s === 'Joining game...') {
        fill.style.width = '100%';
    }
};