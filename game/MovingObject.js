const IMG_NORMAL = 1;
const IMG_NEGATIVE = -1;

class MovingObject {
    constructor (x, y, w, h, dirX, dirY, speed) {
        this.percentagePos = createVector(x/width, y/height);
        this.percentageDim = {w: w, h: h};
        this.dir = createVector(dirX, dirY);
        speed/=FPS;
        this.speed = createVector(speed, speed/RATIO).normalize().mult(speed);
        this.imgDirH = dirX;
        this.imgDirV = dirY;
    }

    show () {
        let obj = this.constructor;
        let img = obj.name.toLowerCase()+".png";
        if(obj.textures[img] !== null) {
            this.showImg();
        } else {
            let {w, h} = this.getDim();
            let {x, y} = this.getPos();
            fill('blue');
            rect(x, y, w, h);
        }
    }

    showImg () {
        let {w, h} = this.getDim();
        let {x, y} = this.getPos();
        let obj = this.constructor;
        let img = obj.name.toLowerCase()+".png";
        if (this.imgDirH === IMG_NEGATIVE) {
            push();
            scale(-1, 1);
            image(obj.textures[img], -x, y, w, h);
            pop();
        } else if (this.imgDirH === IMG_NORMAL) {
            image(obj.textures[img], x, y, w, h);
        }
        if (this.imgDirV === IMG_NEGATIVE || this.imgDirV === IMG_NORMAL) { 
            push();
            if (this.imgDirV === IMG_NEGATIVE) {
                this.rotate(x, y, -90);
            } else {
                this.rotate(x, y, 90);
            }
            image(obj.textures[img], 0, 0, w, h);
            pop();
        }
    }

    rotate(x, y, a) {
        translate(x, y);
        rotate(a);
    }
    move () {
        this.percentagePos.add(
            this.dir.copy().mult(
                this.speed
            )
        );
    }

    getPos () {
        return createVector(
            width * this.percentagePos.x, 
            height * this.percentagePos.y
        );
    }

    getDim () {
        let {w, h} = this.percentageDim;
        return {
            w: width/w,
            h: height/h
        }
    }

    static loadTextures () {
        Game.loadTextures(this);
    }
}