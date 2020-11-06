const Job = require('../models/job')

exports.getJobs = async (req, res, next) => {
    const jobs = await Job.find({})

    res.status(200).send({
        success: true,
        msg: 'jobs found',
        data: jobs
    })
}

// create a new job => 
exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body)

    res.status(200).send({
        success: true,
        msg: 'job created',
    })
}