/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createBoard\": () => (/* binding */ createBoard),\n/* harmony export */   \"gameboard\": () => (/* binding */ gameboard),\n/* harmony export */   \"p1\": () => (/* binding */ p1),\n/* harmony export */   \"p1Board\": () => (/* binding */ p1Board),\n/* harmony export */   \"p2\": () => (/* binding */ p2),\n/* harmony export */   \"p2Board\": () => (/* binding */ p2Board),\n/* harmony export */   \"player1\": () => (/* binding */ player1),\n/* harmony export */   \"player2\": () => (/* binding */ player2),\n/* harmony export */   \"ship\": () => (/* binding */ ship)\n/* harmony export */ });\nlet p1Board = [];\nlet p2Board = [];\n\nfunction createBoard() { \n    if (p1Board.length >= 100 || p2Board.length >= 100) return;\n    for (let i = 1; i <= 100; i++) {\n        let square = {};\n        square.name = i;\n        square.status = 'untargeted';\n        \n        p1Board.push(square);\n        p2Board.push(square);\n    }\n    return p1Board.length;\n};\n\ncreateBoard();\n\nfunction Ship(length = 2, name = 'battleship') {\n    return {\n        name,\n        length,\n        hits: 0,\n        sunk: false,\n        \n        hit() {\n            if (this.sunk === true) return this.length;\n            this.hits += 1;\n            return this.hits;\n        },\n        isSunk(hits) {\n            if (hits < this.length) {\n                return this.sunk;\n            } else if (hits >= this.length) {\n                this.sunk = true;\n                return this.sunk;\n            }\n        }\n\n    }\n}\n\nfunction Gameboard() {\n\n    return {\n        shipMap: {},\n\n        createShips() {\n            this.shipMap.destroyer = new Ship(2, 'destroyer');\n            this.shipMap.submarine = new Ship(3, 'submarine');\n            this.shipMap.cruiser = new Ship(3, 'cruiser');\n            this.shipMap.battleship = new Ship(4, 'battleship');\n            this.shipMap.carrier = new Ship(5, 'carrier');\n            return Object.keys(this.shipMap).length;\n        },\n\n        placeShip(player, ship, [x, y]) {\n            let size = ship.length;\n            ship.coordinates = [];\n            if (size + x > 11) return 'Invalid Location'\n            for (let i = 0; i < size; i++) {\n                ship.coordinates.push({x: x+i, y});\n                let index = ((y * 10) + (x + i)) - 11;\n                if (player === player1) {\n                    let square = p1Board[index];\n                    square.occupied = ship.name;\n                } else if (player === player2) {\n                    let square = p2Board[index];\n                    square.occupied = ship.name;\n                }\n            }\n            return ship.coordinates;\n        },\n\n        receiveAttack(player, [x, y]) {\n            let squareIndex = ((y * 10) + x) - 11;\n            if (player === player1) {\n                if (p1Board[squareIndex].occupied !== undefined) {\n                    p1Board[squareIndex].status = 'hit';\n                    let shipSelect = p1Board[squareIndex].occupied;\n                    let ship = this.shipMap[`${shipSelect}`];\n                    ship.hits += 1;\n                    ship.isSunk(ship.hits);\n                } else if (p1Board[squareIndex].occupied){\n                    p1Board[squareIndex].status = 'miss';\n                }\n                return p1Board[squareIndex];\n            } else if (player === player2) {\n                if (p2Board[squareIndex].occupied !== undefined) {\n                    p2Board[squareIndex].status = 'hit';\n                    let shipSelect = p2Board[squareIndex].occupied;\n                    let ship = this.shipMap[`${shipSelect}`];\n                    ship.hits += 1;\n                    ship.isSunk(ship.hits);\n                } else {\n                    p2Board[squareIndex].status = 'miss'\n                }\n                return p2Board[squareIndex];\n            }\n        }\n    }\n}\n\nfunction Player(name) {\n    return {\n        name,\n\n        untargetedSquares: [],\n\n        attackResult: 'miss',\n\n        hitSquares: [],\n\n        launchAttack(opponent, [x, y]) {\n            if (opponent === player1) {\n                let attack = gameboard.receiveAttack(opponent, [x, y]);\n                if (attack.status === 'hit') {\n                    this.hitSquares.push(attack);\n                    this.attackResult = 'hit'\n                } else {\n                    this.attackResult = 'miss'\n                }\n            } else if (opponent === player2) {\n                let attack = p2Gameboard.receiveAttack(opponent, [x, y]);\n                if (attack === 'hit') {\n                    this.hitSquares.push(attack);\n                    this.attackResult = 'hit';\n                } else {\n                    this.attackResult = 'miss';\n                }\n            }\n        },\n\n        computerAttack() {\n            this.untargetedSquares = [];\n            for (let i = 0; i < p1Board.length; i++) {\n                if (p1Board[i].status === 'untargeted') {\n                    this.untargetedSquares.push(p1Board[i]);\n                }\n            }\n            let randomChoice = Math.round(Math.random()*(this.untargetedSquares.length - 1));\n            let squareSelect = this.untargetedSquares[randomChoice].name.toString();\n            let yCoord = parseInt(squareSelect.slice(0, 1)) + 1;\n            let xCoord = parseInt(squareSelect.slice(1));\n\n            this.launchAttack(player1, [xCoord, yCoord]);\n        }\n    }\n}\n\nlet ship = new Ship();\nlet gameboard = new Gameboard();\nlet p2Gameboard = new Gameboard();\nlet p1 = new Player('Tyler');\nlet p2 = new Player('Computer');\n\nconst player1 = p1.name;\nconst player2 = p2.name;\n\n\n\n\n\n//# sourceURL=webpack://top-battleship/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;