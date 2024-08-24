"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
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
var Demo = /** @class */ (function (_super) {
    __extends(Demo, _super);
    function Demo(props) {
        var _this = _super.call(this, props) || this;
        if (true) {
            _this.state = {
                grid: Array.from({ length: gridsize + 2 }, function (_, i) { return Array.from({ length: gridsize + 2 }, function (_, j) { return (j === 0 || i === 0 || j === gridsize + 1 || i === gridsize + 1 ? 600 : getRandomInt(randmax)); }); }),
                creature: Array.from({ length: gridsize + 2 }, function (_, i) { return Array.from({ length: gridsize + 2 }, function (_, j) { return 0; }); }),
                control: 1,
                players: [[5, 5, 5, 5, 3, 3, 1, 1, 2, 2], [5, 5, 5, 5, 3, 3, 3, 3, 1, 1], [5, 5, 5, 5, 3, 3, 3, 3, 1, 1]],
                player_position: [[1, 1], [2, 1], [1, 2]],
                select_creature: [-1, -1],
                select_grid: [-1, -1],
                ores: Array.from(ore, function () { return 0; }),
                vision_source: Array.from({ length: gridsize + 2 }, function (_, i) { return Array.from({ length: gridsize + 2 }, function (_, j) { return -1; }); }),
                weapon: -1,
                special: Array.from(pc, function () { return [-1, -1]; }),
                monsterHP: Array.from({ length: gridsize + 2 }, function (_, i) { return Array.from({ length: gridsize + 2 }, function (_, j) { return [-1, -1]; }); }),
                turnCount: 1
            };
            _this.state.grid[1][1] = 0;
            _this.state.grid[2][1] = 0;
            _this.state.grid[1][2] = 0;
            _this.state.grid[2][2] = 0;
            _this.state.creature[1][1] = 1;
            _this.state.creature[2][1] = 2;
            _this.state.creature[1][2] = 3;
            _this.state.vision_source[1][1] = base_vision;
            _this.state.vision_source[2][1] = base_vision;
            _this.swarm_no_update();
        }
        document.title = "Rock & Stone";
        return _this;
    }
    Demo.prototype.downloadSaveFile = function () {
        var myData = this.state;
        // create file in browser
        var fileName = "saveFile";
        var json = JSON.stringify(myData, null, 2);
        var blob = new Blob([json], { type: "application/json" });
        var href = URL.createObjectURL(blob);
        // create "a" HTLM element with href to file
        var link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };
    Demo.prototype.swarm_no_update = function () {
        for (var i = 0; i < gridsize + 2; i++) {
            for (var j = 0; j < gridsize + 2; j++) {
                var monster = monsterspawnmap.get(getRandomInt(randmax));
                if (monster) {
                    this.spawn_monster_no_update(monster, i, j);
                }
            }
        }
    };
    Demo.prototype.swarm = function () {
        this.swarm_no_update();
        this.forceUpdate();
    };
    Demo.prototype.spawn_monster_no_update = function (type, i, j) {
        if (this.state.creature[i][j] > 0 || !npc.includes(type)) {
            return;
        }
        this.state.creature[i][j] = type;
        this.state.monsterHP[i][j] = [defaultnpcHP[type - 10], defaultnpcHP[type - 10]];
    };
    Demo.prototype.spawn_monster = function (type, i, j) {
        this.spawn_monster_no_update(type, i, j);
        this.forceUpdate();
    };
    Demo.prototype.despawn_monster = function (i, j) {
        if (this.state.creature[i][j] <= 0 || !npc.includes(this.state.creature[i][j])) {
            return;
        }
        this.state.select_creature[0] = -1;
        this.state.select_creature[1] = -1;
        this.state.monsterHP[i][j][0] = -1;
        this.state.monsterHP[i][j][1] = -1;
        this.state.creature[i][j] = 0;
        this.forceUpdate();
    };
    Demo.prototype.drop_pod = function () {
        var x = getRandomInt(gridsize + 2);
        var y = getRandomInt(gridsize + 2);
        var x1 = x - 1;
        var y1 = y - 1;
        if (x1 < 0) {
            x1 = x + 1;
        }
        if (y1 < 0) {
            y1 = y + 1;
        }
        this.state.grid[x][y] = -10;
        this.state.vision_source[x][y] = 0;
        this.state.grid[x1][y] = -10;
        this.state.vision_source[x1][y] = 0;
        this.state.grid[x][y1] = -10;
        this.state.vision_source[x][y1] = 0;
        this.state.grid[x1][y1] = -10;
        this.state.vision_source[x1][y1] = 0;
        alert("Drop Pod is Ready! Fight your way to it!");
        this.forceUpdate();
    };
    Demo.prototype.find_path = function (i, j, x, y) {
        var dir = [Math.sign(x - i), Math.sign(y - j)];
        var cur = [x, y];
        while (dir[0] !== 0 || dir[1] !== 0) {
            cur[0] -= dir[0];
            cur[1] -= dir[1];
            dir = [Math.sign(cur[0] - i), Math.sign(cur[1] - j)];
            if (this.state.creature[cur[0]][cur[1]] > 0) {
                return randmax;
            }
        }
        return distance([i, j], [x, y]);
    };
    Demo.prototype.detect_path = function (player, x, y) {
        var p = this.state.player_position[player - 1];
        var possible = [
            [p[0] - 1, p[1] - 1],
            [p[0] - 1, p[1] + 1],
            [p[0] - 1, p[1]],
            [p[0], p[1] - 1],
            [p[0], p[1] + 1],
            [p[0] + 1, p[1] - 1],
            [p[0] + 1, p[1] + 1],
            [p[0] + 1, p[1]],
        ];
        var lowest = randmax;
        var res = -1;
        for (var i = 0; i < possible.length; i++) {
            var dest = possible[i];
            if (dest[0] <= -1 || dest[1] <= -1 || dest[0] == gridsize + 2 || dest[1] >= gridsize + 2) {
                continue;
            }
            var a = this.find_path(dest[0], dest[1], x, y);
            if (a < lowest) {
                lowest = a;
                res = i;
            }
        }
        return res == -1 ? [-1, -1] : possible[res];
    };
    Demo.prototype.step_monster = function (x, dest) {
        var dir = [Math.sign(-dest[0] + x[0]), Math.sign(-dest[1] + x[1])];
        var cur = [x[0], x[1]];
        var speed = speedNPC[this.state.creature[x[0]][x[1]] - 10];
        while ((dir[0] !== 0 || dir[1] !== 0) && this.state.creature[cur[0] - dir[0]][cur[1] - dir[1]] <= 0 && speed > 0) {
            cur[0] -= dir[0];
            cur[1] -= dir[1];
            dir = [Math.sign(cur[0] - dest[0]), Math.sign(cur[1] - dest[1])];
            speed--;
        }
        if (cur[0] !== x[0] || cur[1] !== x[1]) {
            this.state.creature[cur[0]][cur[1]] = this.state.creature[x[0]][x[1]];
            this.state.monsterHP[cur[0]][cur[1]][0] = this.state.monsterHP[x[0]][x[1]][0];
            this.state.monsterHP[cur[0]][cur[1]][1] = this.state.monsterHP[x[0]][x[1]][1];
            this.state.select_creature[0] = -1;
            this.state.select_creature[1] = -1;
            this.state.monsterHP[x[0]][x[1]][0] = -1;
            this.state.monsterHP[x[0]][x[1]][1] = -1;
            this.state.creature[x[0]][x[1]] = 0;
            this.forceUpdate();
        }
        return cur;
    };
    Demo.prototype.attack = function (x, y, p) {
        var roll = 1 + getRandomInt(6);
        if (roll >= 4) {
            this.state.players[p - 1][0] -= 1;
            alert(creaturegen.get(this.state.creature[x][y]) + " hit " + creaturegen.get(p) + (roll === 6 ? (' critically, ' + creaturegen.get(p) + ' gain the effect of ' + criteffect[this.state.creature[x][y] - 10]) : '.'));
            this.forceUpdate();
            if (creaturegen.get(this.state.creature[x][y]) == "exploder") {
                this.despawn_monster(x, y);
            }
        }
    };
    Demo.prototype.move_monster = function (x, y) {
        var _this = this;
        var disrange = pc.toSorted(function (k1, k2) { return getRandomInt(10) * 0.1 + distance([x, y], _this.state.player_position[k1 - 1]) - distance([x, y], _this.state.player_position[k2 - 1]); });
        for (var p = 0; p < disrange.length; p++) {
            if (distance([x, y], this.state.player_position[disrange[p] - 1]) <= rangeMonster[this.state.creature[x][y] - 10]) {
                this.attack(x, y, disrange[p]);
                return [x, y];
            }
            else {
                var dest = this.detect_path(disrange[p], x, y);
                if (dest[0] <= -1 || dest[1] <= -1 || dest[0] == gridsize + 2 || dest[1] >= gridsize + 2) {
                    continue;
                }
                else {
                    return this.step_monster([x, y], dest);
                }
            }
        }
        return [x, y];
    };
    Demo.prototype.move_player = function (num, i, j) {
        if (cavegen.get(this.state.grid[i][j]) && (cavegen.get(this.state.grid[i][j]) === 'wall' || ore.includes(cavegen.get(this.state.grid[i][j])))) {
            this.mine(i, j);
        }
        var x = this.state.player_position[num - 1][0];
        var y = this.state.player_position[num - 1][1];
        this.state.player_position[num - 1][0] = i;
        this.state.player_position[num - 1][1] = j;
        this.state.creature[i][j] = num;
        this.state.creature[x][y] = 0;
        this.state.vision_source[i][j] = base_vision;
        this.state.vision_source[x][y] = -1;
        this.state.select_creature[0] = i;
        this.state.select_creature[1] = j;
        this.forceUpdate();
    };
    Demo.prototype.mine = function (i, j) {
        var mined = cavegen.get(this.state.grid[i][j]);
        this.state.grid[i][j] = 0;
        if (mined && ore.includes(mined)) {
            if (mined == 'egg') {
                this.swarm_no_update();
                this.setState({ turnCount: 1 });
            }
            this.state.ores[ore.indexOf(mined)]++;
            this.forceUpdate();
        }
    };
    Demo.prototype.checkvision = function (i, j) {
        for (var ii = 0; ii < gridsize + 2; ii++) {
            for (var jj = 0; jj < gridsize + 2; jj++) {
                if (this.state.vision_source[ii][jj] >= distance([ii, jj], [i, j])) {
                    return true;
                }
            }
        }
        return false;
    };
    Demo.prototype.resupply = function (player) {
        for (var i = 1; i <= 4; i++) {
            this.state.players[player - 1][i * 2] += Math.ceil(this.state.players[player - 1][i * 2 + 1] / 2);
            this.state.players[player - 1][i * 2] = Math.min(this.state.players[player - 1][i * 2], this.state.players[player - 1][i * 2 + 1]);
        }
        this.forceUpdate();
    };
    Demo.prototype.useweapon = function (player, type) {
        if (this.state.weapon !== type) {
            if (this.state.players[player - 1][type * 2] > 0 && !(player === 1 && type === 3)) {
                this.state.players[player - 1][type * 2] -= 1;
            }
            this.setState({ weapon: type });
            this.forceUpdate();
        }
        else {
            this.setState({ weapon: -1 });
        }
    };
    Demo.prototype.fireweapon = function (i, j) {
        if (this.state.weapon <= 0) {
            return;
        }
        else if (this.state.weapon === 4) {
            this.state.vision_source[i][j] = this.state.control === 1 ? 4 : 0;
            if (this.state.control === 1) {
                if (this.state.special[0][0] === -1 && this.state.special[0][1] === -1) {
                    this.state.special[0] = [i, j];
                }
                else if (this.state.special[1][0] === -1 && this.state.special[1][1] === -1) {
                    this.state.special[1] = [i, j];
                }
                else {
                    var remove = this.state.special[0];
                    this.state.special[0] = this.state.special[1];
                    this.state.special[1] = [i, j];
                    this.state.vision_source[remove[0]][remove[1]] = -1;
                }
            }
            else {
                this.state.special[this.state.control] = [i, j];
            }
        }
        this.forceUpdate();
    };
    Demo.prototype.loadFile = function (target) {
        var reader = new FileReader();
        var that = this;
        reader.readAsText(target.files.item(0));
        reader.onload = function () {
            var dec = new TextDecoder("utf-8");
            var res = reader.result;
            that.setState(JSON.parse(typeof (res) == 'string' ? res : dec.decode(res)));
            that.forceUpdate();
        };
    };
    Demo.prototype.render = function () {
        var _this = this;
        return <div style={{ margin: 'max(30px, 6%) max(30px, 6%) max(30px, 6%) max(30px, 6%)', width: 50 * gridsize + 650, height: 50 * gridsize + 300 }}>
            <h3>Cave [Turn Count: {this.state.turnCount}]</h3>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <div style={{ backgroundColor: '#222222', borderRadius: 10, padding: '20px, 20px, 20px, 20px', width: 50 * gridsize + 120, aspectRatio: '1/1', position: 'relative' }}>
                    {this.state.grid.map(function (x, i) {
                return x.map(function (y, j) {
                    if (!_this.checkvision(i, j)) {
                        return '';
                    }
                    return <div key={i * gridsize + j} onContextMenu={function (e) {
                            e.preventDefault();
                            if (_this.state.select_creature[0] === -1 || _this.state.select_creature[1] === -1) {
                                return;
                            }
                            if ((_this.state.select_grid[0] !== i || _this.state.select_grid[1] !== j) || _this.state.control !== _this.state.creature[_this.state.select_creature[0]][_this.state.select_creature[1]]) {
                                return;
                            }
                            else {
                                _this.state.grid[i][j] = 0;
                                _this.forceUpdate();
                            }
                        }} onClick={function () {
                            if (_this.state.select_creature[0] === -1 || _this.state.select_creature[1] === -1) {
                                return;
                            }
                            if ((_this.state.select_grid[0] !== i || _this.state.select_grid[1] !== j) || _this.state.control !== _this.state.creature[_this.state.select_creature[0]][_this.state.select_creature[1]]) {
                                _this.setState({ select_grid: [i, j] });
                            }
                            else {
                                if (_this.state.weapon > 0) {
                                    _this.fireweapon(i, j);
                                    _this.setState({ weapon: -1 });
                                }
                                else {
                                    _this.move_player(_this.state.control, i, j);
                                }
                            }
                        }} style={{ width: 46, height: 46, backgroundColor: colormap.get(cavegen.get(y)), borderRadius: '8%', border: '2px ' + (_this.state.select_grid[0] === i && _this.state.select_grid[1] === j ? 'orange' : 'black') + ' solid', position: 'absolute', top: i * 50 + 10, left: j * 50 + 10 }}>
                                        {mapimage.get(cavegen.get(y)) ? <div style={{ borderRadius: '30%', border: '5px rgba(0,0,0,0) solid', height: '42px', width: '42px' }}><img src={mapimage.get(cavegen.get(y))} width='36px' style={{ borderRadius: '30%' }}></img></div> : ''}
                                    </div>;
                });
            })}
                    {this.state.creature.map(function (x, i) {
                return x.map(function (y, j) {
                    if (!_this.checkvision(i, j)) {
                        return '';
                    }
                    return creaturegen.get(y) ? <div onClick={function () {
                            if (pc.includes(y)) {
                                _this.setState({ control: y });
                            }
                            _this.setState({ select_creature: [i, j] });
                            if (npc.includes(y)) {
                                if (_this.state.weapon > 0) {
                                    _this.fireweapon(i, j);
                                    _this.setState({ weapon: -1 });
                                }
                            }
                        }} key={i * gridsize + j} style={{ cursor: 'pointer', lineHeight: '42px', textAlign: 'center', width: 42, height: 42, backgroundColor: creaturemap.get(creaturegen.get(y)), border: '4px ' + (_this.state.select_creature[0] === i && _this.state.select_creature[1] === j ? 'orange' : 'black') + ' solid', position: 'absolute', top: i * 50 + 10, left: j * 50 + 10, borderRadius: '50%' }}>
                                        {creaturegen.get(y) ? <img src={creatureimage.get(creaturegen.get(y))} style={{ verticalAlign: 'middle' }} width={pc.includes(y) ? '42px' : '38px'}></img> : ''}
                                    </div> : '';
                });
            })}
                    {this.state.special.map(function (x, i) {
                if (x[0] === -1 || x[1] === -1) {
                    return '';
                }
                return <img width='10px' key={i.toString() + 'special'} src={'./assets/special' + i.toString() + '.png'} onClick={function () {
                        _this.state.vision_source[_this.state.special[i][0]][_this.state.special[i][1]] = -1;
                        _this.state.special[i] = [-1, -1];
                        _this.forceUpdate();
                    }} style={{ cursor: 'crosshair', position: 'absolute', top: x[0] * 50 + 30, left: x[1] * 50 + 30 }}></img>;
            })}
                </div>
                {this.state.select_creature[0] !== -1 && this.state.select_creature[1] !== -1 && pc.includes(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) ?
                <div style={{ width: 400, height: 300, border: '7px #222222 solid', backgroundColor: '#b6b6b6', position: 'absolute', top: 0, left: gridsize * 50 + 150, borderRadius: 10 }}>
                    <div style={{ position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div onClick={function () {
                        if (_this.state.ores[1] > 0) {
                            _this.resupply(_this.state.control);
                            _this.state.ores[1] -= 1;
                            _this.forceUpdate();
                        }
                    }} style={{ cursor: 'pointer', margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(this.state.control)) }}>
                            <img src={creatureimage.get(creaturegen.get(this.state.control))} width='100%'></img>
                        </div>
                        <div style={{ margin: 0, width: 80, height: 80, display: 'inline', fontSize: 20 }}>
                            <b>{creaturegen.get(this.state.control)}</b>
                            <br />
                            HP: {this.state.players[this.state.control - 1][0]}/{this.state.players[this.state.control - 1][1]}
                            <div onClick={function () {
                        _this.state.players[_this.state.control - 1][0] = Math.min(_this.state.players[_this.state.control - 1][0] + 1, _this.state.players[_this.state.control - 1][1]);
                        _this.forceUpdate();
                    }} style={{ position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center' }}><span style={{ verticalAlign: 'middle' }}>+</span></div>
                            <div onClick={function () {
                        _this.state.players[_this.state.control - 1][0] = Math.max(_this.state.players[_this.state.control - 1][0] - 1, 0);
                        _this.forceUpdate();
                    }} style={{ position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center' }}><span style={{ verticalAlign: 'middle' }}>-</span></div>
                        </div>
                    </div>
                    <div style={{ marginLeft: 25, marginTop: 10 }}><b>Weapon Slot</b></div>
                    <div style={{ marginTop: 10, marginLeft: 20, width: 350, height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {[1, 2, 3, 4].map(function (x) { return <div key={x.toString() + 'weapnimg'} onClick={function () {
                            if (_this.state.players[_this.state.control - 1][x * 2] > 0) {
                                _this.useweapon(_this.state.control, x);
                            }
                        }} style={{ textAlign: 'center', cursor: 'pointer', lineHeight: '70px', border: '5px ' + (_this.state.weapon === x ? 'orange' : 'black') + ' solid', marginLeft: 5, width: 75, height: 75, borderRadius: '30%', backgroundColor: creaturemap.get(creaturegen.get(_this.state.control)) }}>
                            <img src={'./assets/weapon' + _this.state.control.toString() + x.toString() + '.png'} width='80%' style={{ verticalAlign: 'middle' }}></img>
                        </div>; })}
                    </div>
                    <div style={{ marginTop: 0, marginLeft: 20, width: 350, height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {[1, 2, 3, 4].map(function (x) { return <div key={x.toString() + 'weapnname'} style={{ margin: 5, width: 80, height: 30, textAlign: 'center' }}>
                            {_this.state.players[_this.state.control - 1][x * 2]}/{_this.state.players[_this.state.control - 1][x * 2 + 1]}
                        </div>; })}
                    </div>
                </div> : (this.state.select_creature[0] !== -1 && this.state.select_creature[1] !== -1 && npc.includes(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) ?
                <div style={{ width: 400, height: 200, border: '7px #222222 solid', backgroundColor: '#b6b6b6', position: 'absolute', top: 0, left: gridsize * 50 + 150, borderRadius: 10 }}>
                    <div style={{ position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])) }}>
                            <img src={creatureimage.get(creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]))} width='100%'></img>
                        </div>
                        <div style={{ margin: 0, width: 80, height: 80, display: 'inline', fontSize: 20 }}>
                            <b>{creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])}</b>
                            <br />
                            HP: {this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]}/{this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][1]}
                            <br />
                            Armor: {armorNPC[this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]] - 10]}
                            <div onClick={function () {
                        _this.state.monsterHP[_this.state.select_creature[0]][_this.state.select_creature[1]][0] = Math.min(_this.state.monsterHP[_this.state.select_creature[0]][_this.state.select_creature[1]][0] + 1, _this.state.monsterHP[_this.state.select_creature[0]][_this.state.select_creature[1]][1]);
                        _this.forceUpdate();
                    }} style={{ position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center' }}><span style={{ verticalAlign: 'middle' }}>+</span></div>
                            <div onClick={function () {
                        _this.state.monsterHP[_this.state.select_creature[0]][_this.state.select_creature[1]][0] = Math.max(_this.state.monsterHP[_this.state.select_creature[0]][_this.state.select_creature[1]][0] - 1, 0);
                        _this.forceUpdate();
                    }} style={{ position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center' }}><span style={{ verticalAlign: 'middle' }}>-</span></div>
                        </div>
                    </div>
                    <div onClick={function () {
                        _this.despawn_monster(_this.state.select_creature[0], _this.state.select_creature[1]);
                    }} style={{ cursor: 'pointer', position: 'relative', margin: 'auto', width: '80%', height: '30px', backgroundColor: '#990000', marginTop: '20px', textAlign: 'center', lineHeight: '30px', borderRadius: '15px' }}><b>Remove</b></div>
                </div> : '')}
                <div onClick={function () {
                if (_this.state.turnCount < period - _this.state.ores[4] * 2) {
                    var moved = [];
                    for (var i = 0; i < gridsize + 2; i++) {
                        for (var j = 0; j < gridsize + 2; j++) {
                            if (npc.includes(_this.state.creature[i][j]) && _this.checkvision(i, j) && (!moved.includes(i * (gridsize + 2) + j))) {
                                var dest = _this.move_monster(i, j);
                                moved.push(dest[0] * (gridsize + 2) + dest[1]);
                            }
                        }
                    }
                    _this.setState({ turnCount: _this.state.turnCount + 1 });
                }
                else {
                    _this.swarm();
                    _this.setState({ turnCount: 1 });
                }
                alert('Monster Turn Finished');
            }} style={{ width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position: 'absolute', top: 350, left: gridsize * 50 + 150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red' }}><b>End Turn</b></div>
                <div onClick={function () {
                _this.swarm();
                _this.setState({ turnCount: 1 });
                _this.drop_pod();
            }} style={{ width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position: 'absolute', top: 420, left: gridsize * 50 + 150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red' }}><b>Call Extraction</b></div>
                <div onClick={function () {
                _this.downloadSaveFile();
            }} style={{ width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position: 'absolute', top: 490, left: gridsize * 50 + 150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red' }}><b>Save Game</b></div>
                <input type="file" id='submission' accept={'json'} hidden multiple onChange={function (e) { return _this.loadFile(e.target); }}/>
                <label htmlFor='submission' style={{ width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position: 'absolute', top: 560, left: gridsize * 50 + 150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red' }}><b>Load Game</b></label>
                
            </div>
            <h3>Loot</h3>
            <div style={{ paddingRight: 20, backgroundColor: '#222222', display: 'flex', flexDirection: 'row', overflowX: 'scroll', alignItems: 'center', marginBottom: 'max(30px, 6%)', borderRadius: 10, padding: '20px, 20px, 20px, 20px', width: 50 * gridsize + 120, height: '200px', position: 'relative' }}>
                {ore.map(function (x, i) {
                return <div key={i.toString() + 'ore'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 150, flexShrink: 0, aspectRatio: 1, marginLeft: 20, borderRadius: 10, backgroundColor: '#555555' }}>
                            <img src={mapimage.get(ore[i])} width='60%' style={{ marginTop: '10%', marginBottom: '5%', borderRadius: '30%' }}></img>
                            <div>
                                <b>{ore[i]}:</b> {_this.state.ores[i]}
                            </div>
                        </div>;
            })}
            </div>
        </div>;
    };
    return Demo;
}(react_1["default"].Component));
exports["default"] = Demo;
