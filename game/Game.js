
class Game {
    constructor () {
        let ds = this.getFireSize();
        let ds_w = ds.w * 2;
        let ds_h = ds.h * 2;
        let pX = random(ds_w, width - ds_w);
        let pY = random(ds_h, height - ds_h);
        this.player = new Player(pX, pY);
        this.zombies = [];

        this.round = 0;

        for (let i = 0; i < 10; i++) {
            let zX = random(ds_w, width - ds_w);
            let zY = random(ds_h, height - ds_h);
            let zS = random(0.05, 0.09);
            this.zombies.push(new Zombie(zX, zY, zS, i));
        }
        this.lost = false;
    }

    show () {
        fill(0, 150);
        let ds = this.getFireSize();
        let ds_w = ds.w * 4;
        let ds_h = ds.h * 4;
        rect(width/2, height/2, width-ds.w*2, height-ds.h*2);
        fill(255, 100)
        rect(width/2, height/2, width-ds_w, height-ds_h);
        
    }

    update () {
        this.show();
        if (!this.lost) {
            this.player.update(this.getFireSize(), this.zombies);
            this.zombies.forEach(zombie => {
                zombie.move(this.player);
            });
            Zombie.separate(this.zombies);
            this.zombies.forEach(zombie => {
                zombie.show(this.player);
            });
            this.player.show();
            this.lost = this.player.hp <= 0;
        } else {
            push();
            fill("DARKRED");
            textSize(width/20);
            textStyle(BOLD);
            text(`You died with ${this.player.kills} kill(s) on round ${this.round + 1}` , width/2, height/2);
            pop();
        }
    }

    getFireSize () {
        return {
            w: width/20,
            h: height/14
        }
    }

    static loadTextures (obj) {
        let textures = obj.textures
        Object.keys(textures).forEach(key => {
            textures[key] = loadImage(PIC_DIR + key);
        });
    }

    static loadAllTextures () {
        this.loadTextures(this);
        Player.loadTextures();
        Zombie.loadTextures();
        Bullet.loadTextures();
    }

    static loadSounds (obj) {
        let sounds = obj.sounds
        Object.keys(sounds).forEach(key => {
            sounds[key] = loadSound(SND_DIR + key);
            sounds[key].setVolume(VOLUME);
        });
    }

    static loadAllSounds () {
        this.loadSounds(this);
        Player.loadSounds();
        Player.sounds['oof.mp3'].setVolume(VOLUME * 3);
        // Zombie.loadSounds();
        Bullet.loadSounds();
    }
}
Game.textures = {'grass.jpg':null};
Game.sounds = {'lvl.mp3':null};