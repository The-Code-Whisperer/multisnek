const io = require("socket.io")();
const { createGameState, gameLoop, getUpdatedVelocity } = require('./game');
const { FRAME_RATE } = require('./constants');

io.on('connection', client => {
    const state = createGameState();

    client.on('keydown', handleKeydown);
    client.on('newGame', handleNewGame);

    function handleNewGame() {
        let roomName = makeid(5);
    }

    function handleKeydown(keyCode) {
        try {
            keyCode = parseInt(keyCode);
        } catch(e) {
            console.log(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);

        if (vel) {
            state.player.vel = vel;
        }

    }

    startGameInterval(client, state);
    //client.emit('init', { data: 'hello world' });
});
let num = 1
function startGameInterval(client, state) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);

        console.log(num);
        num++;
        if (!winner) {
            client.emit('gameState', JSON.stringify(state));
        } else {
            client.emit('gameOver');
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE)
}

io.listen(3000);