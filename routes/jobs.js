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

router.route('/jobs').get(getJobs)
router.route('/jobs/:zipcode/:distance').get(jobsInRadius)
router.route('/job/new').post(newJob)
router.route('/job/:id')
    .put(updateJob)
    .delete(deleteJob)
    .get(getJob)

    
module.exports = router;