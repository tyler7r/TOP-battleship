function createGameBoard() {

}

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
        placeShip([x, y]) {
            let createdShip = new Ship();
            createdShip.coordinates = [];
            createdShip.coordinates.push({x, y});
            createdShip.coordinates.push({x, y:y+1});
            return createdShip.coordinates;
        },

        receiveAttack() {

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

