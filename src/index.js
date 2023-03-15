export let activeBoard = [];
export function createBoard() { 
    if (activeBoard.length >= 100) return;
    for (let i = 1; i <= 100; i++) {
        let square = {};
        square.name = i;
        square.status = 'untargeted';
        activeBoard.push(square);
    }
    return activeBoard.length;
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

        placeShip(ship, [x, y]) {
            let size = ship.length;
            ship.coordinates = [];
            if (size + x > 10) return 'Invalid Location'
            for (let i = 0; i < size; i++) {
                ship.coordinates.push({x: x+i, y});
                let index = ((y * 10) + (x + i)) - 11;
                let square = activeBoard[index];
                square.occupied = ship.name;
            }
            return ship.coordinates;
        },

        receiveAttack([x, y]) {
            let squareIndex = ((y * 10) + x) - 11;
            activeBoard[squareIndex].status = 'attacked';
            let shipSelect = activeBoard[squareIndex].occupied;
            let ship = this.shipMap[`${shipSelect}`];
            ship.hits += 1;
            ship.isSunk(ship.hits);
            return activeBoard[squareIndex];
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

