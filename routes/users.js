const express = require('express')
const router = express.Router()


const { getUserProfile,
    updateCurrentUserPassword } = require('../controllers/userController')
const { isAutheticatedUser } = require('../middlewares/auth')


router.route('/me').get(isAutheticatedUser, getUserProfile)
router.route('/password/update').put(isAutheticatedUser, updateCurrentUserPassword)


module.exports = router