class Bullet extends MovingObject {
    constructor(x, y, dirX, dirY) {
        let w = 100;
        let h = 100;
        super(x, y, w, h, dirX, dirY, 1, true);
        this.dmg = 1;
        this.sound();
    }

    update() {
        this.move();
        this.show();
    }

    sound () {
        let s = Bullet.sounds['shot.mp3'];
        s.setVolume(VOLUME);
        s.play();
    }  
}
Bullet.textures = {
    'bullet.png':null
};
Bullet.sounds = {
    'shot.mp3':null
};