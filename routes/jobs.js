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

const { isAutheticatedUser, authorizedRoles } = require('../middlewares/auth')

router.route('/jobs').get(getJobs)
router.route('/jobs/:zipcode/:distance').get(jobsInRadius)
router.route('/job/new').post(isAutheticatedUser, authorizedRoles(['employer', 'admin']), newJob)
router.route('/job/:id')
    .put(isAutheticatedUser, authorizedRoles(['employer', 'admin']), updateJob)
    .delete(isAutheticatedUser, authorizedRoles(['employer', 'admin']), deleteJob)
    .get(getJob)

    
module.exports = router;