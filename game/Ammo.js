class Ammo extends Drop {
    constructor (x,y,w,h,nrOfZombies) {
        super(x,y,w,h,nrOfZombies,0.5,1.5);
        let min = 10;
        if (this.quantity < min) {
            this.quantity = min;
        }
    }
    
    update () {
        this.show();
        this.pickup(Ammo);
    }
}

Ammo.timeMultipliers = {min:0.5, max:1.5};
Ammo.textures = {
    'ammo.png':null
};
Ammo.sounds = {
    'ammo.mp3':{sound:null, volume:VOLUME*2}
};