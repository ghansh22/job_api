const express = require('express')
const job_api = express()
const dotenv = require('dotenv')
const errorMiddleware = require('./middlewares/errors')
const Errorhandler = require('./utils/errorHandler')

// setting up api config 
dotenv.config({ path: './configs/api_configs.env' })

// file upload 
const fileUpload = require('express-fileupload')

// catching uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log(`error: ${error.message}`)
    console.log('shutting down the server due to uncaught exception')
    process.exit(1)
})


// gettin api config vars
const PORT = process.env.PORT
const LISTENING_IP = process.env.LISTENING_IP

// connecting db one
const { conn_one } = require('./configs/database')
conn_one()

job_api.use(express.json())

// handle file upload
job_api.use(fileUpload())

// importing routes
const jobs = require('./routes/jobs')
const auth = require('./routes/auth')
const user = require('./routes/users')
job_api.use('/api/v1', jobs)
job_api.use('/api/v1',auth)
job_api.use('/api/v1',user)


// welcome route
job_api.get('/', (req, res, next) => {
    res.status(200).send({
        success: true,
        message: 'welcome to job api'
    })
    next()
})

// handling non indetified routes
job_api.all('*', (req, res, next) => {
    next(new Errorhandler(`${req.url} route not found`))
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

// creating uncaught exception
// console.log(test_var)