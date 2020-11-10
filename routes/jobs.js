const express = require('express')
const router = express.Router()

const { 
    getJobs,
    getJob,
    newJob,
    jobsInRadius,
    updateJob,
    deleteJob
 } = require('../controllers/jobsController')

const { isAutheticatedUser } = require('../middlewares/auth')

router.route('/jobs').get(getJobs)
router.route('/jobs/:zipcode/:distance').get(jobsInRadius)
router.route('/job/new').post(isAutheticatedUser, newJob)
router.route('/job/:id')
    .put(isAutheticatedUser, updateJob)
    .delete(isAutheticatedUser, deleteJob)
    .get(getJob)

    
module.exports = router;