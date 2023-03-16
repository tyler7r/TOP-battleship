import { gameboard, p2Gameboard, p1, p2, player1, player2, game } from ".";

export let xCoord;
export let yCoord;
export let counter = 0;

const p1Gameboard = document.querySelector('.p1Gameboard')
export function createP1Board() {
    for (let i = 1; i <= 10; i++) {
        let column = document.createElement('div');
        column.classList.add('column');
        p1Gameboard.appendChild(column);
        for (let j = 9; j >= 0; j--) {
            let square = document.createElement('div');
            square.classList.add('p1Square');
            if (i === 10) {
                square.setAttribute('id', `sq${j+1}0`);
            } else if (j === 0) {
                square.setAttribute('id', `sq${i}`)
            } else {
                square.setAttribute('id', `sq${j}${i}`);
            }
            column.appendChild(square);
        }
    }
}
const p2gameboard = document.querySelector('.p2Gameboard');
export function createP2Board() {
    for (let i = 1; i <= 10; i++) {
        let column = document.createElement('div');
        column.classList.add('column');
        p2gameboard.appendChild(column);
        for (let j = 9; j >= 0; j--) {
            let square = document.createElement('div');
            square.classList.add('p2Square');
            if (i === 10) {
                square.setAttribute('id', `sq${j+1}0`);
            } else if (j === 0) {
                square.setAttribute('id', `sq${i}`);
            } else {
                square.setAttribute('id', `sq${j}${i}`);
            }
            column.appendChild(square);
        }
    }
}

export function renderSquareStatus(player) {
    let activeBoard;
    if (player === 'p1') {
        activeBoard = gameboard.activeBoard;
    } else if (player === 'p2') {
        activeBoard = p2Gameboard.activeBoard;
    }
    for (let i = 0; i < activeBoard.length; i++) {
        let number = (activeBoard[i].name);
        let square = document.querySelector(`.${player}Square#sq${number}`);
        if (activeBoard[i].status === 'hit') {
            square.textContent = 'H';
        } else if (activeBoard[i].status === 'miss') {
            square.textContent = 'M'
        } else if (activeBoard[i].status === 'untargeted'){
            square.textContent = '';
        } else if (activeBoard[i].status === 'sunk') {
            square.textContent = 'X'
        }
    }
}

export function initializeSquares(player) {
    let squares = document.querySelectorAll(`.${player}Square`);
    squares.forEach((square) => {
        square.addEventListener('click', (e) => {
            if (game.checkWinner() === 'Player 1 Wins' || game.checkWinner() === 'Player 2 Wins') return;
            let target = (e.target.id.slice(2));
            if (parseInt(target) < 10) {
                xCoord = parseInt(target);
                yCoord = 1;
            } else if (parseInt(target) === 100) {
                xCoord = 10;
                yCoord = 10;
            } else if (parseInt(target) % 10 === 0) {
                xCoord = 10;
                yCoord = parseInt(target.slice(0, 1));
            } else {
                xCoord = parseInt(target.slice(target.length - 1));
                yCoord = parseInt(target.slice(0, 1)) + 1;
            }
            if (game.startGame === true) {
                if (e.target.className.includes('p2')) return;
                let placement = game.placingShips(counter, [xCoord, yCoord]);
                if (placement === 'Invalid Location') {counter -= 1};
                counter += 1;
            } else {
                if (e.target.className.includes('p1')) return;
                let squareIndex = ((yCoord * 10) + xCoord) - 11;
                if(player === 'p1') {
                    if (gameboard.activeBoard[squareIndex].status !== 'untargeted') return;
                    p2.launchAttack(player1, [xCoord, yCoord]);
                } else if (player === 'p2') {
                    if (p2Gameboard.activeBoard[squareIndex].status !== 'untargeted') return;
                    p1.launchAttack(player2, [xCoord, yCoord]);
                    game.finishTurn('p1');
                }
                renderSquareStatus('p1');
                renderSquareStatus('p2');
            }
        })
    })
}

export function initializeHoverSquares(player) {
    let squares = document.querySelectorAll(`.${player}Square`);
    squares.forEach((square) => {
        square.addEventListener('mouseover', (e) => {
            let target = (e.target.id.slice(2));
            if (parseInt(target) < 10) {
                xCoord = parseInt(target);
                yCoord = 1;
            } else if (parseInt(target) === 100) {
                xCoord = 10;
                yCoord = 10;
            } else if (parseInt(target) % 10 === 0) {
                xCoord = 10;
                yCoord = parseInt(target.slice(0, 1));
            } else {
                xCoord = parseInt(target.slice(target.length - 1));
                yCoord = parseInt(target.slice(0, 1)) + 1;
            }
            let squareSelect = document.querySelector(`.${player}Square#sq${target}`);
            if (game.startGame === true) {
                // squareSelect.classList.add('squareHover');
            }
            square.addEventListener('mouseleave', (e) => {
                // squareSelect.classList.remove('squareHover');
            })
        })
    })
}

const reset = document.querySelector('.resetBtn');
reset.addEventListener('click', () => {
    counter = 0;
    const p1Squares = document.querySelectorAll('.p1Square');
    p1Squares.forEach((square) => {
        square.classList.remove('squareHover');
        square.textContent = '';
    })
    const p2Squares = document.querySelectorAll('.p2Square');
    p2Squares.forEach((square) => {
        square.textContent = '';
    })
    game.resetGame();
})
