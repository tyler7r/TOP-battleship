import { createP1Board, createP2Board, initializeSquares, renderSquareStatus, xCoord, yCoord, initializeHoverSquares } from "./renderDOM";

createP1Board();
createP2Board();

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
                console.log(ship.coordinates);
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
                    this.knownShip = false;
                    this.attackResult = 'miss';
                }
                return attack;
            } else if (opponent === player2) {
                let attack = p2Gameboard.receiveAttack([x, y]);
                if (attack.status === 'hit') {
                    this.hitSquares.push(attack);
                    this.knownShip = true;
                } else if (attack.status === 'sunk') {
                    this.hitSquares.push(attack);
                    this.knownShip = false;
                } 
                else {
                    this.knownShip = false;
                }
            }
        },

        computerAttack() {
            if (this.knownShip === true) {
                return this.smartComputer();
            } else if (this.knownShip === false) {
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

                return [squareSelect, xCoord, yCoord, this.knownShip];
            }
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
            }
            if (yCoord - 1 >= 1) {
                // squareBelow.name = squareBelow;
                squareBelow.x = xCoord;
                squareBelow.y = yCoord - 1;
                squareBelow.goodMove = true;
            }
            if (xCoord + 1 <= 10) {
                // squareRight.name = squareRight;
                squareRight.x = xCoord + 1;
                squareRight.y = yCoord;
                squareRight.goodMove = true;
            }
            if (xCoord - 1 >= 1) {
                // squareLeft.name = squareLeft;
                squareLeft.x = xCoord - 1;
                squareLeft.y = yCoord;
                squareLeft.goodMove = true;
            }
            
            let brain = () => {
                if (this.latestMove !== undefined) {
                    this.latestMove.goodMove = false;
                }
                let possibleMoves = [squareAbove, squareBelow, squareLeft, squareRight];
                let smartMoves = [];
                for (let i = 0; i < possibleMoves.length; i++) {
                    if (possibleMoves[i].goodMove === true) {
                        smartMoves.push(possibleMoves[i]);
                    }
                }
                this.latestMove = smartMoves[0];
                this.launchAttack(player1, [smartMoves[0].x, smartMoves[0].y]);
                return smartMoves;
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

        playerTurn: player1,

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
            this.computerPlacingShip();
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

        changePlayer() {

        }
    }
}

let game = new Game();
game.initializeGame();

export { ship, gameboard, p2Gameboard, p1, p2, game };

