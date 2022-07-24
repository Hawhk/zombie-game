class Ammo extends Drop {
    constructor (x,y,w,h,nrOfZombies) {
        super(x,y,w,h,nrOfZombies,0.5,1.5);
        let {w:w1, h:h1} = this.getDim();
        console.log(w1, w, h1, h);
        if (this.quantity < 5) {
            this.quantity = 5;
        }
    }
    
    update () {
        this.show();
        this.pickup();
    }

    sound () {
        Ammo.sounds['ammo.mp3'].play();
    }

}

Ammo.timeMultipliers = {min:0.5, max:1.5};
Ammo.textures = {
    'ammo.png':null
};
Ammo.sounds = {
    'ammo.mp3':null
};