
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

        this.round = 0;
        this.lost = false;

        this.nextRound();

        this.drops = [];
        let s = 60;
        this.dropTime = 1000 * s/this.nrOfZombies;
        let drops = [Ammo];
        drops.forEach(drop => {
            drop.game = this;
            drop.setTimmer();
        });
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
    }

    update () {
        this.show();
        if (!this.lost) {
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

            this.player.show();
            this.playerStats();
            this.lost = this.player.hp <= 0;

            if (this.zombies.length === 0) {
                this.nextRound();
            }
        } else {
            this.loseText();
            Ammo.clearTimmer();
        }
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
console.log(Game.sounds);