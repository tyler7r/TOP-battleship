
function createGameBoard() {

}

export function Ship(name, length) {
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

export function Gameboard() {
    return {

        placeShip() {
            
        },

        receiveAttack() {

        }
    }
}

export function Player() {
    return {

    }
}

export let ship = new Ship('battleship', 4);

