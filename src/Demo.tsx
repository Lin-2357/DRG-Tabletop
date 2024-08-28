import React from 'react'; 

const pc = [1,2,3]
const npc = [10,11,12,13,14]
const boss = [100, 101]
const randmax = 1000;
const period = 10;

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function distance(a: number[], b: number[]) {
    return Math.max(b[0]-a[0], b[1]-a[1], a[0]-b[0], a[1]-b[1]);
}

interface DemoState {
    mission: number,
    grid: number[][],
    creature: number[][],
    control: number,
    players: number[][],
    player_position: number[][],
    select_grid: number[],
    select_creature: number[],
    ores: number[],
    vision_source: number[][],
    weapon: number,
    special: number[][],
    monsterHP: number[][][],
    turnCount: number,
}

const ore: string[] = ['gold', 'nitra', 'morkite', 'egg', 'corestone', 'jade', 'bismor', 'pearl', 'croppa', 'magnite', 'araq'];
const mission: string[] = ['mine morkite', 'on-site refinery', 'heartstone', 'golden dreadnought', 'deep dive', 'rescue M.U.L.E', 'hack rival company', 'the caretaker'];
const missionNum: number[] = [0, 1, 1, 0, 1, 3, 2, 0];
const missionsize: number[] = [0, 2, 2, 0, 2, 1, 2, 0];

const cavegen: Map<number, string> = new Map<number, string>();
cavegen.set(-10, 'drop pod');
for (var i=0; i<mission.length; i++) {
    cavegen.set(i-100, mission[i]);
}
for (var i = 0; i < randmax; i++) {
    if (i < 500) {
        cavegen.set(i, 'floor');
    }else if (i < 700) {
        cavegen.set(i, 'wall');
    }else if (i < 900) {
        cavegen.set(i, 'hole');
    }else if (i < 930) {
        cavegen.set(i, 'gold');
    }else if (i < 960) {
        cavegen.set(i, 'nitra');
    }else if (i < 968) {
        cavegen.set(i, 'morkite')
    }else if (i < 990) {
        cavegen.set(i, ore[getRandomInt(ore.length-2)+2])
    }

    else {
        cavegen.set(i, 'jade');
    }
}

const monsterspawnmap: Map<number, number> = new Map<number, number>();
for (var i = 0; i < randmax; i++) {
    if (i < 970) {
        monsterspawnmap.set(i, 0);
    }else if (i < 980) {
        monsterspawnmap.set(i, 10);
    }else if (i < 985) {
        monsterspawnmap.set(i, 11);
    }else if (i < 990) {
        monsterspawnmap.set(i, 12);
    }else if (i < 997) {
        monsterspawnmap.set(i, 13);
    }else if (i < 1000) {
        monsterspawnmap.set(i, 14);
    }

    else {
        monsterspawnmap.set(i, 0);
    }
}

const creaturegen: Map<number, string> = new Map<number, string>();
const playerlist = ['scout', 'driller', 'gunner'];
for (var i=0;i<pc.length;i++) {
    creaturegen.set(i+1, playerlist[i]);
}
const monsterlist = ['grunt', 'acid spitter', 'web spitter', 'exploder', 'praetorian', 'guard', 'oppressor']
const defaultnpcHP = [1,1,1,1,2,2,5]
const rangeMonster = [1,4,3,1,2,1,1]
const speedNPC = [3,3,3,3,3,3,3]
const armorNPC = [1,0,0,0,1,1,2]
const criteffect = ["none", 'none', 'slowed', 'burned', 'poisoned', 'bleed', 'none']
for (var i=0;i<npc.length;i++) {
    creaturegen.set(i+10, monsterlist[i]);
}

const bosslist = ['golden dreadnought', 'the caretaker']
const bossHP = [10, 10]
const bossArmor = [1, 0]
creaturegen.set(100, 'golden dreadnought')
creaturegen.set(101, 'the caretaker')


const colormap: Map<string, string> = new Map<string, string>();
colormap.set('wall', '#443322');
colormap.set('hole', '#111111');
colormap.set('floor', '#444444');
colormap.set('drop pod', '#444466');
const mapimage: Map<string, string> = new Map<string, string>();
for (var x in ore) {
    mapimage.set(ore[x], './assets/'+ore[x]+'.png');
    colormap.set(ore[x], colormap.get('wall')!);
}
for (var i=0; i<mission.length; i++) {
    colormap.set(mission[i], '#441111');
}

const creaturemap: Map<string, string> = new Map<string, string>();
creaturemap.set('scout', '#000044');
creaturemap.set('driller', '#443300');
creaturemap.set('gunner', '#224433');
const creatureimage: Map<string, string> = new Map<string, string>();
creatureimage.set('scout', './assets/scout.png');
creatureimage.set('driller', './assets/driller.png');
creatureimage.set('gunner', './assets/gunner.png');
for (var i=0;i<npc.length;i++) {
    creaturemap.set(monsterlist[i], '#444422');
    creatureimage.set(monsterlist[i], './assets/'+monsterlist[i]+'.png');
}
for (var i=0;i<boss.length;i++) {
    creaturemap.set(bosslist[i], '#444422');
    creatureimage.set(bosslist[i], './assets/'+bosslist[i]+'.png');
}


const gridsize: number = 25;
const base_vision = 5;

class Demo extends React.Component<{},DemoState> {

