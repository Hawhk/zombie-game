const RATIO = 9/16;

class Drop extends StillObject {
    constructor (x,y,w,h,nrOfZombies) {
        super(x,y,w,h);
        this.quantity = nrOfZombies * round(random(0.5,1.5));
    }

    pickup (object) {
        let game = this.constructor.game;
        let player = game.player;
        let name = this.constructor.name;
        if (rectColide(
            this.getPos(), this.getDim(), 
            player.getPos(), player.getDim()
        )) {
            object.playSound();
            //todo fix adding quantity
            player[name.toLowerCase()] += this.quantity;
            game.drops.splice(game.drops.indexOf(this), 1);
        }
    }


    static newDrop() {
        let {w, h} = this.getDimensions();
        let {w:w1, h:h1} = this.percentageDimentions;
        return new this(
            random(this.game.getFireSize().w + w, width - this.game.getFireSize().w - w),
            random(this.game.getFireSize().h + h, height - this.game.getFireSize().h - h),
            w1,
            h1,
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

    static setTimmer () {
        let mult = random(this.timeMultipliers.min, this.timeMultipliers.max);
        let time = this.game.getDropTime() * mult;
        console.log(time);
        this.timer = new Timer(() => {
            console.log("hmm");
            this.game.drops.push(this.newDrop());
            this.setTimmer();
        }, time);
    }

    static clearTimmer () {
        this.timer.pause();
        this.timer = null;
    }
}
Drop.percentageDimentions = {w: 80, h: 80*RATIO}; 