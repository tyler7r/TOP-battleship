import { createP1Board, createP2Board, initializeSquares, renderSquareStatus, xCoord, yCoord, initializeHoverSquares, counter } from "./renderDOM";

createP1Board();
createP2Board();

let nextMoves = [];
const script = document.querySelector('.script');

function Ship(length = 2, name = 'battleship') {
    return {
        name,
        length,
        hits: 0,
        sunk: false,
        
        hit() {
            if (this.sunk === true) return this.length;
            this.hits += 1;
            return this.hits;
        },

        isSunk(hits) {
            if (hits < this.length) {
                return this.sunk;
            } else if (hits >= this.length) {
                this.sunk = true;
                return this.sunk;
            }
        }

    }
}

function Gameboard() {

    return {
        activeBoard: [],

        shipMap: {},

        createBoard() { 
            if (this.activeBoard.length >= 100) return;
            for (let i = 1; i <= 100; i++) {
                let square = {};
                square.name = i;
                square.status = 'untargeted';
                square.occupied = 'no';
                
                this.activeBoard.push(square);
            }
            return this.activeBoard.length;
        },

        createShips() {
            this.shipMap.destroyer = new Ship(2, 'destroyer');
            this.shipMap.submarine = new Ship(3, 'submarine');
            this.shipMap.cruiser = new Ship(3, 'cruiser');
            this.shipMap.battleship = new Ship(4, 'battleship');
            this.shipMap.carrier = new Ship(5, 'carrier');
            return Object.keys(this.shipMap).length;
        },

        placeShip(ship, [x, y]) {
            let size = ship.length;
            ship.coordinates = [];
            if (size + x > 11) return 'Invalid Location';
            let mapCheck = (array) => {
                for (let i = 0; i < size; i++) {
                    let index = ((y * 10) + (x + i)) - 11;
                    if (array[index].occupied !== 'no') {
                        return true
                    }
                }
            }
            if (mapCheck(this.activeBoard) === true) {
                return 'Invalid Location';
            } else {
                for (let i = 0; i < size; i++) {
                    let index = ((y * 10) + (x + i)) - 11;
                    ship.coordinates.push({x: x+i, y});
                    let square = this.activeBoard[index];
                    square.occupied = ship.name;
                }
                return ship.coordinates;
            }
        },

        receiveAttack([x, y]) {
            let squareIndex = ((y * 10) + x) - 11;
            if (this.activeBoard[squareIndex].occupied !== 'no') {
                this.activeBoard[squareIndex].status = 'hit';
                let shipSelect = this.activeBoard[squareIndex].occupied;
                let ship = this.shipMap[`${shipSelect}`];
                ship.hits += 1;
                ship.isSunk(ship.hits);
                if (ship.sunk === true) {
                    this.activeBoard.forEach((square) => {
                        if (square.occupied === shipSelect) {
                            square.status = 'sunk';
                        }
                    })
                } else if (ship.sunk === false) {
                    this.activeBoard[squareIndex].status = 'hit';
                }
            } else if (this.activeBoard[squareIndex].occupied === 'no'){
                this.activeBoard[squareIndex].status = 'miss'
            }
            return this.activeBoard[squareIndex];
        }
    }
}

