module.exports = (err, req, res, next) => {
    err.status_code = err.status_code || 500
    err.message = err.message || 'internal server error'
    
    if (process.env.NODE_ENV === 'development') {
        
        res.status(err.status_code).json({
            success: false,
            message:  `error: ${err}, msg: ${err.message}, ${err.stack}`            
        })
    }
    
    if (process.env.NODE_ENV === 'production') {
        
        let error = {...err}
        
        error.message = err.message


        


        res.status(error.status_code).json({
            success: false,
            msg: error.message || 'internal server message'
        })
    }
    
}