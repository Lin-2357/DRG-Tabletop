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
    mapimage.set(ore[x], './public/assets/' + ore[x] + '.png');
    colormap.set(ore[x], colormap.get('wall'));
}
var creaturemap = new Map();
creaturemap.set('scout', '#000044');
creaturemap.set('driller', '#443300');
creaturemap.set('gunner', '#224433');
var creatureimage = new Map();
creatureimage.set('scout', './public/assets/scout.png');
creatureimage.set('driller', './public/assets/driller.png');
creatureimage.set('gunner', './public/assets/gunner.png');
for (var i = 0; i < npc.length; i++) {
    creaturemap.set(monsterlist[i], '#444422');
    creatureimage.set(monsterlist[i], './public/assets/' + monsterlist[i] + '.png');
}
var gridsize = 25;
var base_vision = 5;

var state = {
  grid: Array.from({ length: gridsize+2 }, (_, i) => Array.from({ length: gridsize+2 }, (_, j) => (j===0 || i===0 || j===gridsize+1 || i===gridsize+1 ? 600 : getRandomInt(randmax)))),
                creature: Array.from({ length: gridsize+2 }, (_, i) => Array.from({ length: gridsize+2 }, (_, j) => 0)),
                control: 1,
                players: [[5,5,5,5,3,3,1,1,2,2], [5,5,5,5,3,3,3,3,1,1], [5,5,5,5,3,3,3,3,1,1]],
                player_position: [[1,1],[2,1],[1,2]],
                select_creature: [-1, -1],
                select_grid: [-1, -1],
                ores: Array.from(ore, ()=>{return 0}),
                vision_source: Array.from({ length: gridsize+2 }, (_, i) => Array.from({ length: gridsize+2 }, (_, j) => -1)),
                weapon: -1,
                special: Array.from(pc, () => [-1,-1]),
                monsterHP: Array.from({ length: gridsize+2 }, (_, i) => Array.from({ length: gridsize+2 }, (_, j) => [-1,-1])),
                turnCount: 1,
};

state.grid[1][1] = 0;
            state.grid[2][1] = 0;
            state.grid[1][2] = 0;
            state.grid[2][2] = 0;
            state.creature[1][1] = 1;
            state.creature[2][1] = 2;
            state.creature[1][2] = 3;
            state.vision_source[1][1] = base_vision;
            state.vision_source[2][1] = base_vision;
            state.vision_source[1][2] = base_vision;

function addturn() {
  if (state.turnCount < period-Math.min(4, state.ores[4]*2)) {
      state['turnCount'] += 1;
      update();
  } else {
      //this.swarm();
      state['turnCount'] = 1;
      update();
  }
  alert('Monster Turn Finished');
}

function droppod() {

}

