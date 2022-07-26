const IMG_NORMAL = 1;
const IMG_NEGATIVE = -1;
const VOLUME = 0.3;
class StillObject {
    constructor (x, y, w, h) {
        this.percentagePos = createVector(x/width, y/height);
        this.percentageDim = {w: w, h: h};
        this.imgDirH = IMG_NORMAL;
        this.imgDirV = 0;
    }

    show (x, y) {
        let obj = this.constructor;
        let src = obj.name.toLowerCase()+".png";
        if(obj.textures[src] !== null) {
            this.showImg(src, x, y);
        } else {
            let {w, h} = this.getDim();
            if (!x || !y) {
                let {x:px, y:py} = this.getPos();
                x = px;
                y = py;
            }
            fill('blue');
            rect(x, y, w, h);
        }
    }

    showImg (src, x, y) {
        let {w, h} = this.getDim();
        if (!x || !y) {
            let {x:px, y:py} = this.getPos();
            x = px;
            y = py;
        }
        let obj = this.constructor;
        if (!src) {
            src = obj.name.toLowerCase()+".png";
        }
        if (this.imgDirH === IMG_NEGATIVE) {
            push();
            scale(-1, 1);
            image(obj.textures[src], -x, y, w, h);
            pop();
        } else if (this.imgDirH === IMG_NORMAL) {
            image(obj.textures[src], x, y, w, h);
        }
        if (this.imgDirV === IMG_NEGATIVE || this.imgDirV === IMG_NORMAL) { 
            push();
            if (this.imgDirV === IMG_NEGATIVE) {
                this.rotate(x, y, -90);
            } else {
                this.rotate(x, y, 90);
            }
            image(obj.textures[src], 0, 0, w, h);
            pop();
        }
    }

    rotate(x, y, a) {
        translate(x, y);
        rotate(a);
    }

    getDim () {
        let {w, h} = this.percentageDim;
        return {
            w: width/w,
            h: height/h
        }
    }

    getPos () {
        return createVector(
            width * this.percentagePos.x, 
            height * this.percentagePos.y
        );
    }

    static soundPlaying (src) {
        if (!src) {
            src = Object.keys(this.sounds)[0];
        }
        return this.sounds[src].sound.isPlaying();
    }

    static playSound (src) {
        if (!src) {
            src = Object.keys(this.sounds)[0];
        }
        this.sounds[src].sound.play();
    }

    static loadTextures () {
        let textures = this.textures
        Object.keys(textures).forEach(key => {
            textures[key] = loadImage(PIC_DIR + key);
        });
    }

    static loadSounds () {
        let sounds = this.sounds
        Object.keys(sounds).forEach(key => {
            sounds[key].sound = loadSound(SND_DIR + key);
            if (sounds[key].volume) {
                sounds[key].sound.setVolume(sounds[key].volume);
            } else {
                sounds[key].sound.setVolume(VOLUME);
            }
        });
    }
}