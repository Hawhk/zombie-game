
class Game extends StillObject {
    constructor () {
        super(width/2, height/2, 1, 1);
        let {w, h} = this.getFireSize();
        w *= 2;
        h *= 2;
        let pX = random(w, width - w);
        let pY = random(h, height - h);
        this.player = new Player(pX, pY);
        this.zombies = [];
        this.nrOfZombies = 1;

        this.round = 0;
        this.lost = false;
        this.paused = false;

        this.drops = [];
        this.dropsAvailable = [Ammo, Health, Bomb];

        this.dropsAvailable.forEach(drop => {
            drop.game = this;
            let time = this.getDropTime();
            drop.setTimer(random(time/2, time * 2));
        });
        this.timer = null;
        this.nextRound();
    }

    nextRound () {
        this.round++;
        this.spawnZombies();
        Game.playSound();
        this.addRandomDrop();
    }

    update () {
        this.show();
        if (!this.lost && focused) {
            if (this.paused) {
                this.paused = false;
                this.dropsAvailable.forEach(drop => {
                    drop.timer.resume();
                });
                if (this.timer) {
                    this.timer.resume();
                }
                let bombs = this.player.bombs;
                for (let i = 0; i < bombs.length; i++) {
                    let bomb = bombs[i];
                    if (bomb.placed) {
                        bomb.timer.resume();
                        let timerSound = bomb.timerSound;
                        if (timerSound.paused) {
                            timerSound.sound.play();
                            timerSound.paused = false;
                        }
                    } else {
                        break;
                    }
                }
            }

            for(let i = this.drops.length - 1; i >= 0; i--) {
                let drop = this.drops[i];
                drop.update(this.player);
            }

            this.player.update(this.getFireSize(), this.zombies);
            
            this.zombies.forEach(zombie => {
                zombie.move(this.player);
            });
            Zombie.separate(this.zombies);
            this.zombies.forEach(zombie => {
                zombie.show(this.player);
            });
            this.zombieCheckRemove();

            this.player.show();
            this.playerStats();
            this.lost = this.player.hp <= 0;

            if (this.zombies.length === 0 && this.timer === null) {
                this.timer = new Timer(() => {
                    this.nextRound();
                    this.timer = null;
                }, 5000);
            }
        } else if (!focused) {
            if (!this.paused) {
                this.paused = true;
                this.dropsAvailable.forEach(drop => {
                    drop.timer.pause();
                });
                if (this.timer) {
                    this.timer.pause();
                }
                let bombs = this.player.bombs;
                for (let i = 0; i < bombs.length; i++) {
                    let bomb = bombs[i];
                    if (bomb.placed) {
                        bomb.timer.pause();
                        let timerSound = bomb.timerSound;
                        if (timerSound.sound.isPlaying()) {
                            timerSound.sound.pause();
                            timerSound.paused = true;
                        }
                    } else {
                        break;
                    }
                }
                
            }
        } else {
            this.loseText();
            this.dropsAvailable.forEach(drop => {
                drop.cleartimer();
            });
        }
    }

    spawnZombies () {
        let nrOfZombies = fib(this.round);
        let {w, h} = this.getFireSize();
        let {x, y} = this.player.getPos();
        w *= 2;
        h *= 2;
        let minDist = width/10;
        for (let i = 0; i < nrOfZombies; i++) {
            let zX = random(w, width - w);
            let zY = random(h, height - h);
            let dist = createVector(zX - x, zY - y).mag();
            while (dist < minDist) {
                zX = random(w, width - w);
                zY = random(h, height - h);
                dist = createVector(zX - x, zY - y).mag();
            }
            let zS = random(0.05, 0.09);
            this.zombies.push(new Zombie(zX, zY, zS, i));
        }
        this.nrOfZombies = nrOfZombies;
    }

    addRandomDrop () {
        this.drops.push((random(this.dropsAvailable)).newDrop());
    }

    zombieCheckRemove () {
        this.zombies = this.zombies.filter(zombie => {
            if (zombie.hp <= 0) {
                this.player.kills++;
                return false;
            }
            return true;
        });
    }

    loseText () {
        push();
        fill("DARKRED");
        textSize(width/20);
        textStyle(BOLD);
        let {w} = this.getFireSize();
        w *= 4;
        text(
            `You died with ${this.player.kills} kill(s) on round ${this.round}`, 
            width/2, height/2, width - w
        );
        pop();
    }

    playerStats () {
        push();
        textSize(width/30);
        textStyle(BOLD);
        fill("Gold");
        let y = height/20;
        let x = width/20;
        if (this.player.ammo > 0) {
            text(this.player.ammo, x, height - y);
        } else {
            text("No ammo", x * 1.5, height - y);
        }
        fill("navy")
        text(this.player.bombs.length, width/2,  height - y);
        fill("red");
        text(this.player.hp, x, y);
        fill(0);
        text(this.round, width - x, height - y);
        pop()
    }

    getFireSize () {
        return {
            w: width/20,
            h: height/14
        }
    }

    getDropTime () {
        let sekunds = 60;
        let milis = 1000;
        if (this.player.kills === 0) {
            return sekunds * milis;
        }
        return milis * sekunds/(this.player.kills/40);
    }

    static loadAllTextures () {
        this.loadTextures();
        Player.loadTextures();
        Zombie.loadTextures();
        Bullet.loadTextures();
        Ammo.loadTextures();
        Health.loadTextures();
        Bomb.loadTextures();
    }

    static loadAllSounds () {
        this.loadSounds();
        Player.loadSounds();
        // Zombie.loadSounds();
        Bullet.loadSounds();
        Ammo.loadSounds();
        Health.loadSounds();
        Bomb.loadSounds();
    }
}
Game.textures = {'game.png':null};
Game.sounds = {'lvl.mp3':{sound:null, volume:VOLUME*3}};