function savefile() {
  const myData = state;
      
        // create file in browser
        const fileName = "saveFile";
        const json = JSON.stringify(myData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
      
        // create "a" HTLM element with href to file
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
      
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
}

function loadfile() {
  
}

function fireweapon() {

}

function checkwin() {
   
}

function mine(i,j) {
    const mined = cavegen.get(state.grid[i][j])
    state.grid[i][j] = 0;
    if (mined && ore.includes(mined)) {
        if (mined == 'egg') {
            state.turnCount = 10;
        }
        state.ores[ore.indexOf(mined)]++;
        update();
    }
}

function move_player(num, i, j) {
    if (cavegen.get(state.grid[i][j]) && (cavegen.get(state.grid[i][j]) === 'wall' || ore.includes(cavegen.get(state.grid[i][j])))) {
        mine(i, j);
    }
    const x = state.player_position[num-1][0];
    const y = state.player_position[num-1][1];
    state.player_position[num-1][0] = i;
    state.player_position[num-1][1] = j;
    state.creature[i][j] = num;
    state.creature[x][y] = 0;
    state.vision_source[i][j] = base_vision;
    state.vision_source[x][y] = -1;
    state.select_creature[0] = i;
    state.select_creature[1] = j;
    checkwin();
    update();
}

function clickcreature(i,j) {
    const y = state.creature[i][j];
    if (!y) {
        return;
    }
    if (pc.includes(y)) {
        state.control = y;
    }
    state.select_creature= [i, j];
    if (npc.includes(y)) {
        if (state.weapon > 0) {
            fireweapon(i, j);
            state.weapon = -1;
        }
    }
    update();
}

function clickgrid(i, j) {
    if (state.select_creature[0] === -1 || state.select_creature[1] === -1) {
       return
    }
    if ((state.select_grid[0] !== i || state.select_grid[1] !== j) || state.control !== state.creature[state.select_creature[0]][state.select_creature[1]]) {
        state['select_grid'][0] = i;
        state['select_grid'][1] = j;
    } else {
        if (state.weapon > 0) {
            fireweapon(i, j);
            state.weapon = -1;
        } else {
            move_player(state.control, i, j);
        }
    }
    update();
}

function update() {
  document.body.innerHTML = `<div style="margin: max(30px, 6%) max(30px, 6%) max(30px, 6%) max(30px, 6%); width: ${50*gridsize + 650}px; height: ${50*gridsize + 300};">
  <h3>Cave [Turn Count: ${state.turnCount}]</h3>
  <div style="display: flex; flex-direction: row; alignItems: center; position: relative;">
      <div id='cave' style="background-color: #222222; borderRadius: 10px; padding: 20px, 20px, 20px, 20px; width: ${50*gridsize+120}px; aspect-ratio: 1/1; position: relative;">
      </div>
      <div id="turner" style="width: 130px; height: 50px; border: 7px #442222 solid; cursor: pointer; background-color: #332222; position: absolute; top: 350px; left: ${gridsize*50+150}px; border-radius: 10px; line-height: '50px'; text-align: center; color: red;"><b>End Turn</b></div>
      <div id="caller" style="width: 130px; height: 50px; border: 7px #442222 solid; cursor: pointer; background-color: #332222; position: absolute; top: 420px; left: ${gridsize*50+150}px; border-radius: 10px; line-height: '50px'; text-align: center; color: red;"><b>Call Drop Pod</b></div>
      <div id="saver" style="width: 130px; height: 50px; border: 7px #442222 solid; cursor: pointer; background-color: #332222; position: absolute; top: 490px; left: ${gridsize*50+150}px; border-radius: 10px; line-height: '50px'; text-align: center; color: red;"><b>Save Game</b></div>
      <div id="loader" style="width: 130px; height: 50px; border: 7px #442222 solid; cursor: pointer; background-color: #332222; position: absolute; top: 560px; left: ${gridsize*50+150}px; border-radius: 10px; line-height: '50px'; text-align: center; color: red;"><b>Load Game</b></div>
      
  </div>
  <h3>Loot</h3>
  <div id="loot" style="background-color: #222222; display: flex; flex-direction: row; overflow-x: scroll; align-items: center; margin-bottom: max(30px, 6%); border-radius: 10px; padding: 20px 20px 20px 20px; width: ${50*gridsize+120}px; height: ${200}px, position: relative">
  </div>
  </div>`;
  var gridss = '';
  for (var i=0;i<gridsize+2;i++) {
    for (var j=0;j<gridsize+2;j++) {
      const y=state.grid[i][j];
      gridss += `<div id=${i*(gridsize+2)+j} style="width:46px; height:46px; background-color: ${colormap.get(cavegen.get(y))}; border-radius: 8%; border: 2px ${(state.select_grid[0]===i&&state.select_grid[1]===j? 'orange' : 'black')} solid; position:absolute; top: ${i*50+10}px; left: ${j*50+10}px">`;
      gridss += mapimage.get(cavegen.get(y))? `<div style="border-radius:30%; margin:auto; border:5px rgba(0,0,0,0) solid; height: 42px; width: 42px"><img src="${mapimage.get(cavegen.get(y))}" width="36px" style="border-radius: 30%;"></img></div>`: '';
      gridss += `</div>`;
      const yy = state.creature[i][j];
      if (creaturegen.get(yy)) {
        gridss += `<div id="ct${i*(gridsize+2)+j}" style="width:42px; cursor: pointer; height:42px; background-color: ${creaturemap.get(creaturegen.get(yy))}; border-radius: 50%; border: 2px ${(state.select_creature[0]===i&&state.select_creature[1]===j? 'orange' : 'black')} solid; position:absolute; top: ${i*50+12}px; left: ${j*50+12}px">`;
        gridss += creaturegen.get(yy)? `<img src="${creatureimage.get(creaturegen.get(yy))}" style="vertical-align: middle;" width=${pc.includes(yy)? "42px" : "38px"}></img>` : ''
        gridss += `</div>`;        
      }

    }
  }
  document.getElementById('cave').innerHTML = gridss;
  document.getElementById(
    'turner').addEventListener(
    'click', addturn);
  document.getElementById(
    'caller').addEventListener(
    'click', droppod);
  document.getElementById(
    'saver').addEventListener(
    'click', savefile);
  document.getElementById(
    'loader').addEventListener(
    'click', loadfile);
  for (var i=0;i<gridsize+2;i++) {
    for (var j=0;j<gridsize+2;j++) {
      const x = i;
      const y = j;
      document.getElementById(
        `${i*(gridsize+2)+j}`).addEventListener(
        'click', ()=>{clickgrid(x,y)});
        if (document.getElementById(
            `ct${i*(gridsize+2)+j}`)) {
            document.getElementById(
            `ct${i*(gridsize+2)+j}`).addEventListener(
            'click', ()=>{clickcreature(x,y)});
        }
    }
  }
}
update();
