class Zombie extends MovingObject {
    constructor(x, y, s, i) {
        let w = 45;
        let h = 15
        super(x, y, w, h, 0, 0, s);
        this.dmg = random([1,2]);
        this.knockDist = 15;
        this.hp = random([1,2]);
        this.i = i;
    }

    show(player) {
        let {x} = this.getPos();
        let {x:pX} = player.getPos();
        this.imgDirH = (x > pX) ? IMG_NEGATIVE : IMG_NORMAL;
        this.showImg();
    }

    move (player) {
        let {x, y} = this.getPos();
        let pPos = player.getPos();
        // let pPos = {x:mouseX, y:mouseY}

        this.dir.x = pPos.x - x;
        this.dir.y = pPos.y - y;

        if (this.dir.mag() > 1) {
            this.dir.normalize();
        }

        this.percentagePos.add(
            this.dir.copy().mult(
                this.speed
            )
        );
        this.hit(player);
    }

    

    hit (player) {

        let zPos = this.getPos();
        let zDim = this.getDim();
        let pPos = player.getPos();
        let pDim = player.getDim(); 

        if (rectColide(pPos, pDim, zPos, zDim)) {
            let knockDir = createVector(
                pPos.x - zPos.x, 
                pPos.y - zPos.y
            ).normalize();

            player.knockbackDamage(
                this.dmg, this.knockDist, knockDir
            );
        }
    }

    getOverlapVectors (zombies) {
        let list = [];
        let tPos = this.getPos();
        let tDim = this.getDim();
        zombies.forEach(zombie => {
            if (this !== zombie) {
                let zPos = zombie.getPos();
                let zDim = zombie.getDim();
                if (
                    rectColide(
                        tPos,  
                        tDim, 
                        zPos,
                        zDim
                    )
                ) {
                    let vec = createVector(
                        tPos.x - zPos.x,
                        tPos.y - zPos.y
                    );
                    list.push({
                        zombie: this, 
                        vector: vec.normalize()
                    });
                }
            }
        });
        return list;
    }

    static separate(zombies) {
        while (isRectColiding(zombies)) {
            let overlapVectors = [];
            zombies.forEach(zombie => {
                let vectors = zombie.getOverlapVectors(zombies);
                if (vectors.length > 0) {
                    overlapVectors.push(...vectors);
                }
            });

            overlapVectors.forEach(obj => {
                obj.zombie.percentagePos.add(obj.vector.mult(0.004));
            });
        }
    }
}

Zombie.textures = {
    'zombie.png':null,
    'zombie_dmg.png':null
}