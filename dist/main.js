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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"gameboard\": () => (/* binding */ gameboard),\n/* harmony export */   \"p1\": () => (/* binding */ p1),\n/* harmony export */   \"p2\": () => (/* binding */ p2),\n/* harmony export */   \"p2Gameboard\": () => (/* binding */ p2Gameboard),\n/* harmony export */   \"player1\": () => (/* binding */ player1),\n/* harmony export */   \"player2\": () => (/* binding */ player2),\n/* harmony export */   \"ship\": () => (/* binding */ ship)\n/* harmony export */ });\nfunction Ship(length = 2, name = 'battleship') {\n    return {\n        name,\n        length,\n        hits: 0,\n        sunk: false,\n        \n        hit() {\n            if (this.sunk === true) return this.length;\n            this.hits += 1;\n            return this.hits;\n        },\n\n        isSunk(hits) {\n            if (hits < this.length) {\n                return this.sunk;\n            } else if (hits >= this.length) {\n                this.sunk = true;\n                return this.sunk;\n            }\n        }\n\n    }\n}\n\nfunction Gameboard() {\n\n    return {\n        activeBoard: [],\n\n        shipMap: {},\n\n        createBoard() { \n            if (this.activeBoard.length >= 100) return;\n            for (let i = 1; i <= 100; i++) {\n                let square = {};\n                square.name = i;\n                square.status = 'untargeted';\n                \n                this.activeBoard.push(square);\n            }\n            return this.activeBoard.length;\n        },\n\n        createShips() {\n            this.shipMap.destroyer = new Ship(2, 'destroyer');\n            this.shipMap.submarine = new Ship(3, 'submarine');\n            this.shipMap.cruiser = new Ship(3, 'cruiser');\n            this.shipMap.battleship = new Ship(4, 'battleship');\n            this.shipMap.carrier = new Ship(5, 'carrier');\n            return Object.keys(this.shipMap).length;\n        },\n\n        placeShip(ship, [x, y]) {\n            let size = ship.length;\n            ship.coordinates = [];\n            if (size + x > 11) return 'Invalid Location';\n            let mapCheck = (array) => {\n                for (let i = 0; i < size; i++) {\n                    let index = ((y * 10) + (x + i)) - 11;\n                    if (array[index].occupied !== undefined) {\n                        return true\n                    }\n                }\n            }\n            if (mapCheck(this.activeBoard) === true) {\n                return 'Invalid Location'\n            } else {\n                for (let i = 0; i < size; i++) {\n                    let index = ((y * 10) + (x + i)) - 11;\n                    ship.coordinates.push({x: x+i, y});\n                    let square = this.activeBoard[index];\n                    square.occupied = ship.name;\n                }\n                return ship.coordinates;\n            }\n        },\n\n        receiveAttack([x, y]) {\n            let squareIndex = ((y * 10) + x) - 11;\n            if (this.activeBoard[squareIndex].occupied !== undefined) {\n                this.activeBoard[squareIndex].status = 'hit';\n                let shipSelect = this.activeBoard[squareIndex].occupied;\n                let ship = this.shipMap[`${shipSelect}`];\n                ship.hits += 1;\n                ship.isSunk(ship.hits);\n                if (ship.sunk === true) {\n                    this.activeBoard[squareIndex].status = 'sunk'\n                } else if (ship.sunk === false) {\n                    this.activeBoard[squareIndex].status = 'hit';\n                }\n            } else {\n                this.activeBoard[squareIndex].status = 'miss'\n            }\n            return this.activeBoard[squareIndex];\n        }\n    }\n}\n\nfunction Player(name) {\n    return {\n        name,\n\n        untargetedSquares: [],\n\n        knownShip: false,\n\n        hitSquares: [],\n\n        launchAttack(opponent, [x, y]) {\n            if (opponent === player1) {\n                let attack = gameboard.receiveAttack([x, y]);\n                if (attack.status === 'hit') {\n                    this.hitSquares.push(attack);\n                    this.knownShip = true;\n                } else if (attack.status = 'sunk') {\n                    this.hitSquares.push(attack);\n                    this.knownShip = false;\n                } \n                else {\n                    this.knownShip = false;\n                }\n            } else if (opponent === player2) {\n                let attack = p2Gameboard.receiveAttack([x, y]);\n                if (attack.status === 'hit') {\n                    this.hitSquares.push(attack);\n                    this.knownShip = true;\n                } else if (attack.status = 'sunk') {\n                    this.hitSquares.push(attack);\n                    this.knownShip = false;\n                } \n                else {\n                    this.knownShip = false;\n                }\n            }\n        },\n\n        computerAttack() {\n            if (this.knownShip === true) {\n                return this.smartComputer();\n            } else if (this.knownShip === false) {\n                this.untargetedSquares = [];\n                for (let i = 0; i < this.activeBoard.length; i++) {\n                    if (this.activeBoard[i].status === 'untargeted') {\n                        this.untargetedSquares.push(this.activeBoard[i]);\n                    }\n                }\n                let randomChoice = Math.round(Math.random()*(this.untargetedSquares.length - 1));\n                let squareSelect = this.untargetedSquares[randomChoice].name.toString();\n                let yCoord; let xCoord;\n                if (parseInt(squareSelect) < 10) {\n                    yCoord = 1;\n                    xCoord = parseInt(squareSelect);\n                } else {\n                    yCoord = parseInt(squareSelect.slice(0, 1)) + 1;\n                    xCoord = parseInt(squareSelect.slice(1));\n                }\n                this.launchAttack(player1, [xCoord, yCoord]);\n            }\n        },\n\n        smartComputer() {\n            let squareAbove = {}; let squareBelow = {}; let squareLeft = {}; let squareRight = {};\n            let recentHit = this.hitSquares[this.hitSquares.length - 1].name.toString();\n            let yCoord;\n            let xCoord;\n            if (parseInt(recentHit) < 10) {\n                yCoord = 1;\n                xCoord = parseInt(recentHit);\n            } else {\n                yCoord = parseInt(recentHit.slice(0, 1)) + 1;\n                xCoord = parseInt(recentHit.slice(1)) - 1;\n            }\n            if(yCoord + 1 <= 10) {\n                squareAbove.x = xCoord;\n                squareAbove.y = yCoord + 1;\n                squareAbove.goodMove = true;\n            }\n            if (yCoord - 1 >= 1) {\n                squareBelow.x = xCoord;\n                squareBelow.y = yCoord - 1;\n                squareBelow.goodMove = true;\n            }\n            if (xCoord + 1 <= 10) {\n                squareRight.x = xCoord + 1;\n                squareRight.y = yCoord;\n                squareRight.goodMove = true;\n            }\n            if (xCoord - 1 >= 1) {\n                squareLeft.x = xCoord - 1;\n                squareLeft.y = yCoord;\n                squareLeft.goodMove = true;\n            }\n            \n            return [squareAbove, squareBelow, squareLeft, squareRight];\n        }\n    }\n}\n\nlet ship = new Ship();\nlet gameboard = new Gameboard();\nlet p2Gameboard = new Gameboard();\nlet p1 = new Player('Tyler');\nlet p2 = new Player('Computer');\n\nconst player1 = p1.name;\nconst player2 = p2.name;\n\n\n\n\n\n//# sourceURL=webpack://top-battleship/./src/index.js?");

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