function Player(name) {
    return {
        name,

        untargetedSquares: [],

        knownShip: false,

        attackResult: 'miss',

        hitSquares: [],

        latestMove: undefined,

        launchAttack(opponent, [x, y]) {
            if (opponent === player1) {
                let attack = gameboard.receiveAttack([x, y]);
                if (attack.status === 'hit') {
                    this.hitSquares.push(attack);
                    this.knownShip = true;
                    this.attackResult = 'hit'
                } else if (attack.status === 'sunk') {
                    this.hitSquares.push(attack);
                    this.knownShip = false;
                    this.attackResult = 'hit';
                } 
                else {
                    this.attackResult = 'miss';
                }
            } else if (opponent === player2) {
                let attack = p2Gameboard.receiveAttack([x, y]);
                if (attack.status === 'hit') {
                    this.hitSquares.push(attack);
                    this.knownShip = true;
                } else if (attack.status === 'sunk') {
                    this.hitSquares.push(attack);
                    this.knownShip = false;
                }
                return attack.status;
            }
            renderSquareStatus('p1');
            renderSquareStatus('p2');
        },

        computerAttack() {
            if (game.checkWinner() === 'Player 1 Wins' || game.checkWinner() === 'Player 2 Wins') return;
            // if (this.knownShip === true) {
            //     return this.smartComputer();
            // } 
            // else if (this.knownShip === false) {
                this.untargetedSquares = [];
                for (let i = 0; i < gameboard.activeBoard.length; i++) {
                    if (gameboard.activeBoard[i].status === 'untargeted') {
                        this.untargetedSquares.push(gameboard.activeBoard[i]);
                    }
                }
                let randomChoice = Math.round(Math.random()*(this.untargetedSquares.length - 1));
                let squareSelect = this.untargetedSquares[randomChoice].name.toString();
                let yCoord; let xCoord;
                if (parseInt(squareSelect) < 10) {
                    yCoord = 1;
                    xCoord = parseInt(squareSelect);
                } else if (parseInt(squareSelect) % 10 === 0) {
                    yCoord = parseInt(squareSelect.slice(0, 1)) + 1;
                    xCoord = 10;
                } else {
                    yCoord = parseInt(squareSelect.slice(0, 1)) + 1;
                    xCoord = parseInt(squareSelect.slice(1));
                }
                this.launchAttack(player1, [xCoord, yCoord]);

                game.finishTurn('p2');

                return ([squareSelect, xCoord, yCoord, this.knownShip]);
            // }
        },

        smartComputer() {
            let squareAbove = {}; let squareBelow = {}; let squareLeft = {}; let squareRight = {};
            let recentHit = this.hitSquares[this.hitSquares.length - 1].name.toString();
            let yCoord;
            let xCoord;
            if (parseInt(recentHit) < 10) {
                yCoord = 1;
                xCoord = parseInt(recentHit);
            
            } else if (parseInt(recentHit) % 10 === 0) {
                yCoord = parseInt(recentHit.slice(0, 1)) + 1;
                xCoord = 10;
            } else {
                yCoord = parseInt(recentHit.slice(0, 1)) + 1;
                xCoord = parseInt(recentHit.slice(1));
            }
            if(yCoord + 1 <= 10) {
                // squareAbove.name = squareAbove;
                squareAbove.x = xCoord;
                squareAbove.y = yCoord + 1;
                squareAbove.goodMove = true;
                squareAbove.name = ((squareAbove.y * 10) + squareAbove.x - 10);
            }
            if (yCoord - 1 >= 1) {
                // squareBelow.name = squareBelow;
                squareBelow.x = xCoord;
                squareBelow.y = yCoord - 1;
                squareBelow.goodMove = true;
                squareBelow.name = ((squareBelow.y * 10) + squareBelow.x - 10);
            }
            if (xCoord + 1 <= 10) {
                // squareRight.name = squareRight;
                squareRight.x = xCoord + 1;
                squareRight.y = yCoord;
                squareRight.goodMove = true;
                squareRight.name = ((squareRight.y * 10) + squareRight.x - 10);
            }
            if (xCoord - 1 >= 1) {
                // squareLeft.name = squareLeft;
                squareLeft.x = xCoord - 1;
                squareLeft.y = yCoord;
                squareLeft.goodMove = true;
                squareLeft.name = ((squareLeft.y * 10) + squareLeft.x - 10);
            }

            let adjacentSquares = [squareAbove, squareBelow, squareLeft, squareRight];

            let brain = () => {
                let squareCheck = this.untargetedSquares.forEach((square) => {
                    return (square.name);
                })
                if (this.attackResult === 'miss') {
                    nextMoves.shift();
                    p2.launchAttack(player1, [nextMoves[0].x, nextMoves[0].y]);
                } else {
                    adjacentSquares.forEach((square) => {
                        if (squareCheck === square.name) {
                            nextMoves.push(square);
                        }
                    })
                }
            }

            return brain();
        }
    }
}

let ship = new Ship();
let gameboard = new Gameboard();
let p2Gameboard = new Gameboard();
let p1 = new Player('Tyler');
let p2 = new Player('Computer');

export const player1 = p1.name;
export const player2 = p2.name;

