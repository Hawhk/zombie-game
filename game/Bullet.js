class Bullet extends MovingObject {
    constructor(x, y, dirX, dirY) {
        let w = 100;
        let h = 100;
        super(x, y, w, h, dirX, dirY, 1, true);
        this.dmg = 1;
        Bullet.playSound();
    }

    update() {
        this.move();
        this.show();
    }
}
Bullet.textures = {
    'bullet.png':null
};
Bullet.sounds = {
    'shot.mp3':{sound:null, volume:VOLUME*2}
};