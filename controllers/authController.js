const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { response_success, response_error } = require('../utils/response')
const ErrorHandler = require('../utils/errorHandler')


// register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body

    const user = await User.create({ name, email, password, role })

    const token = user.getJwtToken()

    res.status(200).json({
        success: true,
        msg: 'user registered',
        token
    })
})


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    // res.send('ok')
    const {email, password} = req.body

    if (!email || !password) {
        return next(new ErrorHandler(`email and password is required`, 400))
    }

    // find the user in mongo
    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // check the passoword
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // create jsonwebtoken
    const token = user.getJwtToken()

    response_success(res, 200, 'login successfull', token)

})