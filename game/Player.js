class Player extends MovingObject {
    constructor (px,py) {
        let w = 45;
        let h = 15
        let s = 0.1
        super(px, py, w, h, 0, 0, s);

        this.hp = 10; // player health
        this.maxHp = 10; // player max health
        this.ammo = 50; // player ammo
        this.kills = 0; // player kills

        this.bullets = []; // player bullets
    }

    show () {
        this.showImg();
    }

    move () {
        let {x, y} = this.getPos();
        this.dir.set(mouseX - x, mouseY - y);
        if (this.dir.mag() > 1) {
            this.dir.normalize();
        }
        this.percentagePos.add(
            this.dir.copy().mult(
                this.speed
            )
        );
    };

    shoot (dirX, dirY) {
        if (this.ammo > 0) {
            this.ammo--;
            let {x, y} = this.getPos();
            this.bullets.push(new Bullet(x, y, dirX, dirY));
            this.knockback(10, createVector(-dirX, -dirY));
        } else {    
            this.noAmmo();
        }
        if (dirX === IMG_NEGATIVE) {
            this.imgDirH = IMG_NEGATIVE;
        } else if (dirX === IMG_NORMAL) {
            this.imgDirH = IMG_NORMAL;
        }
    }

    noAmmo () {
        if (!Player.soundPlaying('noAmmo.mp3')) {
            Player.playSound('noAmmo.mp3');
        }
    }

    takeDamage(dmg) {
        Player.playSound('oof.mp3');
        this.hp -= dmg;
    }

    update (fire, zombies) {
        this.checkFire(fire);
        this.move();
        this.checkBulltes(zombies);
    }

    checkBulltes (zombies) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            bullet.update();
            let bPos = bullet.getPos();
            let bDim = bullet.getDim();
            let hits = 0;
            let kills = 0;
            for (let j = zombies.length - 1; j >= 0; j--) {
                let zombie = zombies[j];
                let zPos = zombie.getPos();
                let zDim = zombie.getDim();
                if (rectColide(bPos, bDim, zPos, zDim)) {
                    hits++;
                    zombie.hp -= bullet.dmg;
                }
            }
            if (
                bPos.x > width || 
                bPos.x < 0 || 
                bPos.y > height || 
                bPos.y < 0 || 
                hits > 0
            ) {
                this.bullets.splice(i, 1);
            }
        }
    }

    checkFire (dmgSize) {
        let {x, y} = this.getPos();
        let {w, h} = this.getDim();
        w /= 2;
        h /= 2;
        let dmg = 1;
        let knockDist = 10;
        let xmw = x - w < dmgSize.w;
        let xpw = x + w > width - dmgSize.w;
        let ymh = y - h < dmgSize.h;
        let yph = y + h > height - dmgSize.h;
        if ( 
            xmw || xpw || ymh || yph
        ) {
            let xm = mouseX < dmgSize.w && !(xpw || yph || ymh);
            let xp = mouseX > width - dmgSize.w && !(xmw || yph || ymh);
            let ym = mouseY < dmgSize.h && !(yph || xmw || xpw);
            let yp = mouseY > height - dmgSize.h && !(ymh || xmw || xpw);
            if (
                (mouseX < x - w && xm) ||
                (mouseX > x + w && xp) ||
                (mouseY < y - h && ym) ||
                (mouseY > y + h && yp)
            ) {
                this.knockbackDamage(dmg, knockDist);
            } else {
                this.knockbackDamage(dmg, knockDist, createVector(width/2 - x, height/2 - y));
            }

        }
    }

    knockback(dist, knockDir=null) { // knockback player

        let dir = knockDir || this.dir.copy().mult(-1);

    
        this.percentagePos.add(
            dir.normalize().mult(
                this.speed
            ).mult(dist)
        );
    }

    knockbackDamage(dmg, dist, knockDir=null) { // knockback player and damage him
        this.takeDamage(dmg);
        this.knockback(dist, knockDir);
    }
}
Player.textures = {
    'player.png':null,
    'ammo.png':null,
    'health.png':null,
    'bullet.png':null
};
Player.sounds = {
    'oof.mp3':{sound:null, volume:VOLUME * 3},
    'noAmmo.mp3':{sound:null},
};