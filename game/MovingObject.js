class MovingObject extends StillObject {
    constructor (x, y, w, h, dirX, dirY, speed, imgDir=false) {
        super(x, y, w, h);
        this.dir = createVector(dirX, dirY);
        speed/=FPS;
        this.speed = createVector(speed, speed/RATIO).normalize().mult(speed);
        if (imgDir) {
            this.imgDirH = dirX;
            this.imgDirV = dirY
        };
    }

    move () {
        this.percentagePos.add(
            this.dir.copy().mult(
                this.speed
            )
        );
    }
}