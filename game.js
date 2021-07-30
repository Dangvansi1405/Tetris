const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");// vẽ 2D

const ROW = 20; //Giá trị hàng: có 20 hàng
const COL = 10; //Giá trị cột: có 10 cột
const SQ = 20; //Gán kích thức 1 ô là 40
const COLOR = "#574242FF";
let score = 0;

function drawSquare(x, y, color) {//Vẽ ô vuông chuyền vào tham số cột hàng và màu
    ctx.fillStyle = color; // đổ màu cho ô vuông
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);// vẽ ô vuông dựa vào hàng, cột và kích thước

    ctx.strokeStyle = "#ccc";// vẽ ô vuông có viền màu xám
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let board = []; // tạo mảng hai chiều
for (let i = 0; i < ROW; i++) {
    board[i] = [];
    for (let j = 0; j < COL; j++) {
        board[i][j] = COLOR; // mỗi phần tử trong mảng sẽ là màu trắng
    }
}

function drawBoard() { // tạo hàm vẽ
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            drawSquare(j, i, board[i][j]);// hàng cột và màu
        }
    }
}

drawBoard();// Vẽ ra được bảng game 200 ô nhỏ

function start() {
    class Cubes { // tạo class tên Cubes
        tetromino; //Mảng hình 1
        color; // màu của cubes

        constructor(tetromino, color) {
            this.tetromino = tetromino;
            this.color = color;

            //thuộc tính
            this.tetrominoN = 0; // mảng thứ 0 của mảng hình 1
            this.activeTetromino = this.tetromino[this.tetrominoN];// gan goc quay dau ttien cua hinh vao thuoc tinh

            //Tọa độ Cubes khi được sinh ra trong game
            this.x = 3;
            this.y = -4;
        }

        //methog - phuong thức
        fill(color) { //Duyệt qua hàng và cột của mảng thứ 0 của mảng hình 1
            for (let i = 0; i < this.activeTetromino.length; i++) {
                for (let j = 0; j < this.activeTetromino.length; j++) {
                    if (this.activeTetromino[i][j]) {
                        drawSquare(this.x + j, this.y + i, color);// Nếu có thì vẽ hình
                    }
                }
            }
        }

        draw() {
            this.fill(this.color);// do mau cho hình sau khi đã duyệt
        }

        unDraw() {
            this.fill(COLOR);// do màu trắng sau khi hình đã đi qua các điểm đã đi qua
        }

        moveDown() {
            if (!this.collision(0, 1, this.activeTetromino)) {
                this.unDraw();
                this.y++;
                this.draw();
            } else {
                this.lock();
                p = randomPiece();
            }
        }

        moveRight() {
            if (!this.collision(1, 0, this.activeTetromino)) {
                this.unDraw();
                this.x++;
                this.draw();
            }
        }

        moveLeft() {
            if (!this.collision(-1, 0, this.activeTetromino)) {
                this.unDraw();
                this.x--;
                this.draw();
            }
        }

        lock() {
            for (let i = 0; i < this.activeTetromino.length; i++) {
                for (let j = 0; j < this.activeTetromino.length; j++) {
                    if (!this.activeTetromino[i][j]) {
                        continue
                    }
                    if (this.y + i <= 0) {
                        alert("Game over!!! Nhan enter de choi lai")
                        gameOver = true;
                        break;
                    }
                    board[this.y + i][this.x + j] = this.color;
                }
            }
            for (let i = 0; i < ROW; i++) {
                let isRowFull = true;
                for (let j = 0; j < COL; j++) {
                    isRowFull = isRowFull && (board[i][j] != COLOR);
                }
                if (isRowFull) {
                    for (let k = i; k > 1; k--) {
                        for (let j = 0; j < COL; j++) {
                            board[k][j] = board[k - 1][j];
                        }
                    }
                    for (let j = 0; j < COL; j++) {
                        board[0][j] = COLOR;
                    }
                    score += 10;
                }
            }
            drawBoard();
            document.getElementById("score").innerText = score;
        }

        rotate() {
            let nextPatten = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
            let step = 0;
            if (this.collision(0, 0, nextPatten)) {
                if (this.x > COL / 2) {
                    step = -1;
                } else {
                    step = 1;
                }
            }
            if (!this.collision(0, 0, nextPatten)) {
                this.unDraw();
                this.x += step;
                this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
                this.activeTetromino = this.tetromino[this.tetrominoN];
                this.draw();
            }
        }

        collision(x, y, cubes) {
            for (let i = 0; i < cubes.length; i++) {
                for (let j = 0; j < cubes.length; j++) {
                    if (!cubes[i][j]) {
                        continue
                    }
                    let newX = this.x + j + x;
                    let newY = this.y + i + y;
                    if (newX < 0 || newX >= COL || newY >= ROW) {
                        return true
                    }
                    if (newY < 0) {
                        continue
                    }
                    if (board[newY][newX] !== COLOR) {
                        return true
                    }
                }
            }
            return false
        }
    }

    let CUBES = [
        [Z, "BLACK"],
        [S, "BLACK"],
        [T, "BLACK"],
        [O, "BLACK"],
        [L, "BLACK"],
        [I, "BLACK"],
        [J, "BLACK"],
    ];

    function randomPiece() {
        let r = Math.floor(Math.random() * CUBES.length);
        return new Cubes(CUBES[r][0], CUBES[r][1]);
    }

    let p = randomPiece();

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 37) {
            p.moveLeft();
        } else if (e.keyCode == 39) {
            p.moveRight();
        } else if (e.keyCode == 38) {
            p.rotate();
        } else if (e.keyCode == 40) {
            p.moveDown()
        } else if (e.keyCode == 13) {
            location.reload();
        }
    })
    let gameOver = false;
    let interval;

    function drop() {
        interval = setInterval(function () {
            if (!gameOver) {
                p.moveDown();
            } else {
                clearInterval(interval);
            }
        }, 500)

    }
    drop();
}


// function restart() {
//     drop(gameOver = true);
//     ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//     drawSquare();
//     drawBoard();
// }

// function setLevel() {
//     let score = document.getElementById("score").value;
//     if (score <= 1) {
//         return 500;
//     }
//     if (score > 1 && score < 5) {
//         return 200;
//     }
//     if (score >5 && score < 10) {
//         return 100;
//     }
// }
// function upSpeed() {
//         let x = document.getElementById("score").value;
//         if (x > 0 && x < 5) {
//             drop(50);
//
//         } else if (x < 10) {
//             drop(300);
//         } else {
//             drop(50);
//         }
//     }