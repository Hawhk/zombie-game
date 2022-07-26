class Health extends Drop {
    constructor (x,y,w,h,nrOfZombies) {
        let {min, max} = Health.timeMultipliers;
        super(x,y,w,h,nrOfZombies,min, max);
        this.quantity = random([1,2]);
    }
    update () {
        this.show();
        this.pickup(Health);
    }

    addQuantity (player) {
        player.hp += this.quantity;
        if (player.hp > player.maxHp) {
            player.hp = player.maxHp;
        }
    }
}
Health.timeMultipliers = {min:0.5, max:1.5};
Health.textures = {
    'health.png':null
};
Health.sounds = {
    'heal.mp3':{sound:null, volume:VOLUME*2}
};