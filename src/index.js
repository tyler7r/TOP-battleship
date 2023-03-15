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
            if (size + x > 10) return 'Invalid Location'
            for (let i = 0; i < size; i++) {
                ship.coordinates.push({x: x+i, y});
                let index = ((y * 10) + (x + i)) - 11;
                if (player === 'p1') {
                    let square = p1Board[index];
                    square.occupied = ship.name;
                } else if (player === 'p2') {
                    let square = p2Board[index];
                    square.occupied = ship.name;
                }
            }
            return ship.coordinates;
        },

        receiveAttack(player, [x, y]) {
            let squareIndex = ((y * 10) + x) - 11;
            if (player === 'p1') {
                p1Board[squareIndex].status = 'attacked';
                let shipSelect = p1Board[squareIndex].occupied;
                let ship = this.shipMap[`${shipSelect}`];
                ship.hits += 1;
                ship.isSunk(ship.hits);
                return p1Board[squareIndex];
            } else if (player === 'p2') {
                p2Board[squareIndex].status = 'attacked';
                let shipSelect = p2Board[squareIndex].occupied;
                let ship = this.shipMap[`${shipSelect}`];
                ship.hits += 1;
                ship.isSunk(ship.hits);
                return p2Board[squareIndex];
            }
        }
    }
}

function Player() {
    return {

    }
}

let ship = new Ship();
let gameboard = new Gameboard();

export { ship, gameboard };

