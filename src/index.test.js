import { ship, gameboard, p2Gameboard, p1, p2, player1, player2, game } from "./index";

describe.skip('Ship Factory Function Property Check', () => {
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

describe.skip('Ship Factory Function Method Check', () => {
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

describe.skip('Gameboard Method Check', () => {
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
    describe.skip('placeShip returns new ships coordinates. Ship length and board size accounted for', () => {
        test('createBoard will create an active playing Board for both players', () => {
            gameboard.createBoard();
            expect(gameboard.activeBoard.length).toBe(100);
            p2Gameboard.createBoard();
            expect(p2Gameboard.activeBoard.length).toBe(100);
        })
        test('createBoard will never create more than 100 squares, if accidentally called a second time', () => {
            gameboard.createBoard();
            expect(gameboard.activeBoard.length).toBe(100);
        })
        test('destroyer coordinates correct', () => {
            expect(gameboard.placeShip(gameboard.shipMap.destroyer, [3, 4])).toStrictEqual([{x:3, y:4}, {x:4, y:4}]);
        })
        test('carrier coordinates correct', () => {
            expect(gameboard.placeShip(gameboard.shipMap.carrier, [5, 2])).toStrictEqual([{x: 5, y: 2}, {x: 6, y:2}, {x: 7, y: 2}, {x: 8, y: 2}, {x: 9, y: 2}]);
        })
        test('will not allow ship to placed off the 10x10 gameboard', () => {
            expect(gameboard.placeShip(gameboard.shipMap.carrier, [8, 5])).toBe('Invalid Location');
        })
        test('will not allow ship to be place on top of another ship', () => {
            expect(gameboard.placeShip(gameboard.shipMap.submarine, [3, 2])).toBe('Invalid Location');
        })
        test('will not allow even a portion of the ship to be placed when it will result in the ship on top of another ship', () => {
            expect(gameboard.activeBoard[12].occupied).toBeUndefined();
        });

        test('After ship is placed, it should add a property to the associated squares with the name of the ship that is placed on it', () => {
            expect(gameboard.activeBoard[14].occupied).toBe('carrier');
            expect(gameboard.activeBoard[17].occupied).toBe('carrier');
        })
    })
    describe.skip('receiveAttack takes in coordinates and adjusts gameboard as necessary', () => {
        test('receiveAttack returns which square was attacked', () => {
            expect(gameboard.receiveAttack([4, 4])).toBe(gameboard.activeBoard[33]);
        })
        test("receiveAttack updates the attacked squares's status", () => {
            expect(gameboard.activeBoard[33].status).not.toBe('untargeted');
        })
        test('receiveAttack updates the number of hits on the ship locatd on the square', () => {
            expect(gameboard.shipMap.destroyer.hits).toBe(1);
        })
        test('receiveAttack will update sunk status of ship if the last attack kills the ship', () => {
            expect(gameboard.receiveAttack([3, 4])).toBe(gameboard.activeBoard[32]);
            expect(gameboard.shipMap.destroyer.sunk).toBeTruthy();
        })
        test('receiveAttack continued test', () => {
            expect(gameboard.receiveAttack([5, 2])).toBe(gameboard.activeBoard[14]);
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

describe.skip('Player method check', () => {
    test('Player name is updated based on entry', () => {
        expect(player1).toBe('Tyler');
    })
    describe('Player can launch attack on opposing player board', () => {
        test('launchAttack updates attacked player activeBoard', () => {
            gameboard.placeShip(gameboard.shipMap.cruiser, [8, 1]);
            p2.launchAttack(player1, [9, 1]);
            expect(gameboard.activeBoard[8].status).toBe('hit');
        })
        test('launchAttack updates hitSquares array in player object', () => {
            expect(p2.hitSquares[0]).toBe(gameboard.activeBoard[8]);
        })
        test('launchAttack updates, attacked ship hits value', () => {
            expect(gameboard.shipMap.cruiser.hits).toBe(1);
        })
        test('launchAttack updates isSunk property when the ship has been hit at all coordinates', () => {
            p2.launchAttack(player1, [8, 1]);
            p2.launchAttack(player1, [10, 1]);
            expect(gameboard.shipMap.cruiser.sunk).toBeTruthy();
        })
    })
})
describe.skip('AI method checks', () => {
    test('Computer will fire on an untargeted square and update the activeBoard accordingly', () => {
        gameboard.createShips();
        gameboard.placeShip(gameboard.shipMap.battleship, [1, 1]);
        p2.computerAttack();
        expect(p2.knownShip).toBe(false);
        expect(p2.untargetedSquares.length).toBe(99);
    })
    test('Computer can fire a smart shot based on the last hit target', () => {
        p2Gameboard.placeShip(gameboard.shipMap.carrier, [5, 8]);
        // p2.computerAttack();
        expect(p2.launchAttack(player1, [6, 8])).toBe(false);
        expect(p2.computerAttack()).toBe(false);
    })
})

describe.skip('Game loop', () => {
    test('Will start the game with player1 turn', () => {
        expect(game.playerTurn).toBe(player1);
    })
    test('Will change player turn after each fired shot', () => {
        p1.launchAttack(player2, [1, 1]);
        expect(game.playerTurn).toBe(player2);
    })
    test('Will know when all the ships are sunk and who won' , () => {
        expect(game.checkWinner()).toBe(player2);
    })
    test('Will be able to reset the board', () => {
        expect(gameboard.shipMap).toBe({});
        expect(p2Gameboard.shipMap).toBe({});
    })
})

