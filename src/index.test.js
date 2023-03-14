import { ship } from "./index";

describe('Ship Factory Function Property Check', () => {
    test('Ship length recorded properly', () => {
        expect(ship.length).toBe(4);
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
        expect(ship.isSunk(3)).toBe(false);
    })
    test('isSunk method returns true when hits > length', () => {
        expect(ship.isSunk(4)).toBe(true);
    })
    test('hits does not increase after ship is sunk', () => {
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hits).toBeLessThanOrEqual(4);
    })
})

