const Job = require('../models/job')
const geoCoder = require('../utils/geocoder')

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

// search job within provided radius
exports.jobsInRadius = async (req, res, next) => {
    const {zipcode, distance} = req.params
    
    // getting lat and long from geocoder using zipcode
    const loc = await geoCoder.geocode(zipcode)

    const lat = loc[0].latitude
    const long = loc[0].longitude

    const radius = distance / 3963


    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    });

    res.status(200).send({
        success: true,
        descn: 'jobs found',
        data: jobs
    })


}

// update a job by _id
exports.updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id)

    if(!job) {
        return res.status.send({
            success: false,
            message: 'job not found'
        })
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators : true,
        useFIndAndModify: false
    })

    res.status(200).send({
        success: true,
        message: 'job is updated',
        data: job
    })
}


exports.deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id)

    if(!job) {
        return res.status.send({
            success: false,
            message: 'job not found'
        })
    }

    job = await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true, 
        message: `job with id ${req.params.id} deleted successfully`
    })
}

exports.getJob = async (req,res,next) => {
    let job = await Job.findById(req.params.id)

    if(!job) {
        return res.status.send({
            success: false,
            message: 'job not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'job found',
        data: job
    })
}