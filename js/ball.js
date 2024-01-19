import {gravity2, imgTag} from "./consts";

const ballCanvas = document.getElementById('test')
export const ballCtx = ballCanvas.getContext("2d");
// canvas.width = innerWidth-4;
// canvas.height = innerHeight-4;
requestAnimationFrame(mainLoop); // starts the animation


const gravity = {x: 0, y: 0.1};
const groundY = ballCtx.canvas.height;
const groundX = ballCtx.canvas.width;
const bounce = 0.7; // very bouncy
export const object = {
    pos: {x: ballCtx.canvas.width / 2, y: 0},
    vel: {x: 0, y: 15}, // velocity
    size: {w: 60, h: 60},
    counter: 0,
    update() {
        if(!gravity2.isGravityOn) return // todo maybe its redundant
        this.vel.x += gravity.x
        this.vel.y += gravity.y
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        const gY = groundY - this.size.h
        const gX = groundX - this.size.w
        if(this.pos.y >= gY) {
            this.pos.y = gY - (this.pos.y - gY)
            this.vel.y = -Math.abs(this.vel.y) * bounce
            if (this.vel.y >= -gravity.y) {
                this.vel.y = 0
                this.pos.y = gY - gravity.y
            }
        }
        if(this.pos.y <= 0) {
            this.pos.y = 0
            this.vel.y = Math.abs(this.vel.y) * bounce
        }
        if(this.pos.x <= 0) {
            this.pos.x = 0
            this.vel.x = Math.abs(this.vel.y) * bounce
        }
        if(this.pos.x >= gX) {
            this.pos.x = gX - (this.pos.x - gX)
            this.vel.x = -Math.abs(this.vel.x) * bounce
            if (this.vel.x >= -gravity.x) {
                this.vel.x = 0
                this.pos.x = gX - gravity.x
            }
        }
    },
    draw() {
        ballCtx.drawImage(imgTag, this.pos.x, this.pos.y, this.size.w, this.size.h)
    },
    reset() { this.pos.y = this.vel.y = this.vel.x = 0 },
}

function mainLoop() {
    ballCtx.clearRect(0, 0, ballCtx.canvas.width, ballCtx.canvas.height);
    object.update(); // move object
    object.draw();
    requestAnimationFrame(mainLoop);
}

ballCanvas.addEventListener("click", object.reset.bind(object));
