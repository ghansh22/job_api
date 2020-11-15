const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { sendToken } = require('../utils/jwtTokens')

// Get current user profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ "_id": req.user.id }, { "_id": 0 })

    res.status(200).json({
        success: true,
        data: user
    })
})

exports.updateCurrentUserPassword = catchAsyncErrors(async (req, res, next) => {
    // by default password is deselected by the user model, here we need it to compare the password
    const user = await User.findById(req.user.id).select('+password');

    // check users passwords
    const isMatched = await user.comparePassword(req.body.currentPassword)

    // is password mismatched
    if (!isMatched) {
        return next(new ErrorHandler('password is incorrect', 401))
    }

    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res)
})