document.body.innerHTML += `<div style={{margin: 'max(30px, 6%) max(30px, 6%) max(30px, 6%) max(30px, 6%)', width: 50*gridsize + 650, height: 50*gridsize + 300}}>
            <h3>Cave [Turn Count: {this.state.turnCount}]</h3>
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
                                            this.state.grid[i][j] = 0;
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
                                            if (npc.includes(y)) {
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
                </div>: '')}
                <div onClick={() => {
                    if (this.state.turnCount < period-Math.min(4, this.state.ores[4]*2)) {
                        var moved: number[] = [];
                        for (var i=0; i<gridsize+2; i++) {
                            for (var j=0; j<gridsize+2; j++) {
                                if (npc.includes(this.state.creature[i][j]) && this.checkvision(i,j) && (!moved.includes(i*(gridsize+2)+j))) {
                                    const dest = this.move_monster(i, j);
                                    moved.push(dest[0]*(gridsize+2)+dest[1]);
                                }
                            }
                        }
                        this.setState({turnCount: this.state.turnCount + 1});
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
                                <b>{ore[i]}:</b> {this.state.ores[i]}
                            </div>
                        </div>
                    }
                )}
            </div>
        </div>`;