function Game (){
    return {
        startGame: true,

        playerTurn: undefined,

        unusedSquares: [],

        initializeGame() {
            gameboard.createBoard();
            p2Gameboard.createBoard();
            initializeSquares('p1');
            initializeSquares('p2');
            initializeHoverSquares('p1');
            initializeHoverSquares('p2');
            gameboard.createShips();
            p2Gameboard.createShips();
            this.script();
            this.computerPlacingShip();
            this.checkWinner();
        },

        placingShips(num, [x, y]) {
                if (num === 0) {
                    let placement = gameboard.placeShip(gameboard.shipMap.destroyer, [x, y]);
                    if (placement === 'Invalid Location') return 'Invalid Location'
                    this.displayPlayerShips();
                } else if (num === 1) {
                    let placement = gameboard.placeShip(gameboard.shipMap.submarine, [x, y]);
                    if (placement === 'Invalid Location') return 'Invalid Location'
                    this.displayPlayerShips();
                } else if (num === 2) {
                    let placement = gameboard.placeShip(gameboard.shipMap.cruiser, [x, y]);
                    if (placement === 'Invalid Location') return 'Invalid Location'
                    this.displayPlayerShips();
                } else if (num === 3) {
                    let placement = gameboard.placeShip(gameboard.shipMap.battleship, [x, y]);
                    if (placement === 'Invalid Location') return 'Invalid Location'
                    this.displayPlayerShips();
                } else if (num === 4) {
                    let placement = gameboard.placeShip(gameboard.shipMap.carrier, [x, y]);
                    if (placement === 'Invalid Location') return 'Invalid Location'
                    this.displayPlayerShips();
                    this.startGame = false;
                }
        },

        computerPlacingShip() {
            let getUnused = () => p2Gameboard.activeBoard.forEach((square) => {
                if (square.occupied === 'no') {
                    this.unusedSquares.push(square);
                }
            })

            let yCoord;
            let xCoord;

            let randomNum = () => {
                let num = Math.floor((Math.random() * (this.unusedSquares.length - 1)) + 1);
                let chosenSquare = this.unusedSquares[num].name.toString();
                if (parseInt(chosenSquare) < 10) {
                    yCoord = 1;
                    xCoord = parseInt(chosenSquare);
                
                } else if (parseInt(chosenSquare) % 10 === 0) {
                    yCoord = parseInt(chosenSquare.slice(0, 1)) + 1;
                    xCoord = 10;
                } else {
                    yCoord = parseInt(chosenSquare.slice(0, 1)) + 1;
                    xCoord = parseInt(chosenSquare.slice(1));
                }
                return;
            }

            let destroyer = () => {
                getUnused();
                randomNum();
                let placement = p2Gameboard.placeShip(p2Gameboard.shipMap.destroyer, [xCoord, yCoord])
                if (placement === 'Invalid Location') {
                    destroyer();
                } else {
                    placement;
                }
            }
            let submarine = () => {
                getUnused();
                randomNum();
                let placement = p2Gameboard.placeShip(p2Gameboard.shipMap.submarine, [xCoord, yCoord])
                if (placement === 'Invalid Location') {
                    submarine();
                } else {
                    placement;
                };
            }
            let cruiser = () => {
                getUnused();
                randomNum();
                let placement = p2Gameboard.placeShip(p2Gameboard.shipMap.cruiser, [xCoord, yCoord])
                if (placement === 'Invalid Location') {
                    cruiser();
                } else {
                    placement;
                };
            };
            let battleship = () => {
                getUnused();
                randomNum();
                let placement = p2Gameboard.placeShip(p2Gameboard.shipMap.battleship, [xCoord, yCoord])
                if (placement === 'Invalid Location') {
                    battleship();
                } else {
                    placement;
                };
            }
            let carrier = () => {
                getUnused();
                randomNum();
                let placement = p2Gameboard.placeShip(p2Gameboard.shipMap.carrier, [xCoord, yCoord])
                if (placement === 'Invalid Location') {
                    carrier();
                } else {
                    placement;
                };
            }
            destroyer(); submarine(); cruiser(); battleship(); carrier();
            console.log(p2Gameboard.shipMap);
        },

        displayPlayerShips() {
            let p1Squares = document.querySelectorAll('.p1Square');
            p1Squares.forEach((square) => {
                let target = gameboard.activeBoard[square.id.slice(2) - 1];
                if(target.occupied !== 'no') {
                    square.classList.add('squareHover');
                }
            })
        },

        finishTurn(player) {
            if (player === 'p1') {
                this.playerTurn = player2;
                setTimeout(() => {
                    p2.computerAttack();
                }, 100);
            } else if (player === 'p2') {
                this.playerTurn = player1;
            }
        },

        checkWinner() {
            let p1SunkValues = [];
            let p2SunkValues = [];
            const isTrue = (value) => value === true;
            for (const ships in gameboard.shipMap) {
                p1SunkValues.push(gameboard.shipMap[ships].sunk);
            }
            for (const ships in p2Gameboard.shipMap) {
                p2SunkValues.push(p2Gameboard.shipMap[ships].sunk);
            }
            if (p1SunkValues.every(isTrue)) {
                script.textContent = 'P2 Wins'
                return ('Player 2 Wins');
            }
            if (p2SunkValues.every(isTrue)) {
                script.textContent = 'P1 Wins'
                return ('Player 1 Wins');
            }
            p1SunkValues = [];
            p2SunkValues = [];
        },

        script() {
            if (this.startGame === true) {
                if (counter === 0) {
                    script.textContent = 'Place Your Destroyer(2)';
                } else if (counter === 1) {
                    script.textContent = 'Place Your Submarine(3)';
                } else if (counter === 2) {
                    script.textContent = 'Place Your Cruiser(3)';
                } else if (counter === 3) {
                    script.textContent = 'Place Your Battleship(4)';
                } else if (counter === 4) {
                    script.textContent = 'Place Your Carrier(5)';
                }
            } else if (this.startGame == false) {
                script.textContent = "It's Your Turn! Fire at P2 Gameboard";
            }
        },

        resetGame() {
            gameboard.activeBoard = [];
            p2Gameboard.activeBoard = [];
            gameboard.shipMap = {};
            p2Gameboard.shipMap = {};

            p2.untargetedSquares = [];
            p2.knownShip = false;
            p2.attackResult = 'miss';
            p2.hitSquares = [];
            p2.latestMove = undefined;
            this.startGame = true;
            this.playerTurn = undefined;
            this.unusedSquares = [];
            renderSquareStatus('p1');
            renderSquareStatus('p2');
            this.initializeGame();
        }
    }
}

let game = new Game();
game.initializeGame();

export { ship, gameboard, p2Gameboard, p1, p2, game };

