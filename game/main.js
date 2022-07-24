let game;

const FPS = 30;

const ASSET_DIR = 'assets/';
const PIC_DIR = ASSET_DIR + 'pic/';
const SND_DIR = ASSET_DIR + 'sounds/';
const VOLUME = 0.3;

function preload(){
    Game.loadAllTextures();
    soundFormats('mp3', 'ogg');
    Game.loadAllSounds();
}

function setup() {
    let { w, h } = getSize();
    createCanvas(w, h);
    frameRate(FPS);

    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);

    game = new Game();
} 

function draw() {
    game.update();
}

function windowResized() {
    let { w, h } = getSize();
    resizeCanvas(w, h);
}

function getSize() {
    let w = windowWidth;
    let h = windowHeight - 25;
    if (windowHeight - 25 < w * RATIO) {
        w = h / RATIO;
    } else {
        h = w * RATIO;
    }
    return { w, h };
}


function fib(nr){
    if (nr <= 1) {
        return nr;
    }
    return fib(
        nr - 1
    ) + fib(
        nr - 2
    );
}

function keyPressed() {
    if (key === 'w') {
        game.player.shoot(0, -1); // up
    }else if (key === 's') {
        game.player.shoot(0, 1); // down
    } else if (key === 'a') {
        game.player.shoot(-1, 0); // left
    } else if (key === 'd') {
        game.player.shoot(1, 0); // right
    }

  
    // if (player.ammo > 0 && player.life > 0) {
    //   if (keyCode === 38) {//upp
    //     player.shoot(1, 0, -1);
    //   }else if (keyCode === 40) {//ner
    //     player.shoot(1, 0, 1);
    //   }else if (keyCode === 37) { //vänsater
    //     player.shoot(1, -1, 0);
    //   }else if (keyCode === 39) {
    //     player.shoot(1, 1, 0);
    //   }
    // }
  }

function rectColide(r1Pos, r1Dim, r2Pos, r2Dim) {
    if (
        r1Pos.x + r1Dim.w/2 > r2Pos.x - r2Dim.w/2 &&
        r1Pos.y + r1Dim.h/2 > r2Pos.y - r2Dim.h/2 &&
        r1Pos.x - r1Dim.w/2 < r2Pos.x + r2Dim.w/2 &&
        r1Pos.y - r1Dim.h/2 < r2Pos.y + r2Dim.h/2
    ) {
        return true;
    }
    return false;
}
  
function isRectColiding(rects) {
    for (let i = 0; i < rects.length - 1; i++) {
        let r1 = rects[i];
        let r1Pos = r1.getPos();
        let r1Dim = r1.getDim();
        for (let j = i + 1; j < rects.length; j++) {
            let r2 = rects[j];
            let r2Pos = r2.getPos();
            let r2Dim = r2.getDim();
            if (rectColide(r1Pos, r1Dim, r2Pos, r2Dim)) {
                return true;
            }
        }
    }
}
