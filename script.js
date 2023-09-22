let canvas = document.getElementById("game");
let ctx = canvas.getContext('2d');

let WIDTH, HEIGHT, UNIT, SPEED, INCREMENT, TEXTSIZE, game, px, py, vx, vy, pvx, pvy, length, interval, queue;

function init() {
    clearInterval(interval);
    removeEventListener("keydown", keyDown);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    let settings = document.getElementById("settings");

    let width = settings.querySelector("#width").value;
    WIDTH = parseInt(width.length == 0 ? 30 : width);
  
    let height = settings.querySelector("#height").value;
    HEIGHT = parseInt(height.length == 0 ? 20 : height);
  
    UNIT = Math.max(Math.min(30, Math.min(Math.floor(window.innerWidth / WIDTH), Math.floor(window.innerHeight / HEIGHT))), 3);
  
    let speed = settings.querySelector("#interval").value;
    SPEED = parseInt(speed.length == 0 ? 100 : speed);
  
    let increment = settings.querySelector("#increment").value;
    INCREMENT = parseInt(increment.length == 0 ? 4 : increment);
    TEXTSIZE = Math.min(45, Math.floor(canvas.height / 4));

    canvas.width = WIDTH * UNIT;
    canvas.height = HEIGHT * UNIT;

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = `${TEXTSIZE}px Arial`;
    ctx.fillText("click to start", canvas.width / 2, canvas.height / 2);
    queue = 0;
    canvas.addEventListener("pointerdown", start);
}

function start() {
    game = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0));
    px = 0;
    py = Math.floor(HEIGHT / 2);
    vx = 1;
    vy = 0;
    pvx = 1;
    pvy = 0;
    length = 0;
    ctx.font = `${Math.max(UNIT, 10)}px Arial`;
    ctx.textAlign = "start";
    apple();
    canvas.removeEventListener("pointerdown", start);
    addEventListener("keydown", keyDown);
    interval = setInterval(tick, SPEED);
}

function tick() {
    pvx = vx;
    pvy = vy;
    px += vx;
    if (px < 0 || px >= WIDTH) { lose(); return }
    py += vy;
    if (py < 0 || py >= HEIGHT) { lose(); return }

    if (game[py][px] < 0) { if (apple()) { win(); return } }

    if (game[py][px] > 0) { lose(); return }
  
    game[py][px] = length;

    if (queue != 0) {
        input(queue);
        queue = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "green";
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (game[y][x] > 0) {
                game[y][x]--;
                ctx.fillRect(x * UNIT + 1, y * UNIT + 1, UNIT - 2, UNIT - 2);
            } else if (game[y][x] < 0) {
                ctx.fillStyle = "red";
                ctx.fillRect(x * UNIT + 1, y * UNIT + 1, UNIT - 2, UNIT - 2);
                ctx.fillStyle = "green";
            }
        }
    }
    ctx.fillStyle = "white";
    ctx.fillText(`${Math.floor(length / WIDTH / HEIGHT * 100)}%`, Math.max(UNIT, 10) / 4, Math.max(UNIT, 10));
}

function apple() {
    length += INCREMENT;
    if (length >= WIDTH * HEIGHT) { return true }

    let empty = Array();
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (game[y][x] > 0) { game[y][x] += INCREMENT }
            if (game[y][x] === 0) { empty.push([x, y]) }
        }
    }
    let randomChoice = empty[Math.floor(Math.random() * empty.length)];
    game[randomChoice[1]][randomChoice[0]] = -1;
    return false;
}

function keyDown(eventKey) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(eventKey.code) > -1) {
        eventKey.preventDefault();
    }
  
    input(eventKey.code);
}

function input(keyCode) {
    switch (keyCode) {
        case "ArrowLeft":
        case "KeyA":
            if (pvx != 1) { queue = 0; vy = 0; vx = -1 }
            else { queue = keyCode }
            break;
        case "ArrowRight":
        case "KeyD":
            if (pvx != -1) { queue = 0; vy = 0; vx = 1 }
            else { queue = keyCode }
            break;
        case "ArrowUp":
        case "KeyW":
            if (pvy != 1) { queue = 0; vy = -1; vx = 0 }
            else { queue = keyCode }
            break;
        case "ArrowDown":
        case "KeyS":
            if (pvy != -1) { queue = 0; vy = 1; vx = 0 }
            else { queue = keyCode }
    }
}

function lose() {
    clearInterval(interval);
    removeEventListener("keydown", keyDown);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = `${TEXTSIZE}px Arial`;
    ctx.fillText("YOU LOSE", canvas.width / 2, canvas.height / 2);
    ctx.fillText("click to reset", canvas.width / 2, canvas.height / 2 + TEXTSIZE);
    canvas.addEventListener("pointerdown", start);
}

function win() {
    clearInterval(interval);
    removeEventListener("keydown", keyDown);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = `${TEXTSIZE}px Arial`;
    ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);
    ctx.fillText("click to reset", canvas.width / 2, canvas.height / 2 + TEXTSIZE);
    canvas.addEventListener("pointerdown", start);
}

function toggle() {
    let div = document.getElementById("settings");
    if (div.style.display !== "none") { div.style.display = "none" }
    else { div.style.display = "block" }
};

function submit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggle();
    init();
}

function onResize() {
    UNIT = Math.max(Math.min(30, Math.min(Math.floor(window.innerWidth / WIDTH), Math.floor(window.innerHeight / HEIGHT))), 3);
 
    canvas.width = WIDTH * UNIT;
    canvas.height = HEIGHT * UNIT;
}

window.onresize = onResize;
init();