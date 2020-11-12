const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { response_success, response_error } = require('../utils/response')
const ErrorHandler = require('../utils/errorHandler')
const { sendToken } = require('../utils/jwtTokens')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')  

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

// user login {{DOMAIN}}/api/v1/login
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

// forgot password /api/v1/password/reset
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

// Reset password  /api/v1/password/reset/:params
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    // hash url token 
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {'$gt': Date.now()}
    })

    if (!user) {
        return next(new ErrorHandler('password reset token in invalid', 400))
    }

    // reset the password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendToken(user, 200, res)
})


// logout user  =>      /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires : new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'logged out successfully'
    })
})