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
        background.src = 'images/' + mapName + '.jpg';
    };
    img.onerror = function() {
        background.src = 'images/gm_bigcity.jpg';
    };
    img.src = 'images/' + mapName + '.jpg';
}

if (urlMap) {
    setBackground(urlMap);
} else {
    background.src = 'images/gm_bigcity.jpg';
}

if (urlSteam) {
    steamIdEl.textContent = 'STEAM ID: ' + urlSteam;
}

function startMusic(vol) {
    if (musicStarted) return;
    musicStarted = true;
    music.volume = 0.3;
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
    startMusic();

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

var _cbMsgs = document.getElementById('_cb_msgs');

var _tips = [
    { user: 'Zukma', msg: 'Si ves a un usuario rompiendo las reglas abrí ticket en discord.' },
    { user: 'hana', msg: 'Si te metés al discord y al steamgroup recibís el rango PLANET' },
    { user: 'Zukma', msg: 'El buildmode se alterna usando los comandos !build y !pvp' },
    { user: 'hana', msg: 'Usar el Buildmode para cualquier cosa que implique molestar es sancionable' },
    { user: 'Zukma', msg: 'Nova fue fundado en el 19/02/24' },
    { user: 'hana', msg: 'Si querés ver la documentación de Nova usá !motd' },
    { user: 'Zukma', msg: 'Lee todas las reglas que están a la derecha de esta pantalla de carga, son pocas.' },
    { user: 'hana', msg: 'Gracias por jugar en Nova' },
    { user: 'hana', msg: 'Unite a nuestro servidor de discord usando !discord' },
];

var _colors = { '(owner) zukma': '#c91515', '(co-owner) hana': '#f9a8d4' };
var _tipIndex = 0;
var _MAX_MSGS = 4;
var _msgEls = [];

function _addMsg(user, text) {
    var wrap = document.createElement('div');
    wrap.className = '_cbm';

    var name = document.createElement('span');
    name.className = '_cbn';
    name.textContent = user;
    name.style.color = _colors[user] || '#ffffff';

    var msg = document.createElement('span');
    msg.className = '_cbt';
    msg.textContent = text;

    wrap.appendChild(name);
    wrap.appendChild(msg);
    _cbMsgs.appendChild(wrap);
    _msgEls.push(wrap);

    if (_msgEls.length > _MAX_MSGS) {
        var old = _msgEls.shift();
        old.style.opacity = '0';
        setTimeout(function() {
            if (old.parentNode) old.parentNode.removeChild(old);
        }, 800);
    }
}

function _nextTip() {
    var t = _tips[_tipIndex % _tips.length];
    _addMsg(t.user, t.msg);
    _tipIndex++;
}

setTimeout(function() {
    _nextTip();
    setInterval(_nextTip, 3000);
}, 1200);
