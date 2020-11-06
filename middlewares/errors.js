const ErrorHandler = require("../utils/errorHandler")
module.exports = (err, req, res, next) => {
    err.status_code = err.status_code || 500
    err.message = err.message || 'internal server error'

    if (process.env.NODE_ENV === 'development') {

        res.status(err.status_code).json({
            success: false,
            message: `error: ${err}, msg: ${err.message}, ${err.stack}`
        })
    }

    if (process.env.NODE_ENV === 'production') {

        let error = { ...err }

        error.message = err.message


        // wrong mongoid error handling
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid ${err.path}`
            error = new ErrorHandler(message, 404)
        }

        // handling mongoose validation error
        if (err.name == 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400)
        }




        res.status(error.status_code).json({
            success: false,
            msg: error.message || 'internal server message'
        })
    }

}