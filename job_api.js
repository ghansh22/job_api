const express = require('express')
const job_api = express()
const dotenv = require('dotenv')
const errorMiddleware = require('./middlewares/errors')

// setting up api config 
dotenv.config({ path: './configs/api_configs.env' })

// catching uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log(`error: ${error.message}`)
    console.log('shutting down the server due to uncaught exception')
    process.exit(1)
})


// gettin api config vars
const PORT = process.env.PORT
const LISTENING_IP = process.env.LISTENING_IP

job_api.use(express.json())





// importing routes
const jobs = require('./routes/jobs')
job_api.use('/api/v1', jobs)

// connecting db one
const { conn_one } = require('./configs/database')
conn_one()




// welcome route
jobs.get('/', (req, res, next) => {
    res.status(200).send({
        success: true,
        message: 'welcome to job api'
    })
    next()
})

// handling non indetified routes
jobs.get('*', (req, res, next) => {
    res.status(404).send({
        success: false,
        message: `could not find ${req.url}`
    })
    next()
})

// always have it at the end of all routes 
job_api.use(errorMiddleware)

// listen on the api
const server = job_api.listen(PORT, LISTENING_IP, (error) => {
    if (error) return console.log(`failed to start the jon api ${error}`)
    console.log(`job api is listening on ${LISTENING_IP}:${PORT}`)
})

// handling unhanbdledpromise rejections
// something very critical is happening, needs to close server
process.on('unhandledRejection', (error) => {
    console.log(`error: ${error.message}`)
    console.log('shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})


console.log(test_var)