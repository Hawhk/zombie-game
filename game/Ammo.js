class Ammo extends Drop {
    constructor (x,y,w,h,nrOfZombies) {
        let {min, max} = Health.timeMultipliers;
        super(x,y,w,h,nrOfZombies,min, max);
        let minQuan = 20;
        if (this.quantity < minQuan) {
            this.quantity = minQuan;
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