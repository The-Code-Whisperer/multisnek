const { GRID_SIZE } = require('./constants');

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
}

function createGameState() {
    return {
        player: {
            pos: { // the head
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,

            },
            snake: [
                { x: 1, y: 10 }, // last
                { x: 2, y: 10 }, // mid
                { x: 3, y: 10 }, // head
            ],
        },
        food: {
            x: 7,
            y: 7,
        },
        gridsize: GRID_SIZE,
    };
}

function gameLoop(state) {
    if (!state) {
        return;
    }

    const playerOne = state.player;
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        return 2;
    }

    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        playerOne.snake.push( { ...playerOne.pos }); // puts a new cell object with the same position as the head of the snake
        playerOne.pos.x += playerOne.vel.x; // move the rest of the snake along so the new cell doesn't overlap
        playerOne.pos.y += playerOne.vel.y;
        randomFood(state);
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) { // how come the first cell doesn't count as a collision?
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2;
            }
        }

        playerOne.snake.push({ ...playerOne.pos }); // puts a cell on the head, as the tail...?
        playerOne.snake.shift(); // takes off the first object from the array. Doesn't this just apply a cell on top of the head and then take it off?? Adrian says it pushes one on the front, then pops off the last item. So maybe the order of the cells of the snake are reversed.
    }

    return false;
}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }

    for (let cell of state.player.snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }
    
    state.food = food;
}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37: {
            return { x: -1, y: 0 };
        }
        case 38: {
            return { x: 0, y: -1 };
        }
        case 39: {
            return { x: 1, y: 0 };
        }
        case 40: {
            return { x: 0, y: 1 };
        }
    }
}
