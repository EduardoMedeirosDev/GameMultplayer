function createKeyboardListener(document) {
    const state = {
        observers: [],
        playerId: null
    }
    function registerPlayerId(playerId){
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unsubscribeAll(observerFunction) {
        const index = state.observers.indexOf(observerFunction)
        if (index > -1) {
            state.observers.splice(index, 100);
        } 
    }
   
    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    } 

    document.addEventListener('keydown', handleKeydown) 

    function handleKeydown(event) {
        const keyPressed = event.key
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)  
    }      

    return {
        subscribe,
        unsubscribeAll,
        registerPlayerId
    }
}

export default createKeyboardListener