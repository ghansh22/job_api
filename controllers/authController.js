const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { response_success, response_error } = require('../utils/response')
const ErrorHandler = require('../utils/errorHandler')
const { sendToken } = require('../utils/jwtTokens')
const sendEmail = require('../utils/sendEmail')

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
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler(`email and password is required`, 400))
    }

    // find the user in mongo
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // check the passoword
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // // create jsonwebtoken
    // const token = user.getJwtToken()

    // response_success(res, 200, 'login successfull', token)

    sendToken(user, 200, res)

})


exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    // check user exists
    if (!user) {
        return next(new ErrorHandler(`no user found with email ${req.email}`, 404))
    }

    // get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({
        validateBeforeSave: false
    })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `your password reset link is as follows: \n\n ${resetUrl} \n\n`

    try {
        await sendEmail({
            email: user.email,
            subject: 'job api password recovery',
            message
        })
    
        res.status(200).json({
            success: true,
            message: `email sent successfully to: ${user.email}`
        })    
    } catch (error) {
        user.resetPasswordToken =  undefined
        user.resetPasswordExpire =  undefined

        await user.save({
            validateBeforeSave: false
        })
        return next(new ErrorHandler('email is not sent'), 500)
    }

})