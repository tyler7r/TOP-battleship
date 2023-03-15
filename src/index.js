export let p1Board = [];
export let p2Board = [];

export function createBoard() { 
    if (p1Board.length >= 100 || p2Board.length >= 100) return;
    for (let i = 1; i <= 100; i++) {
        let square = {};
        square.name = i;
        square.status = 'untargeted';
        
        p1Board.push(square);
        p2Board.push(square);
    }
    return p1Board.length;
};

createBoard();

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
        shipMap: {},

        createShips() {
            this.shipMap.destroyer = new Ship(2, 'destroyer');
            this.shipMap.submarine = new Ship(3, 'submarine');
            this.shipMap.cruiser = new Ship(3, 'cruiser');
            this.shipMap.battleship = new Ship(4, 'battleship');
            this.shipMap.carrier = new Ship(5, 'carrier');
            return Object.keys(this.shipMap).length;
        },

        placeShip(player, ship, [x, y]) {
            let size = ship.length;
            ship.coordinates = [];
            if (size + x > 11) return 'Invalid Location'
            for (let i = 0; i < size; i++) {
                ship.coordinates.push({x: x+i, y});
                let index = ((y * 10) + (x + i)) - 11;
                if (player === player1) {
                    let square = p1Board[index];
                    square.occupied = ship.name;
                } else if (player === player2) {
                    let square = p2Board[index];
                    square.occupied = ship.name;
                }
            }
            return ship.coordinates;
        },

        receiveAttack(player, [x, y]) {
            let squareIndex = ((y * 10) + x) - 11;
            if (player === player1) {
                if (p1Board[squareIndex].occupied !== undefined) {
                    p1Board[squareIndex].status = 'hit';
                    let shipSelect = p1Board[squareIndex].occupied;
                    let ship = this.shipMap[`${shipSelect}`];
                    ship.hits += 1;
                    ship.isSunk(ship.hits);
                } else if (p1Board[squareIndex].occupied){
                    p1Board[squareIndex].status = 'miss';
                }
                return p1Board[squareIndex];
            } else if (player === player2) {
                if (p2Board[squareIndex].occupied !== undefined) {
                    p2Board[squareIndex].status = 'hit';
                    let shipSelect = p2Board[squareIndex].occupied;
                    let ship = this.shipMap[`${shipSelect}`];
                    ship.hits += 1;
                    ship.isSunk(ship.hits);
                } else {
                    p2Board[squareIndex].status = 'miss'
                }
                return p2Board[squareIndex];
            }
        }
    }
}

function Player(name) {
    return {
        name,

        untargetedSquares: [],

        attackResult: 'miss',

        hitSquares: [],

        launchAttack(opponent, [x, y]) {
            if (opponent === player1) {
                let attack = gameboard.receiveAttack(opponent, [x, y]);
                if (attack.status === 'hit') {
                    this.hitSquares.push(attack);
                    this.attackResult = 'hit'
                } else {
                    this.attackResult = 'miss'
                }
            } else if (opponent === player2) {
                let attack = p2Gameboard.receiveAttack(opponent, [x, y]);
                if (attack === 'hit') {
                    this.hitSquares.push(attack);
                    this.attackResult = 'hit';
                } else {
                    this.attackResult = 'miss';
                }
            }
        },

        computerAttack() {
            this.untargetedSquares = [];
            for (let i = 0; i < p1Board.length; i++) {
                if (p1Board[i].status === 'untargeted') {
                    this.untargetedSquares.push(p1Board[i]);
                }
            }
            let randomChoice = Math.round(Math.random()*(this.untargetedSquares.length - 1));
            let squareSelect = this.untargetedSquares[randomChoice].name.toString();
            let yCoord = parseInt(squareSelect.slice(0, 1)) + 1;
            let xCoord = parseInt(squareSelect.slice(1));

            this.launchAttack(player1, [xCoord, yCoord]);
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

export { ship, gameboard, p1, p2 };