    constructor(props: {}) {
        super(props);
        if (true) {
            this.state = {
                mission: -100,
                grid: Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => (j===0 || i===0 || j===gridsize+1 || i===gridsize+1 ? 600 : getRandomInt(randmax)))),
                creature: Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => 0)),
                control: 1,
                players: [[5,5,5,5,3,3,1,1,2,2], [5,5,5,5,3,3,3,3,1,1], [5,5,5,5,3,3,3,3,1,1]],
                player_position: [[1,1],[2,1],[1,2]],
                select_creature: [-1, -1],
                select_grid: [-1, -1],
                ores: Array.from(ore, ()=>{return 0}),
                vision_source: Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => -1)),
                weapon: -1,
                special: Array.from(pc, () => [-1,-1]),
                monsterHP: Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => [-1,-1])),
                turnCount: 1,
            };
            this.state.grid[1][1] = 0;
            this.state.grid[2][1] = 0;
            this.state.grid[1][2] = 0;
            this.state.grid[2][2] = 0;
            this.state.creature[1][1] = 1;
            this.state.creature[2][1] = 2;
            this.state.creature[1][2] = 3;
            this.state.vision_source[1][1] = base_vision;
            this.state.vision_source[2][1] = base_vision;
            this.state.vision_source[1][2] = base_vision;
            this.swarm_no_update();
            this.swarm_no_update();
            for (var k=0;k<missionNum[this.state.mission];k++) {
                const misx = getRandomInt(gridsize-missionsize[this.state.mission+100])+3-missionsize[this.state.mission+100];
                const misy = getRandomInt(gridsize-missionsize[this.state.mission+100])+3-missionsize[this.state.mission+100];
                console.log(misx, misy)
                for (var i=0;i<missionsize[this.state.mission+100];i++) {
                    for (var j=0;j<missionsize[this.state.mission+100];j++) {
                        this.state.grid[misx+i][misy+j] = this.state.mission;
                        this.state.vision_source[misx+i][misy+j] = 0;
                    }
                }
            }
            this.bossspawn();
        }
        document.title = "Rock & Stone";
    }

    activate() {
        const ref = [
            ()=>false,
            (i:number,j:number) => {
                if (this.state.grid[i][j] === this.state.mission) {
                    for (var x=-1;x<=1;x++) {
                        for (var y=-1;y<=1;y++) {
                            if (x+i<0 || x+i>=gridsize+2 || y+j<0 || y+j>=gridsize+2) {
                                continue;
                            }
                            if (cavegen.get(this.state.grid[x+i][y+j])! == 'morkite') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            (i:number,j:number) => {
                if (this.state.grid[i][j] == this.state.mission) {
                    for (var x=-1;x<=1;x++) {
                        for (var y=-1;y<=1;y++) {
                            if (x+i<0 || x+i>=gridsize+2 || y+j<0 || y+j>=gridsize+2) {
                                continue;
                            }
                            if (pc.includes(this.state.creature[x+i][y+j]) && this.state.players[this.state.creature[x+i][y+j]-1][0] > 0) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            (i:number,j:number) => false,
            (i:number,j:number) => {
                if (i===gridsize+1 || j===gridsize+1) {
                    return false;
                } else {
                    var ct:number = 0;
                    var tl:number = 0;
                    const pt = [this.state.mission]
                    ct += pc.includes(this.state.creature[i][j])?1:0;
                    ct += pc.includes(this.state.creature[i+1][j])?1:0;
                    ct += pc.includes(this.state.creature[i][j+1])?1:0;
                    ct += pc.includes(this.state.creature[i+1][j+1])?1:0;
                    tl += pt.includes(this.state.grid[i][j])?1:0;
                    tl += pt.includes(this.state.grid[i][j])?1:0;
                    tl += pt.includes(this.state.grid[i][j])?1:0;
                    tl += pt.includes(this.state.grid[i][j])?1:0;
                    return tl === 4 && ct === pc.length;
                }
            },
            (i:number, j:number) => {
                return this.state.grid[i][j] === this.state.mission;
            },
            (i:number, j:number) => {
                return this.state.grid[i][j] === this.state.mission;
            },
            (i:number, j:number) => {
                return false;
            },
        ];
        const rev: Map<string, number> = new Map([['rescue M.U.L.E',(gridsize+2)*(gridsize+2)-3], ['hack rival company',(gridsize+2)*(gridsize+2)-8]]);
        const action = [
            ()=>{},
            () => {
                this.state.ores[2] += 1;
                this.setState({turnCount: this.state.turnCount+2, ores: this.state.ores});
            },
            () => {
                this.state.ores[2] += 1;
                this.setState({turnCount: this.state.turnCount+2, ores: this.state.ores});
            },
            ()=>{},
            () => {
                if (this.state.turnCount % 2 === 0) {
                    this.state.ores[2] += 1;
                    const newgrid = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => (j===0 || i===0 || j===gridsize+1 || i===gridsize+1 ? 600 : getRandomInt(randmax))));            
                    var mx = this.state.player_position[0][0];
                    var my = this.state.player_position[0][1];
                    for (var i=0;i<pc.length;i++) {
                        const pos = this.state.player_position[i];
                        if (pos[0] < mx) {
                            mx = pos[0];
                        }
                        if (pos[1] < my) {
                            my = pos[1];
                        }
                    }
                    const mnx = mx;
                    const mny = my;
                    newgrid[mnx][mny] = this.state.mission;
                    newgrid[mnx][mny+1] = this.state.mission;
                    newgrid[mnx+1][mny] = this.state.mission;
                    newgrid[mnx+1][mny+1] = this.state.mission;
                    const newcre = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => 0));
                
                const newmon = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => [-1,-1]));
                for (var i=0; i< gridsize+2; i++) {
                    for (var j=0; j< gridsize+2; j++) {
                        const type = monsterspawnmap.get(getRandomInt(randmax));
                        if (type) {
                            if (newcre[i][j] > 0 || !npc.includes(type)) {
                                continue;
                            }
                            newcre[i][j] = type;
                            newmon[i][j] = [defaultnpcHP[type-10], defaultnpcHP[type-10]];
                        }
                        const type2 = monsterspawnmap.get(getRandomInt(randmax));
                        if (type2) {
                            if (newcre[i][j] > 0 || !npc.includes(type2)) {
                                continue;
                            }
                            newcre[i][j] = type2;
                            newmon[i][j] = [defaultnpcHP[type2-10], defaultnpcHP[type2-10]];
                        }
                    }
                }
                newcre[mnx][mny] = 1;
                newcre[mnx][mny+1] = 2;
                newcre[mnx+1][mny] = 3;
                const newvis = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => -1));
                newvis[mnx][mny] = base_vision;
                newvis[mnx][mny+1]  = base_vision;
                newvis[mnx+1][mny] = base_vision;
                    this.setState({creature: newcre, vision_source:newvis, monsterHP:newmon, turnCount: 11, ores:this.state.ores, grid: newgrid});
                }
            },
            () => {
                this.state.ores[0] += 10;
                this.setState({turnCount: 10, ores: this.state.ores});
            },
            () => {
                this.state.ores[2] += 5;
                this.setState({turnCount: 10, ores: this.state.ores});
            },
            () => {}
        ];
        
        var res:number = 0;
        for (var i=0;i<gridsize+2;i++) {
            for (var j=0;j<gridsize+2;j++) {
                res += ((ref[this.state.mission+100](i,j)) ? 1 : 0);
            }
        }
        const fin:boolean = (rev.get((mission[this.state.mission+100]))? ((gridsize+2)*(gridsize+2)-rev.get(mission[this.state.mission+100])!):0) < (rev.get((mission[this.state.mission+100]))?(gridsize+2)*(gridsize+2)-res :res);
        if (fin) {
            action[this.state.mission+100]();
        }
    }

    win(mis: number) {
        return this.state.ores[0] + this.state.ores[2] * 3 >= mis * 30 + 15;
    }

    downloadSaveFile () {
        const myData = this.state;
      
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
    
    swarm_no_update() {
        for (var i=0; i< gridsize+2; i++) {
            for (var j=0; j< gridsize+2; j++) {
                const monster = monsterspawnmap.get(getRandomInt(randmax));
                if (monster) {
                    this.spawn_monster_no_update(monster, i, j);
                }
            }
        }
    }

    swarm() {
        this.swarm_no_update();
        this.forceUpdate();
    }

    spawn_monster_no_update(type: number, i: number, j: number) {
        if (this.state.creature[i][j] > 0 || !npc.includes(type)) {
            return
        }
        this.state.creature[i][j] = type;
        this.state.monsterHP[i][j] = [defaultnpcHP[type-10], defaultnpcHP[type-10]];
    }

    spawn_monster(type: number, i: number, j: number) {
        this.spawn_monster_no_update(type, i, j);
        this.forceUpdate();
    }

    despawn_monster(i: number, j: number) {
        if (this.state.creature[i][j] <= 0 || (!npc.includes(this.state.creature[i][j])) && !boss.includes(this.state.creature[i][j])) {
            return
        }
        this.state.select_creature[0] = -1;
        this.state.select_creature[1] = -1; 
        this.state.monsterHP[i][j][0] = -1;
        this.state.monsterHP[i][j][1] = -1;
        this.state.creature[i][j] = 0;
        this.forceUpdate();
    }

    drop_pod() {
        const x = getRandomInt(gridsize+2);
        const y = getRandomInt(gridsize+2);
        var x1 = x-1;
        var y1 = y-1;
        if (x1 < 0) {
            x1 = x+1;
        }
        if (y1 < 0) {
            y1 = y+1;
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
    }

    find_path(i: number, j: number, x: number, y: number) {
        var dir: number[] = [Math.sign(x-i), Math.sign(y-j)];
        var cur: number[] = [x, y];
        while(dir[0] !== 0 || dir[1] !== 0) {
            cur[0] -= dir[0];
            cur[1] -= dir[1];
            dir = [Math.sign(cur[0]-i), Math.sign(cur[1]-j)]
            if (this.state.creature[cur[0]][cur[1]] > 0) {
                return randmax;
            }
        }
        return distance([i,j],[x,y]);
    }

    detect_path(player: number, x: number, y: number) {
        const p: number[] = this.state.player_position[player-1];
        const possible = [
            [p[0]-1, p[1]-1],
            [p[0]-1, p[1]+1],
            [p[0]-1, p[1]],
            [p[0], p[1]-1],
            [p[0], p[1]+1],
            [p[0]+1, p[1]-1],
            [p[0]+1, p[1]+1],
            [p[0]+1, p[1]],
        ];
        var lowest: number = randmax;
        var res: number = -1;
        for (var i=0; i<possible.length; i++) {
            const dest = possible[i];
            if (dest[0]<=-1 || dest[1]<=-1 || dest[0] == gridsize+2 || dest[1] >= gridsize+2) {
                continue
            }
            var a: number = this.find_path(dest[0], dest[1], x, y)
            if (a < lowest) {
                lowest = a;
                res = i;
            }
        }
        return res == -1 ? [-1, -1] : possible[res];
    }

    step_monster(x: number[], dest: number[]) {
        var dir: number[] = [Math.sign(-dest[0]+x[0]), Math.sign(-dest[1]+x[1])];
        var cur: number[] = [x[0], x[1]];
        var speed: number = speedNPC[this.state.creature[x[0]][x[1]]-10];
        while((dir[0] !== 0 || dir[1] !== 0) && this.state.creature[cur[0]-dir[0]][cur[1]-dir[1]] <= 0 && speed > 0) {
            cur[0] -= dir[0];
            cur[1] -= dir[1];
            dir = [Math.sign(cur[0]-dest[0]), Math.sign(cur[1]-dest[1])];
            speed--;
        }
        if (cur[0] !== x[0] || cur[1] !== x[1]) {
            this.state.creature[cur[0]][cur[1]] = this.state.creature[x[0]][x[1]]
            this.state.monsterHP[cur[0]][cur[1]][0] = this.state.monsterHP[x[0]][x[1]][0]
            this.state.monsterHP[cur[0]][cur[1]][1] = this.state.monsterHP[x[0]][x[1]][1]        
            this.state.select_creature[0] = -1;
            this.state.select_creature[1] = -1;
            this.state.monsterHP[x[0]][x[1]][0] = -1;
            this.state.monsterHP[x[0]][x[1]][1] = -1;
            this.state.creature[x[0]][x[1]] = 0;
            this.forceUpdate();
        }
        return cur;
    }

    attack(x: number, y: number, p: number) {
        const roll = 1 + getRandomInt(6);
        if (creaturegen.get(this.state.creature[x][y]) == "exploder") {
            this.despawn_monster(x, y);
        }
        if (roll >= 4) {
            this.state.players[p-1][0] -= 1;
            alert((creaturegen.get(this.state.creature[x][y])?creaturegen.get(this.state.creature[x][y]):'exploder')+" hit "+creaturegen.get(p)+(roll === 6 ? (' critically, '+creaturegen.get(p)+' gain the effect of '+criteffect[this.state.creature[x][y]-10]): '.'));
            this.forceUpdate();
        }
    }

    move_monster(x: number, y: number) {
        var disrange: number[] = pc.toSorted((k1: number, k2: number) => getRandomInt(10)*0.1 + distance([x,y], this.state.player_position[k1-1])-distance([x,y], this.state.player_position[k2-1]));
        for (var p=0; p<disrange.length; p++) {
            if (distance([x,y], this.state.player_position[disrange[p]-1]) <= rangeMonster[this.state.creature[x][y]-10]) {
                this.attack(x, y, disrange[p]);
                return [x,y]
            } else {
                const dest: number[] = this.detect_path(disrange[p], x, y);
                if (dest[0]<=-1 || dest[1]<=-1 || dest[0] == gridsize+2 || dest[1] >= gridsize+2) {
                    continue
                } else {
                    return this.step_monster([x,y],dest)
                }
            }
        }
        return [x,y]
    }

    newmis(mis: number) {
        const newgrid = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => (j===0 || i===0 || j===gridsize+1 || i===gridsize+1 ? 600 : getRandomInt(randmax))));
                newgrid[1][1] = 0;
                newgrid[2][1] = 0;
                newgrid[1][2] = 0;
                newgrid[2][2] = 0;
                const newcre = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => 0));
                newcre[1][1] = 1;
                newcre[2][1] = 2;
                newcre[1][2] = 3;
                const newvis = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => -1));
                newvis[1][1] = base_vision;
                newvis[2][1] = base_vision;
                newvis[1][2] = base_vision;
                const newmon = Array.from({ length: gridsize+2 }, (_: number, i: number) => Array.from({ length: gridsize+2 }, (_: number, j: number) => [-1,-1]));
                for (var i=0; i< gridsize+2; i++) {
                    for (var j=0; j< gridsize+2; j++) {
                        const type = monsterspawnmap.get(getRandomInt(randmax));
                        if (type) {
                            if (newcre[i][j] > 0 || !npc.includes(type)) {
                                continue;
                            }
                            newcre[i][j] = type;
                            newmon[i][j] = [defaultnpcHP[type-10], defaultnpcHP[type-10]];
                        }
                        const type2 = monsterspawnmap.get(getRandomInt(randmax));
                        if (type2) {
                            if (newcre[i][j] > 0 || !npc.includes(type2)) {
                                continue;
                            }
                            newcre[i][j] = type2;
                            newmon[i][j] = [defaultnpcHP[type2-10], defaultnpcHP[type2-10]];
                        }
                    }
                }
                for (var k=0;k<missionNum[mis+100];k++) {
                    const misx = getRandomInt(gridsize-missionsize[mis+100])+3-missionsize[mis+100];
                    const misy = getRandomInt(gridsize-missionsize[mis+100])+3-missionsize[mis+100];
                    for (var i=0;i<missionsize[mis+100];i++) {
                        for (var j=0;j<missionsize[mis+100];j++) {
                            newgrid[misx+i][misy+j] = mis;
                            newvis[misx+i][misy+j] = 0;
                        }
                    }
                }
                const iii = Math.floor((gridsize+2)/3*2) + getRandomInt(Math.floor((gridsize+2)/4));
                const jjj = Math.floor((gridsize+2)/3*2) + getRandomInt(Math.floor((gridsize+2)/4));
                if (mission[mis+100] == 'golden dreadnought') {
                    newcre[iii][jjj] = 100;
                    newmon[iii][jjj] = [bossHP[0], bossHP[0]];
                } 
                if (mission[mis+100] == 'the caretaker') {
                    newcre[iii][jjj] = 101;
                    newmon[iii][jjj] = [bossHP[1], bossHP[1]];       
                }
                this.setState({
                    grid: newgrid,
                    creature: newcre,
                    control: 1,
                    player_position: [[1,1],[2,1],[1,2]],
                    select_creature: [-1, -1],
                    select_grid: [-1, -1],
                    vision_source: newvis,
                    weapon: -1,
                    special: Array.from(pc, () => [-1,-1]),
                    monsterHP: newmon,
                    turnCount: 1,
                });
    }

    checkwin() {
        var dropped: boolean = true;
        for (var i=0;i<pc.length;i++) {
            const pos = this.state.player_position[i];
            dropped = dropped && cavegen.get(this.state.grid[pos[0]][pos[1]]!) == 'drop pod';
        }
        if (dropped) {
            if (this.win(this.state.mission-100)) {
                var mes: string = 'Mission success! Retrieving minerals...\n';
                for (var i=0;i<ore.length;i++) {
                    mes += ore[i]+': '+this.state.ores[i].toString()+'\n';
                }
                alert(mes);
            } else {
                this.newmis(this.state.mission)
                alert("You have yet to satisfy the mission quota, continue your good work!");
            }
        }
    }

    move_player(num: number, i: number, j: number) {
        if (cavegen.get(this.state.grid[i][j]) && (cavegen.get(this.state.grid[i][j]) === 'wall' || ore.includes(cavegen.get(this.state.grid[i][j])!))) {
            this.mine(i, j);
        }
        const x = this.state.player_position[num-1][0];
        const y = this.state.player_position[num-1][1];
        this.state.player_position[num-1][0] = i;
        this.state.player_position[num-1][1] = j;
        this.state.creature[i][j] = num;
        this.state.creature[x][y] = 0;
        this.state.vision_source[i][j] = base_vision;
        this.state.vision_source[x][y] = -1;
        this.state.select_creature[0] = i;
        this.state.select_creature[1] = j;
        this.checkwin();
        this.forceUpdate();
    }

    mine(i: number, j: number) {
        const mined = cavegen.get(this.state.grid[i][j])
        this.state.grid[i][j] = 0;
        if (mined && ore.includes(mined!)) {
            if (mined == 'egg') {
                this.setState({turnCount: 10});
            }
            this.state.ores[ore.indexOf(mined)]++;
            this.forceUpdate();
        }
    }

    checkvision(i: number, j: number) {
        for (var ii=0; ii<gridsize+2; ii++) {
            for (var jj=0; jj<gridsize+2; jj++) {
                if (this.state.vision_source[ii][jj]>= distance([ii, jj], [i, j])) {
                    return true
                }
            }
        }
        return false
    }

    resupply(player: number) {
        for (var i=1; i<=4; i++) {
            this.state.players[player-1][i*2] += Math.ceil(this.state.players[player-1][i*2+1] / 2);
            this.state.players[player-1][i*2] = Math.min(this.state.players[player-1][i*2], this.state.players[player-1][i*2+1])
        }
        this.forceUpdate();
    }

    useweapon(player: number, type: number) {
        if (this.state.weapon !== type) {
            this.setState({weapon: type});
            this.forceUpdate();
        } else {
            this.setState({weapon: -1});
        }
    }

    fireweapon(i: number, j: number) {
        if (this.state.weapon <= 0) {
            return
        } else if (this.state.weapon === 4) {
            this.state.players[this.state.control-1][this.state.weapon*2] -= 1;
            this.state.vision_source[i][j] = this.state.control === 1 ? 4 : 0;
            if (this.state.control === 1) {
                if (this.state.special[0][0] === -1 && this.state.special[0][1] === -1) {
                    this.state.special[0] = [i, j];
                } else if (this.state.special[1][0] === -1 && this.state.special[1][1] === -1) {
                    this.state.special[1] = [i, j];
                } else {
                    const remove = this.state.special[0];
                    this.state.special[0] = this.state.special[1];
                    this.state.special[1] = [i, j];
                    this.state.vision_source[remove[0]][remove[1]] = -1;
                } 
            } else {
                if (this.state.players[this.state.control-1][this.state.weapon*2]>0 && !(this.state.control-1 === 1 && this.state.control-1 ===3)) {
                    this.state.players[this.state.control-1][this.state.weapon*2] -= 1;
                }
                this.state.special[this.state.control] = [i, j];
            }
        }
        this.forceUpdate();
    }

    loadFile(target: HTMLInputElement) {
        const reader = new FileReader();
        const that = this;
        reader.readAsText(target.files!.item(0)!);
        reader.onload = function() {
            const dec = new TextDecoder("utf-8");
            const res = reader.result!;
            that.setState(JSON.parse(typeof(res) == 'string'? res: dec.decode(res)));
            that.forceUpdate();
        };
    }

    bossspawn() {
        const i = Math.floor((gridsize+2)/3*2) + getRandomInt(Math.floor((gridsize+2)/4));
        const j = Math.floor((gridsize+2)/3*2) + getRandomInt(Math.floor((gridsize+2)/4));
        if (mission[this.state.mission+100] == 'golden dreadnought') {
            this.state.creature[i][j] = 100;
            this.state.monsterHP[i][j] = [bossHP[0], bossHP[0]];
        } 
        if (mission[this.state.mission+100] == 'the caretaker') {
            this.state.creature[i][j] = 101;
            this.state.monsterHP[i][j] = [bossHP[1], bossHP[1]];       
        }
    }

    bossact(x: number, y: number) {
        const bossAction = [
            ()=>{
                var disrange: number[] = pc.toSorted((k1: number, k2: number) => getRandomInt(10)*0.1 + distance([x,y], this.state.player_position[k1-1])-distance([x,y], this.state.player_position[k2-1]));
                for (var i=0;i<pc.length;i++) {
                    const tg = this.state.player_position[disrange[i]-1];
                    if (cavegen.get(this.state.grid[tg[0]][tg[1]])=='floor') {
                        this.state.grid[tg[0]][tg[1]] = getRandomInt(10)<3?920:600;
                        return
                    }
                }
            },
            ()=>{
                var disrange: number[] = pc.toSorted((k1: number, k2: number) => getRandomInt(10)*0.1 + distance([x,y], this.state.player_position[k1-1])-distance([x,y], this.state.player_position[k2-1]));
                for (var i=0;i<pc.length;i++) {
                    const tg = this.state.player_position[disrange[i]-1];
                    const tg1 = [tg[0]+1, tg[1]];
                    const tg2 = [tg[0]-1, tg[1]];
                    const tg3 = [tg[0], tg[1]+1];
                    const tg4 = [tg[0]+1, tg[1]+1];
                    const tg5 = [tg[0]-1, tg[1]+1];
                    const tg6 = [tg[0], tg[1]-1];
                    const tg7 = [tg[0]-1, tg[1]-1];
                    const tg8 = [tg[0]+1, tg[1]-1];
                    const tgs = [tg1,tg2,tg3,tg4,tg5,tg6,tg7,tg8];
                    for (var j=0;j<8;j++) {
                        if (this.state.creature[tgs[i][0]][tgs[i][1]]<=0) {
                            this.spawn_monster_no_update(10+getRandomInt(npc.length),tgs[i][0],tgs[i][1]);
                            return;
                        }
                    }
                }
            }
        ]
        if (this.checkvision(x, y)) {
            if (mission[this.state.mission+100] == 'golden dreadnought') {
                bossAction[0]();
            } 
            if (mission[this.state.mission+100] == 'the caretaker') {
                bossAction[1]();      
            }
            this.forceUpdate();
        }
    }

    render() {
        return <div style={{margin: 'max(30px, 6%) max(30px, 6%) max(30px, 6%) max(30px, 6%)', width: 50*gridsize + 650, height: 50*gridsize + 300}}>
            <h3>MISSON: {mission[this.state.mission+100] ? mission[this.state.mission+100] : 'Mine Morkite'} [Turn Count: {this.state.turnCount} / {10-this.state.ores[3]*2}]</h3>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                <div style={{backgroundColor: '#222222', borderRadius: 10, padding: '20px, 20px, 20px, 20px', width: 50*gridsize+120, aspectRatio: '1/1', position: 'relative'}}>
                    {this.state.grid.map(
                        (x: number[], i: number) => {
                            return x.map(
                                (y: number, j: number) => {
                                    if (!this.checkvision(i, j)) {
                                        return ''
                                    }
                                    return <div key={i*gridsize+j} onContextMenu={(e) => {
                                        e.preventDefault();
                                        if (this.state.select_creature[0] === -1 || this.state.select_creature[1] === -1) {
                                            return
                                        }
                                        if ((this.state.select_grid[0] !== i || this.state.select_grid[1] !== j) || this.state.control !== this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) {
                                            return;
                                        } else {
                                            if (cavegen.get(this.state.grid[i][j]) == 'floor') {
                                                this.state.grid[i][j] = this.state.mission;
                                            } else {
                                                this.state.grid[i][j] = 0;
                                            }
                                            this.forceUpdate();
                                        }
                                    }} onClick={
                                        () => {
                                            if (this.state.select_creature[0] === -1 || this.state.select_creature[1] === -1) {
                                                return
                                            }
                                            if ((this.state.select_grid[0] !== i || this.state.select_grid[1] !== j) || this.state.control !== this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) {
                                                this.setState({select_grid: [i, j]});
                                            } else {
                                                if (this.state.weapon > 0) {
                                                    this.fireweapon(i, j);
                                                    this.setState({weapon: -1});
                                                } else {
                                                    this.move_player(this.state.control, i, j);
                                                }
                                            }
                                        }
                                    } style={{width:46, height:46, backgroundColor: colormap.get(cavegen.get(y)!), borderRadius: '8%', border: '2px '+(this.state.select_grid[0]===i&&this.state.select_grid[1]===j? 'orange' : 'black')+' solid', position:'absolute', top: i*50+10, left: j*50+10}}>
                                        {mapimage.get(cavegen.get(y)!)? <div style={{borderRadius:'30%', border: '5px rgba(0,0,0,0) solid', height: '42px', width: '42px'}}><img src={mapimage.get(cavegen.get(y)!)} width='36px' style={{borderRadius: '30%'}}></img></div>: ''}
                                    </div>
                                }
                            )
                        }
                    )}
                    {this.state.creature.map(
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
                                            if (npc.includes(y) || boss.includes(y)) {
                                                if (this.state.weapon > 0) {
                                                    this.fireweapon(i, j);
                                                    this.setState({weapon: -1});
                                                }
                                            }
                                        }
                                    } key={i*gridsize+j} style={{cursor: 'pointer', lineHeight: '42px', textAlign: 'center', width:42, height:42, backgroundColor: creaturemap.get(creaturegen.get(y)!), border: '4px '+(this.state.select_creature[0]===i&&this.state.select_creature[1]===j ? 'orange' : 'black')+' solid', position:'absolute', top: i*50+10, left: j*50+10, borderRadius: '50%'}}>
                                        {creaturegen.get(y)? <img src={creatureimage.get(creaturegen.get(y)!)} style={{verticalAlign: 'middle'}} width={pc.includes(y)? '42px' : '38px'}></img> : ''}
                                    </div> : '';
                                }
                            )
                        }
                    )}
                    {this.state.special.map(
                        (x: number[], i: number) => {
                            if (x[0] === -1 || x[1] === -1) {
                                return ''
                            }
                            return <img width='10px' key={i.toString()+'special'} src={'./assets/special'+i.toString()+'.png'} onClick={()=>{
                                this.state.vision_source[this.state.special[i][0]][this.state.special[i][1]] = -1;
                                this.state.special[i] = [-1, -1];
                                this.forceUpdate();
                            }} style={{cursor: 'crosshair', position:'absolute', top: x[0]*50+30, left: x[1]*50+30}}></img>
                        }
                    )}
                </div>
                {this.state.select_creature[0] !== -1 && this.state.select_creature[1] !== -1 && pc.includes(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) ? 
                <div style={{width: 400, height: 300, border: '7px #222222 solid' , backgroundColor: '#b6b6b6', position:'absolute', top: 0, left: gridsize*50+150, borderRadius: 10}}>
                    <div style={{position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div onClick={() => {
                            if (this.state.ores[1] > 0) {
                                this.resupply(this.state.control);
                                this.state.ores[1] -= 1;
                                this.forceUpdate();
                            }
                        }} style={{cursor: 'pointer', margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(this.state.control)!)}}>
                            <img src={creatureimage.get(creaturegen.get(this.state.control)!)} width='100%'></img>
                        </div>
                        <div style={{margin: 0, width: 80, height: 80, display: 'inline', fontSize: 20}}>
                            <b>{creaturegen.get(this.state.control)}</b>
                            <br/>
                            HP: {this.state.players[this.state.control-1][0]}/{this.state.players[this.state.control-1][1]}
                            <div onClick={() => {
                                this.state.players[this.state.control-1][0] = Math.min(this.state.players[this.state.control-1][0]+1, this.state.players[this.state.control-1][1]);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>+</span></div>
                            <div onClick={() => {
                                this.state.players[this.state.control-1][0] = Math.max(this.state.players[this.state.control-1][0]-1, 0);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>-</span></div>
                        </div>
                    </div>
                    <div style={{marginLeft: 25, marginTop: 10}}><b>Weapon Slot</b></div>
                    <div style={{marginTop: 10, marginLeft: 20, width: 350, height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {[1,2,3,4].map((x: number) => <div key={x.toString()+'weapnimg'} onClick={() => {
                            if (this.state.players[this.state.control-1][x*2] > 0) {
                                this.useweapon(this.state.control, x);
                            }
                        }} style={{textAlign: 'center', cursor: 'pointer', lineHeight: '70px', border: '5px '+ (this.state.weapon === x ? 'orange' : 'black') +' solid', marginLeft: 5, width: 75, height: 75, borderRadius: '30%', backgroundColor: creaturemap.get(creaturegen.get(this.state.control)!)}}>
                            <img src={'./assets/weapon'+this.state.control.toString()+x.toString()+'.png'} width='80%' style={{verticalAlign: 'middle'}}></img>
                        </div>)}
                    </div>
                    <div style={{marginTop: 0, marginLeft: 20, width: 350, height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {[1,2,3,4].map((x: number) => <div key={x.toString()+'weapnname'} style={{margin: 5, width: 80, height: 30, textAlign: 'center'}}>
                            {this.state.players[this.state.control-1][x*2]}/{this.state.players[this.state.control-1][x*2+1]}
                        </div>)}
                    </div>
                </div>: (this.state.select_creature[0] !== -1 && this.state.select_creature[1] !== -1 && npc.includes(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) ? 
                <div style={{width: 400, height: 200, border: '7px #222222 solid' , backgroundColor: '#b6b6b6', position:'absolute', top: 0, left: gridsize*50+150, borderRadius: 10}}>
                    <div style={{position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])!)}}>
                            <img src={creatureimage.get(creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])!)} width='100%'></img>
                        </div>
                        <div style={{margin: 0, width: 80, height: 80, display: 'inline', fontSize: 20}}>
                            <b>{creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])}</b>
                            <br/>
                            HP: {this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]}/{this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][1]}
                            <br/>
                            Armor: {armorNPC[this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]-10]}
                            <div onClick={() => {
                                this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0] = Math.min(this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]+1, this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][1]);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>+</span></div>
                            <div onClick={() => {
                                this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0] = Math.max(this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]-1, 0);
                                this.forceUpdate();
                            }} style={{position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>-</span></div>
                        </div>
                    </div>
                    <div onClick={()=>{
                        this.despawn_monster(this.state.select_creature[0], this.state.select_creature[1])
                    }} style={{cursor: 'pointer', position: 'relative', margin: 'auto', width: '80%', height: '30px', backgroundColor: '#990000', marginTop: '20px', textAlign: 'center', lineHeight: '30px' ,borderRadius: '15px'}}><b>Remove</b></div>
                </div>: 
            (this.state.select_creature[0] !== -1 && this.state.select_creature[1] !== -1 && boss.includes(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]) ? 
            <div style={{width: 400, height: 200, border: '7px #222222 solid' , backgroundColor: '#b6b6b6', position:'absolute', top: 0, left: gridsize*50+150, borderRadius: 10}}>
                <div style={{position: 'relative', marginTop: 20, marginLeft: 20, width: 350, height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div style={{margin: 20, marginLeft: 5, border: '7px black solid', width: 80, height: 80, borderRadius: '50%', backgroundColor: creaturemap.get(creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])!)}}>
                        <img src={creatureimage.get(creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])!)} width='100%'></img>
                    </div>
                    <div style={{margin: 0, width: 100, height: 80, display: 'inline', fontSize: 20}}>
                        <b>{creaturegen.get(this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]])}</b>
                        <br/>
                        HP: {this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]}/{this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][1]}
                        <br/>
                        Armor: {bossArmor[this.state.creature[this.state.select_creature[0]][this.state.select_creature[1]]-100]}
                        <div onClick={() => {
                            this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0] = Math.min(this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]+1, this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][1]);
                            this.forceUpdate();
                        }} style={{position: 'absolute', bottom: 10, right: 30, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>+</span></div>
                        <div onClick={() => {
                            this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0] = Math.max(this.state.monsterHP[this.state.select_creature[0]][this.state.select_creature[1]][0]-1, 0);
                            this.forceUpdate();
                        }} style={{position: 'absolute', bottom: 10, right: 0, cursor: 'pointer', borderRadius: '50%', width: 25, height: 25, backgroundColor: "#727272", lineHeight: '13px', textAlign: 'center'}}><span style={{verticalAlign: 'middle'}}>-</span></div>
                    </div>
                </div>
                <div onClick={()=>{
                    this.state.ores[0] += 30;
                    this.despawn_monster(this.state.select_creature[0], this.state.select_creature[1]);
                    this.forceUpdate();
                }} style={{cursor: 'pointer', position: 'relative', margin: 'auto', width: '80%', height: '30px', backgroundColor: '#990000', marginTop: '20px', textAlign: 'center', lineHeight: '30px' ,borderRadius: '15px'}}><b>Remove</b></div>
            </div>: ''))}
                <div onClick={() => {
                    if (this.state.turnCount < Math.max(period-Math.min(4, this.state.ores[4]*2), 2)) {
                        var moved: number[] = [];
                        for (var i=0; i<gridsize+2; i++) {
                            for (var j=0; j<gridsize+2; j++) {
                                if (npc.includes(this.state.creature[i][j]) && this.checkvision(i,j) && (!moved.includes(i*(gridsize+2)+j))) {
                                    const dest = this.move_monster(i, j);
                                    moved.push(dest[0]*(gridsize+2)+dest[1]);
                                } else if (boss.includes(this.state.creature[i][j])) {
                                    this.bossact(i,j);
                                }
                            }
                        }
                        this.setState({turnCount: this.state.turnCount + 1});
                    } else {
                        this.swarm();
                        this.setState({turnCount: 1});
                    }
                    this.activate();
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
                <div onClick={() => {
                    this.newmis((this.state.mission + 101)%mission.length - 100);
                    this.setState({mission: (this.state.mission + 101)%mission.length - 100});
                }}style={{width: 130, height: 50, border: '7px #442222 solid', cursor: 'pointer', backgroundColor: '#332222', position:'absolute', top: 630, left: gridsize*50+150, borderRadius: 10, lineHeight: '50px', textAlign: 'center', color: 'red'}}><b>Next Mission</b></div>
                
            </div>
            <h3>Loot</h3>
            <div style={{paddingRight: 20, backgroundColor: '#222222', display: 'flex', flexDirection: 'row', overflowX: 'scroll', alignItems: 'center', marginBottom: 'max(30px, 6%)', borderRadius: 10, padding: '20px, 20px, 20px, 20px', width: 50*gridsize+120, height: '200px', position: 'relative'}}>
                {ore.map( 
                    (x: string, i: number) => {
                        return <div key={i.toString()+'ore'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 150, flexShrink: 0, aspectRatio: 1, marginLeft: 20, borderRadius: 10, backgroundColor: '#555555'}}>
                            <img src={mapimage.get(ore[i])} width='60%' style={{marginTop: '10%', marginBottom: '5%', borderRadius: '30%'}}></img>
                            <div>
                                <b>{ore[i]}:</b> {this.state.ores[i]}
                            </div>
                        </div>
                    }
                )}
            </div>
        </div>
    }
}
 
export default Demo;