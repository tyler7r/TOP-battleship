import { ship, gameboard, activeBoard, createBoard } from "./index";

describe('Ship Factory Function Property Check', () => {
    test('Ship length recorded properly', () => {
        expect(ship.length).toBe(2);
    })
    test('Ship name recorded properly', () => {
        expect(ship.name).toBe('battleship');
    })
    test('Ship hits initial value set', () => {
        expect(ship.hits).toBe(0);
    })
    test('Ship sunk initial value', () => {
        expect(ship.sunk).toBe(false);
    })
})

describe('Ship Factory Function Method Check', () => {
    test('hit method accumulates ship.hits', () => {
        expect(ship.hit()).toBe(1);
    })
    test('hit method returns hit property', () =>  {
        expect(ship.hit()).toBe(ship.hits);
    })
    test('isSunk method returns false when hits < length', () => {
        expect(ship.isSunk(1)).toBe(false);
    })
    test('isSunk method returns true when hits > length', () => {
        expect(ship.isSunk(4)).toBe(true);
    })
    test('hits does not increase after ship is sunk', () => {
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hits).toBe(2);
    })
})

describe('Gameboard Method Check', () => {
    test('createShips creates five ships and stores them in shipMap', () => {
        expect(gameboard.createShips()).toBe(5);
    })
    describe('shipMap contains all five ships', () => {
        test('Contains destroyer', () => {
            expect(gameboard.shipMap.destroyer).toBeTruthy();
        })
        test('Contains submarine', () => {
            expect(gameboard.shipMap.submarine).toBeTruthy();
        })
        test('Contains cruiser', () => {
            expect(gameboard.shipMap.cruiser).toBeTruthy();
        })
        test('Contains battleship', () => {
            expect(gameboard.shipMap.battleship).toBeTruthy();
        })
        test('Contains carrier', () => {
            expect(gameboard.shipMap.carrier).toBeTruthy();        })
    })
    describe('placeShip returns new ships coordinates. Ship length and board size accounted for', () => {
        test('destroyer coordinates correct', () => {
            expect(gameboard.placeShip(gameboard.shipMap.destroyer, [3, 4])).toStrictEqual([{x:3, y:4}, {x:4, y:4}]);
        })
        test('carrier coordinates correct', () => {
            expect(gameboard.placeShip(gameboard.shipMap.carrier, [5, 2])).toStrictEqual([{x: 5, y: 2}, {x: 6, y:2}, {x: 7, y: 2}, {x: 8, y: 2}, {x: 9, y: 2}]);
        })
        test('will not allow ship to placed off the 10x10 gameboard', () => {
            expect(gameboard.placeShip(gameboard.shipMap.carrier, [8, 5])).toBe('Invalid Location');
        })
        test('After ship is placed, it should add a property to the associated squares with the name of the ship that is placed on it', () => {
            expect(activeBoard[14].occupied).toBe('carrier');
            expect(activeBoard[17].occupied).toBe('carrier');
        })
    })
    describe('receiveAttack takes in coordinates and adjusts gameboard as necessary', () => {
        test('receiveAttack returns which square was attacked', () => {
            expect(gameboard.receiveAttack([4, 4])).toBe(activeBoard[33]);
        })
        test("receiveAttack updates the attacked squares's status", () => {
            expect(activeBoard[33].status).toBe('attacked');
        })
        test('receiveAttack updates the number of hits on the ship locatd on the square', () => {
            expect(gameboard.shipMap.destroyer.hits).toBe(1);
        })
        test('receiveAttack will update sunk status of ship if the last attack kills the ship', () => {
            expect(gameboard.receiveAttack([3, 4])).toBe(activeBoard[32]);
            expect(gameboard.shipMap.destroyer.sunk).toBeTruthy();
        })
        test('receiveAttack continued test', () => {
            expect(gameboard.receiveAttack([5, 2])).toBe(activeBoard[14]);
            expect(gameboard.shipMap.carrier.hits).toBe(1);
            gameboard.receiveAttack([6, 2]);
            gameboard.receiveAttack([7, 2]);
            gameboard.receiveAttack([8, 2]);
            expect(gameboard.shipMap.carrier.hits).toBe(4);
            gameboard.receiveAttack([9, 2]);
            expect(gameboard.shipMap.carrier.sunk).toBeTruthy();
        })
    })
})

