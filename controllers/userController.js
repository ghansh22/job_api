const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { sendToken } = require('../utils/jwtTokens')

// Get current user profile: route[GET] {{DOMAIN}}/api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ "_id": req.user.id }, { "_id": 0 })

    res.status(200).json({
        success: true,
        data: user
    })
})

// update password route[PUT] : {{DOMAIN}}/api/v1/password/update
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

// update user route[PUT]: {{DOMAIN}}/api/v1/me/update
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        runValidators: true,
        new: true,
        select: "-_id -__v"
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

// Delete user route [DELETE]: {{DOMAIN}}/api/v1/me/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user.id)

    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'user deleted successfully'
    })
})