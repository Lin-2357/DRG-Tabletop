var pc = [1, 2, 3];
var npc = [10, 11, 12, 13, 14];
var randmax = 1000;
var period = 10;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function distance(a, b) {
    return Math.max(b[0] - a[0], b[1] - a[1], a[0] - b[0], a[1] - b[1]);
}
var ore = ['gold', 'nitra', 'morkite', 'egg', 'corestone', 'jade', 'bismor', 'pearl', 'croppa', 'magnite', 'araq'];
var cavegen = new Map();
cavegen.set(-10, 'drop pod');
for (var i = 0; i < randmax; i++) {
    if (i < 500) {
        cavegen.set(i, 'floor');
    }
    else if (i < 700) {
        cavegen.set(i, 'wall');
    }
    else if (i < 900) {
        cavegen.set(i, 'hole');
    }
    else if (i < 930) {
        cavegen.set(i, 'gold');
    }
    else if (i < 950) {
        cavegen.set(i, 'nitra');
    }
    else if (i < 960) {
        cavegen.set(i, 'morkite');
    }
    else if (i < 980) {
        cavegen.set(i, ore[getRandomInt(ore.length - 2) + 2]);
    }
    else {
        cavegen.set(i, 'wall');
    }
}
var monsterspawnmap = new Map();
for (var i = 0; i < randmax; i++) {
    if (i < 970) {
        monsterspawnmap.set(i, 0);
    }
    else if (i < 980) {
        monsterspawnmap.set(i, 10);
    }
    else if (i < 985) {
        monsterspawnmap.set(i, 11);
    }
    else if (i < 990) {
        monsterspawnmap.set(i, 12);
    }
    else if (i < 997) {
        monsterspawnmap.set(i, 13);
    }
    else if (i < 1000) {
        monsterspawnmap.set(i, 14);
    }
    else {
        monsterspawnmap.set(i, 0);
    }
}
var creaturegen = new Map();
var playerlist = ['scout', 'driller', 'gunner'];
for (var i = 0; i < pc.length; i++) {
    creaturegen.set(i + 1, playerlist[i]);
}
var monsterlist = ['grunt', 'acid spitter', 'web spitter', 'exploder', 'praetorian', 'guard', 'oppressor'];
var defaultnpcHP = [1, 1, 1, 1, 2, 2, 5];
var rangeMonster = [1, 4, 3, 1, 2, 1, 1];
var speedNPC = [3, 3, 3, 3, 3, 3, 3];
var armorNPC = [1, 0, 0, 0, 1, 1, 2];
var criteffect = ["none", 'none', 'slowed', 'burned', 'poisoned', 'bleed', 'none'];
for (var i = 0; i < npc.length; i++) {
    creaturegen.set(i + 10, monsterlist[i]);
}
var colormap = new Map();
colormap.set('wall', '#443322');
colormap.set('hole', '#111111');
colormap.set('floor', '#444444');
colormap.set('drop pod', '#444466');
var mapimage = new Map();
for (var x in ore) {
    mapimage.set(ore[x], './assets/' + ore[x] + '.png');
    colormap.set(ore[x], colormap.get('wall'));
}
var creaturemap = new Map();
creaturemap.set('scout', '#000044');
creaturemap.set('driller', '#443300');
creaturemap.set('gunner', '#224433');
var creatureimage = new Map();
creatureimage.set('scout', './assets/scout.png');
creatureimage.set('driller', './assets/driller.png');
creatureimage.set('gunner', './assets/gunner.png');
for (var i = 0; i < npc.length; i++) {
    creaturemap.set(monsterlist[i], '#444422');
    creatureimage.set(monsterlist[i], './assets/' + monsterlist[i] + '.png');
}
var gridsize = 25;
var base_vision = 5;
const testelem = document.createElement("div");
testelem.innerHTML = "hiiii"