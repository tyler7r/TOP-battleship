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
                    if (array[index].occupied !== undefined) {
                        return true
                    }
                }
            }
            if (mapCheck(this.activeBoard) === true) {
                return 'Invalid Location'
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
            if (this.activeBoard[squareIndex].occupied !== undefined) {
                this.activeBoard[squareIndex].status = 'hit';
                let shipSelect = this.activeBoard[squareIndex].occupied;
                let ship = this.shipMap[`${shipSelect}`];
                ship.hits += 1;
                ship.isSunk(ship.hits);
                if (ship.sunk === true) {
                    this.activeBoard[squareIndex].status = 'sunk'
                } else if (ship.sunk === false) {
                    this.activeBoard[squareIndex].status = 'hit';
                }
            } else {
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

        hitSquares: [],

        launchAttack(opponent, [x, y]) {
            if (opponent === player1) {
                let attack = gameboard.receiveAttack([x, y]);
                if (attack.status === 'hit') {
                    this.hitSquares.push(attack);
                    this.knownShip = true;
                } else if (attack.status = 'sunk') {
                    this.hitSquares.push(attack);
                    this.knownShip = false;
                } 
                else {
                    this.knownShip = false;
                }
            } else if (opponent === player2) {
                let attack = p2Gameboard.receiveAttack([x, y]);
                if (attack.status === 'hit') {
                    this.hitSquares.push(attack);
                    this.knownShip = true;
                } else if (attack.status = 'sunk') {
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
                for (let i = 0; i < this.activeBoard.length; i++) {
                    if (this.activeBoard[i].status === 'untargeted') {
                        this.untargetedSquares.push(this.activeBoard[i]);
                    }
                }
                let randomChoice = Math.round(Math.random()*(this.untargetedSquares.length - 1));
                let squareSelect = this.untargetedSquares[randomChoice].name.toString();
                let yCoord; let xCoord;
                if (parseInt(squareSelect) < 10) {
                    yCoord = 1;
                    xCoord = parseInt(squareSelect);
                } else {
                    yCoord = parseInt(squareSelect.slice(0, 1)) + 1;
                    xCoord = parseInt(squareSelect.slice(1));
                }
                this.launchAttack(player1, [xCoord, yCoord]);
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
            } else {
                yCoord = parseInt(recentHit.slice(0, 1)) + 1;
                xCoord = parseInt(recentHit.slice(1)) - 1;
            }
            if(yCoord + 1 <= 10) {
                squareAbove.x = xCoord;
                squareAbove.y = yCoord + 1;
                squareAbove.goodMove = true;
            }
            if (yCoord - 1 >= 1) {
                squareBelow.x = xCoord;
                squareBelow.y = yCoord - 1;
                squareBelow.goodMove = true;
            }
            if (xCoord + 1 <= 10) {
                squareRight.x = xCoord + 1;
                squareRight.y = yCoord;
                squareRight.goodMove = true;
            }
            if (xCoord - 1 >= 1) {
                squareLeft.x = xCoord - 1;
                squareLeft.y = yCoord;
                squareLeft.goodMove = true;
            }
            
            return [squareAbove, squareBelow, squareLeft, squareRight];
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

export { ship, gameboard, p2Gameboard, p1, p2 };

