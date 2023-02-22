function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 15,
            height: 15, 
        }
    }

    const observers = []

    function start() {
        const frequency = 10000

        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function unsubscribe(observerFunction) {
        const index = observers.lastIndexOf(observerFunction)
        if (index > 1) {
            observers.splice(index, 1);
        } 
    }

    function notifyAll(command) {

        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }


    function movePlayer(command) {   
        notifyAll(command) 
         
        const acceptedMoves = {
            ArrowUp(player) {
                if ( player.y - 1 >= 0 ) { return player.y-- }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {return player.y++ }
            },        
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {  return player.x-- }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) { return player.x++ }
            },
        }

        const keyPressed = command.keyPressed;
        const playerId = command.playerId
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];
        if (player && moveFunction) {
            moveFunction(player)
            checkFruitCollision(playerId)
        }
    }

    function checkFruitCollision(playerId) {
        const player = state.players[playerId]
        
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Checking ${playerId} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`COLLISION between ${playerId} and ${fruitId}`)
                removeFruit({fruitId: fruitId})
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subscribe,
        unsubscribe,
        start
    }
}

export default createGame