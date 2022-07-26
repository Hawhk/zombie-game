class Bomb extends Drop {
    constructor (x,y,w,h,nrOfZombies) {
        let {min, max} = Bomb.timeMultipliers;
        super(x,y,w/1.5,h/1.5,nrOfZombies,min, max);
        this.quantity = 1;

        this.placed = false;
        this.pickedUp = false;
        this.exploded = false;

        this.waitTime = 4900;
        this.explotionTime = 1000;

        this.timerSound = {
            sound: loadSound(SND_DIR+'timer.mp3'),
            paused: false
        };
        this.timer = null;
        this.damage = 3;
        this.rMult = 5;
    }
    update () {
        this.show();
        if (!this.pickedUp) {
            this.pickup(Bomb, 'bomb_up.mp3');
        }
    }

    show () {
        if (!this.exploded) {
            super.show();
        } else {
            let {x, y} = this.getPos();
            let {w} = this.getDim();
            let r = w * this.rMult;
            let img = Bomb.textures['explode.png'];
            image(img, x, y, r * 2, r * 2);
        }
    }

    addQuantity (player) {
        player.bombs.push(this);
        this.pickedUp = true;
    }

    placeBomb () {
        let player = Bomb.game.player;
        this.percentagePos.set(player.percentagePos);
        this.placed = true;
        let v = Bomb.sounds['timer.mp3'].volume;
        this.timerSound.sound.play(0, 1.3, v, 2, 6.5);
        this.timer = new Timer(() => {
            this.explode();
        }, this.waitTime);
    }

    explode () {
        this.exploded = true;
        let player = Bomb.game.player;
        this.dealDamage();
        let bombs = player.bombs;
        Bomb.playSound('boom.mp3');
        this.timer = new Timer(() => {
            bombs.splice(bombs.indexOf(this), 1);
        }, this.explotionTime);
    }

    dealDamage () {
        let game = this.constructor.game;
        let zombies = game.zombies;
        let player = game.player;
        let pos = this.getPos();
        let {w} = this.getDim();
        let radius = w * this.rMult;
        for (let zombie of zombies) {
            let zpos = zombie.getPos();
            let zdim = zombie.getDim();
            if (circleRectColide(
                pos, radius, 
                zpos, zdim
            )) {
                zombie.hp -= this.damage;
            }
        }
        if (circleRectColide(
            pos, radius, 
            player.getPos(), player.getDim()
        )) {
            player.takeDamage(this.damage);
        }
    }
}
Bomb.timeMultipliers = {min:0.5, max:1.5};
Bomb.textures = {
    'bomb.png':null,
    'explode.png':null
};
Bomb.sounds = {
    'bomb_up.mp3':{sound:null, volume:VOLUME*2},
    'timer.mp3':{sound:null, volume:VOLUME*2},
    'boom.mp3':{sound:null, volume:VOLUME*2}
};