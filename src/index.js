const state = {
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

document.body.innerHTML += `<div style={{margin: 'max(30px, 6%) max(30px, 6%) max(30px, 6%) max(30px, 6%)', width: 50*gridsize + 650, height: 50*gridsize + 300}}>
            <h3>Cave [Turn Count: {state.turnCount}]</h3>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                <div style={{backgroundColor: '#222222', borderRadius: 10, padding: '20px, 20px, 20px, 20px', width: 50*gridsize+120, aspectRatio: '1/1', position: 'relative'}}>
                    {state.grid.map(
                        (x: number[], i: number) => {
                            return x.map(
                                (y: number, j: number) => {
                                    if (!this.checkvision(i, j)) {
                                        return ''
                                    }
                                    return <div key={i*gridsize+j} onContextMenu={(e) => {
                                        e.preventDefault();
                                        if (state.select_creature[0] === -1 || state.select_creature[1] === -1) {
                                            return
                                        }
                                        if ((state.select_grid[0] !== i || state.select_grid[1] !== j) || state.control !== state.creature[state.select_creature[0]][state.select_creature[1]]) {
                                            return;
                                        } else {
                                            state.grid[i][j] = 0;
                                            this.forceUpdate();
                                        }
                                    }} onClick={
                                        () => {
                                            if (state.select_creature[0] === -1 || state.select_creature[1] === -1) {
                                                return
                                            }
                                            if ((state.select_grid[0] !== i || state.select_grid[1] !== j) || state.control !== state.creature[state.select_creature[0]][state.select_creature[1]]) {
                                                this.setState({select_grid: [i, j]});
                                            } else {
                                                if (state.weapon > 0) {
                                                    this.fireweapon(i, j);
                                                    this.setState({weapon: -1});
                                                } else {
                                                    this.move_player(state.control, i, j);
                                                }
                                            }
                                        }
                                    } style={{width:46, height:46, backgroundColor: colormap.get(cavegen.get(y)!), borderRadius: '8%', border: '2px '+(state.select_grid[0]===i&&state.select_grid[1]===j? 'orange' : 'black')+' solid', position:'absolute', top: i*50+10, left: j*50+10}}>
                                        {mapimage.get(cavegen.get(y)!)? <div style={{borderRadius:'30%', border: '5px rgba(0,0,0,0) solid', height: '42px', width: '42px'}}><img src={mapimage.get(cavegen.get(y)!)} width='36px' style={{borderRadius: '30%'}}></img></div>: ''}
                                    </div>
                                }
                            )
                        }
                    )}
                    {state.creature.map(
                        (x: number[], i: number) => {
                            return x.map(
                                (y: number, j: number) => {
                                    if (!this.checkvision(i, j)) {
                                        return ''
                                    }
                                    return creaturegen.get(y)? <div onClick={
                                        () => {
                                            if (pc.includes(y)) {
                                                this.setState({control: y});
                                            }
                                            this.setState({select_creature: [i, j]});
                                            if (npc.includes(y)) {
                                                if (state.weapon > 0) {
                                                    this.fireweapon(i, j);
                                                    this.setState({weapon: -1});
                                                }
                                            }
                                        }
                                    } key={i*gridsize+j} style={{cursor: 'pointer', lineHeight: '42px', textAlign: 'center', width:42, height:42, backgroundColor: creaturemap.get(creaturegen.get(y)!), border: '4px '+(state.select_creature[0]===i&&state.select_creature[1]===j ? 'orange' : 'black')+' solid', position:'absolute', top: i*50+10, left: j*50+10, borderRadius: '50%'}}>
                                        {creaturegen.get(y)? <img src={creatureimage.get(creaturegen.get(y)!)} style={{verticalAlign: 'middle'}} width={pc.includes(y)? '42px' : '38px'}></img> : ''}
                                    </div> : '';
                                }
                            )
                        }
                    )}
                    {state.special.map(
                        (x: number[], i: number) => {
                            if (x[0] === -1 || x[1] === -1) {
                                return ''
                            }
                            return <img width='10px' key={i.toString()+'special'} src={'./assets/special'+i.toString()+'.png'} onClick={()=>{
                                state.vision_source[state.special[i][0]][state.special[i][1]] = -1;
                                state.special[i] = [-1, -1];
                                this.forceUpdate();
                            }} style={{cursor: 'crosshair', position:'absolute', top: x[0]*50+30, left: x[1]*50+30}}></img>
                        }
                    )}
                </div>
                {state.select_creature[0] !== -1 && state.select_creature[1] !== -1 && pc.includes(state.creature[state.select_creature[0]][state.select_creature[1]]) ? 
                <div style={{width: 400, height: 300, border: '7px #222222 solid' , backgroundColor: '#b6b6b6', position:'absolute', top: 0, left: gridsize*50+150, borderRadius: 10}}>
                    <div style={{position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div onClick={() => {
                            if (state.ores[1] > 0) {
                                this.resupply(state.control);
                                state.ores[1] -= 1;
                                this.forceUpdate();
                            }
                        }} style={{cursor: 'pointer', margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(state.control)!)}}>
                            <img src={creatureimage.get(creaturegen.get(state.control)!)} width='100%'></img>
                        </div>
                        <div style={{margin: 0, width: 80, height: 80, display: 'inline', fontSize: 20}}>
                            <b>{creaturegen.get(state.control)}</b>
                            <br/>
                            HP: {state.players[state.control-1][0]}/{state.players[state.control-1][1]}
                            <div onClick={() => {
                                state.players[state.control-1][0] = Math.min(state.players[state.control-1][0]+1, state.players[state.control-1][1]);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>+</span></div>
                            <div onClick={() => {
                                state.players[state.control-1][0] = Math.max(state.players[state.control-1][0]-1, 0);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>-</span></div>
                        </div>
                    </div>
                    <div style={{marginLeft: 25, marginTop: 10}}><b>Weapon Slot</b></div>
                    <div style={{marginTop: 10, marginLeft: 20, width: 350, height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {[1,2,3,4].map((x: number) => <div key={x.toString()+'weapnimg'} onClick={() => {
                            if (state.players[state.control-1][x*2] > 0) {
                                this.useweapon(state.control, x);
                            }
                        }} style={{textAlign: 'center', cursor: 'pointer', lineHeight: '70px', border: '5px '+ (state.weapon === x ? 'orange' : 'black') +' solid', marginLeft: 5, width: 75, height: 75, borderRadius: '30%', backgroundColor: creaturemap.get(creaturegen.get(state.control)!)}}>
                            <img src={'./assets/weapon'+state.control.toString()+x.toString()+'.png'} width='80%' style={{verticalAlign: 'middle'}}></img>
                        </div>)}
                    </div>
                    <div style={{marginTop: 0, marginLeft: 20, width: 350, height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {[1,2,3,4].map((x: number) => <div key={x.toString()+'weapnname'} style={{margin: 5, width: 80, height: 30, textAlign: 'center'}}>
                            {state.players[state.control-1][x*2]}/{state.players[state.control-1][x*2+1]}
                        </div>)}
                    </div>
                </div>: (state.select_creature[0] !== -1 && state.select_creature[1] !== -1 && npc.includes(state.creature[state.select_creature[0]][state.select_creature[1]]) ? 
                <div style={{width: 400, height: 200, border: '7px #222222 solid' , backgroundColor: '#b6b6b6', position:'absolute', top: 0, left: gridsize*50+150, borderRadius: 10}}>
                    <div style={{position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(state.creature[state.select_creature[0]][state.select_creature[1]])!)}}>
                            <img src={creatureimage.get(creaturegen.get(state.creature[state.select_creature[0]][state.select_creature[1]])!)} width='100%'></img>
                        </div>
                        <div style={{margin: 0, width: 80, height: 80, display: 'inline', fontSize: 20}}>
                            <b>{creaturegen.get(state.creature[state.select_creature[0]][state.select_creature[1]])}</b>
                            <br/>
                            HP: {state.monsterHP[state.select_creature[0]][state.select_creature[1]][0]}/{state.monsterHP[state.select_creature[0]][state.select_creature[1]][1]}
                            <br/>
                            Armor: {armorNPC[state.creature[state.select_creature[0]][state.select_creature[1]]-10]}
                            <div onClick={() => {
                                state.monsterHP[state.select_creature[0]][state.select_creature[1]][0] = Math.min(state.monsterHP[state.select_creature[0]][state.select_creature[1]][0]+1, state.monsterHP[state.select_creature[0]][state.select_creature[1]][1]);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>+</span></div>
                            <div onClick={() => {
                                state.monsterHP[state.select_creature[0]][state.select_creature[1]][0] = Math.max(state.monsterHP[state.select_creature[0]][state.select_creature[1]][0]-1, 0);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>-</span></div>
                        </div>
                    </div>
                    <div onClick={()=>{
                        this.despawn_monster(state.select_creature[0], state.select_creature[1])
                    }} style={{cursor: 'pointer', position: 'relative', margin: 'auto', width: '80%', height: '30px', backgroundColor: '#990000', marginTop: '20px', textAlign: 'center', lineHeight: '30px' ,borderRadius: '15px'}}><b>Remove</b></div>
                </div>: '')}
                <div onClick={() => {
                    if (state.turnCount < period-Math.min(4, state.ores[4]*2)) {
                        var moved: number[] = [];
                        for (var i=0; i<gridsize+2; i++) {
                            for (var j=0; j<gridsize+2; j++) {
                                if (npc.includes(state.creature[i][j]) && this.checkvision(i,j) && (!moved.includes(i*(gridsize+2)+j))) {
                                    const dest = this.move_monster(i, j);
                                    moved.push(dest[0]*(gridsize+2)+dest[1]);
                                }
                            }
                        }
                        this.setState({turnCount: state.turnCount + 1});
                    } else {
                        this.swarm();
                        this.setState({turnCount: 1});
                    }
                    alert('Monster Turn Finished');
                }}style={{width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position:'absolute', top: 350, left: gridsize*50+150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red'}}><b>End Turn</b></div>
                <div onClick={() => {
                    this.setState({turnCount: 10});
                    this.drop_pod();
                }}style={{width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position:'absolute', top: 420, left: gridsize*50+150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red'}}><b>Call Extraction</b></div>
                <div onClick={() => {
                    this.downloadSaveFile();
                }}style={{width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position:'absolute', top: 490, left: gridsize*50+150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red'}}><b>Save Game</b></div>
                <input type="file" id='submission' accept={'json'} hidden multiple onChange={(e) => this.loadFile(e.target)}/>
                <label htmlFor='submission' style={{width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position:'absolute', top: 560, left: gridsize*50+150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red'}}><b>Load Game</b></label>
                
            </div>
            <h3>Loot</h3>
            <div style={{paddingRight: 20, backgroundColor: '#222222', display: 'flex', flexDirection: 'row', overflowX: 'scroll', alignItems: 'center', marginBottom: 'max(30px, 6%)', borderRadius: 10, padding: '20px, 20px, 20px, 20px', width: 50*gridsize+120, height: '200px', position: 'relative'}}>
                {ore.map( 
                    (x: string, i: number) => {
                        return <div key={i.toString()+'ore'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 150, flexShrink: 0, aspectRatio: 1, marginLeft: 20, borderRadius: 10, backgroundColor: '#555555'}}>
                            <img src={mapimage.get(ore[i])} width='60%' style={{marginTop: '10%', marginBottom: '5%', borderRadius: '30%'}}></img>
                            <div>
                                <b>{ore[i]}:</b> {state.ores[i]}
                            </div>
                        </div>
                    }
                )}
            </div>
        </div>`;