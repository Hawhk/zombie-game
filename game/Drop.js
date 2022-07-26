const RATIO = 9/16;

class Drop extends StillObject {
    constructor (x,y,w,h,nrOfZombies) {
        super(x,y,w,h);
        this.quantity = nrOfZombies * round(random(0.5,1.5));
    }

    pickup (object) {
        let game = this.constructor.game;
        let player = game.player;
        if (rectColide(
            this.getPos(), this.getDim(), 
            player.getPos(), player.getDim()
        )) {
            object.playSound();
            this.addQuantity(player);
            game.drops.splice(game.drops.indexOf(this), 1);
        }
    }

    addQuantity (player) {
        let name = this.constructor.name;
        player[name.toLowerCase()] += this.quantity;
    }


    static newDrop() {
        let {w, h} = this.getDimensions();
        let {w:pdw, h:pdh} = this.percentageDimentions;
        let {w:fw, h:fh} = this.game.getFireSize();
        fw *= 2;
        fh *= 2; 
        return new this(
            random(fw + w, width - fw - w),
            random(fh + h, height - fh - h),
            pdw,
            pdh,
            this.game.nrOfZombies
        );
    }

    static getDimensions() {
        let {w, h} = this.percentageDimentions;
        return {
            w: width/w,
            h: height/h
        };
    }

    static setTimer (time) {
        let mult = random(this.timeMultipliers.min, this.timeMultipliers.max);
        if (!time) {
            time = this.game.getDropTime();
        }
        this.timer = new Timer(() => {
            this.game.drops.push(this.newDrop());
            this.setTimer();
        }, time * mult);
    }

    static clearTimer () {
        if (this.timer) {
            this.timer.pause();
            this.timer = null;
        }
    }
}
Drop.percentageDimentions = {w: 80, h: 80*RATIO}; 