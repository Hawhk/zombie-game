
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
        this.dropsAvailable = [Ammo];

        this.dropsAvailable.forEach(drop => {
            drop.game = this;
            drop.setTimmer();
        });
        this.timer = null;
        this.nextRound();
    }

    nextRound () {
        this.round++;
        let nrOfZombies = fib(this.round);
        let {w, h} = this.getFireSize();
        w *= 2;
        h *= 2;
        for (let i = 0; i < nrOfZombies; i++) {
            let zX = random(w, width - w);
            let zY = random(h, height - h);
            let zS = random(0.05, 0.09);
            this.zombies.push(new Zombie(zX, zY, zS, i));
        }
        Game.playSound();
        this.nrOfZombies = nrOfZombies;
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
            }
            this.drops.forEach(drop => {
                drop.update(this.player);
            });

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
            }
        } else {
            this.loseText();
            this.dropsAvailable.forEach(drop => {
                drop.clearTimmer();
            });
        }
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
        text(`You died with ${this.player.kills} kill(s) on round ${this.round}` , width/2, height/2);
        pop();
    }

    playerStats () {
        push();
        textSize(22);
        textStyle(BOLD);
        fill("Gold");
        if (this.player.ammo > 0) {
            text(this.player.ammo, 30, height - 20);
        } else {
            text("No ammo", 50, height - 20);
        }
        fill("red");
        text(this.player.hp, 30, 30);
        fill(0);
        text(this.round, width - 30, height - 20);
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
    }

    static loadAllSounds () {
        this.loadSounds();
        Player.loadSounds();
        // Zombie.loadSounds();
        Bullet.loadSounds();
        Ammo.loadSounds();
    }
}
Game.textures = {'game.png':null};
Game.sounds = {'lvl.mp3':{sound:null, volume:VOLUME*3}};