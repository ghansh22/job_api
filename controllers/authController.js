const User = require("../models/user")
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')



// register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    // res.send('ok')
    const { name, email, password, role } = req.body

    const user = await User.create({ name, email, password, role })

    const token = user.getJwtToken()

    res.status(200).json({
        success: true,
        message: 'user registered',
        token
    })
})