const events = require("events")

// create event emitter
const eventEmitter = new events.EventEmitter()

// create listerner
eventEmitter.on("sampleEvent", (error) => {
    if (error) return console.log(`error ${error}`)
    console.log(`sampleEvent is called`)
})

eventEmitter.emit('sampleEvent')