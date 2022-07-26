let game;

const FPS = 30;
let serverAsset;
let isOnServer = false;
if (document.title !== 'Zombie') {
    serverAsset = "/gamestatic/zombie-game/assets/";
    isOnServer = true;
}
const ASSET_DIR = serverAsset || 'assets/';
const PIC_DIR = ASSET_DIR + 'pic/';
const SND_DIR = ASSET_DIR + 'sounds/';

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
    fib(15);
} 

function draw() {
    game.update();
}

function windowResized() {
    let { w, h } = getSize();
    resizeCanvas(w, h);
}

function getSize() {
    let nch = 0;
    if (typeof getNonCanvasHeight === 'function') {
        nch = getNonCanvasHeight();
    } else {
        nch = 25;
    }
    let w = windowWidth;
    let h = windowHeight - nch;
    if (windowHeight - nch < w * RATIO) {
        w = h / RATIO;
    } else {
        h = w * RATIO;
    }
    return { w, h };
}

let fibNums = [0,1];

function fib(nr){
    if (fibNums[nr] === undefined) {
        fibNums[nr] = fib(nr-1) + fib(nr-2);
    }
    return fibNums[nr];
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

    if (key === ' ') {
        game.player.placeBomb();
    }
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
    return false;
}

function circleRectColide(cPos, cRad, rPos, rDim) {
    let distX = abs(cPos.x - rPos.x);
    let distY = abs(cPos.y - rPos.y);

    if (distX > (rDim.w/2 + cRad)) { return false; }
    if (distY > (rDim.h/2 + cRad)) { return false; }

    if (distX <= (rDim.w/2)) { return true; }
    if (distY <= (rDim.h/2)) { return true; }

    let dx = distX - rDim.w/2;
    let dy = distY - rDim.h/2;
    return (dx*dx + dy*dy <= (cRad*cRad));
}
