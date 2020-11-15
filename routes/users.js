const express = require('express')
const router = express.Router()


const { getUserProfile,
    updateCurrentUserPassword,
    updateUser,
    deleteUser } = require('../controllers/userController')
const { isAutheticatedUser } = require('../middlewares/auth')


router.route('/me').get(isAutheticatedUser, getUserProfile)
router.route('/password/update').put(isAutheticatedUser, updateCurrentUserPassword)
router.route('/me/update').put(isAutheticatedUser, updateUser)
router.route('/me/delete').delete(isAutheticatedUser, deleteUser)

module.exports = router