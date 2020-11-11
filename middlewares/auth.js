const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const isAutheticatedUser = catchAsyncErrors( async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorHandler('please login to access this resourse', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // storing the user in request for future use
    req.user = await User.findById(decoded.id)

    next()
})

// handling users roles
const authorizedRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`role ${req.user.role} is not allowed access this resourse`, 403))
        }
        next()
    }
}

module.exports = { isAutheticatedUser, authorizedRoles }