const Job = require('../models/job')
const geoCoder = require('../utils/geocoder')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
let { response_error } = require('../utils/response')
const ErrorHandler = require('../utils/errorHandler')
const path = require('path')


exports.getJobs = catchAsyncErrors(async (req, res, next) => {
    const jobs = await Job.find({})

    res.status(200).send({
        success: true,
        msg: 'jobs found',
        data: jobs
    })
})

// create a new job => 
exports.newJob = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id
    const job = await Job.create(req.body)


    res.status(200).send({
        success: true,
        msg: 'job created',
    })
})

// search job within provided radius
exports.jobsInRadius = catchAsyncErrors(async (req, res, next) => {
    const { zipcode, distance } = req.params

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


})

// update a job by _id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id)

    if (!job) {
        return next(new ErrorHandler('Job not found', 404))
        // return response_error(res, 404, 'job not found')
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFIndAndModify: false
    })

    res.status(200).send({
        success: true,
        message: 'job is updated',
        data: job
    })
})


exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id)

    if (!job) {
        return response_error(res, 404, 'job not found')
    }

    job = await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: `job with id ${req.params.id} deleted successfully`
    })
})

exports.getJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id)

    if (!job) {
        return response_error(res, 404, 'job not found')
    }

    res.status(200).json({
        success: true,
        message: 'job found',
        data: job
    })
})

//  /api/v1/job/job_id/apply 
exports.applyJob = catchAsyncErrors(async (req, res, next) => {
    // res.send('ok')
    let job = await Job.findById(req.params.id)

    if (!job) {
        return next(new ErrorHandler('job not found', 404))
    }

    if (job.lastDate < new Date(Date.now())) {
        return next(new ErrorHandler('you have applied for en expired job', 400))
    }

    // check the files
    if (!req.files) {
        return next(new ErrorHandler('please upload resume file', 400))
    }

    const file = req.files.file

    // check file type
    const supportedFiles = /.docs|.pdf/
    if (!supportedFiles.test(path.extname(file.name))) {
        return next(new ErrorHandler('please upload document/pdf file'))
    }

    // check document size 
    if (file.size > process.env.MAX_RESUME_FILE_SIZE) {
        return next(new ErrorHandler(`please upload file less than ${process.env.MAX_RESUME_FILE_SIZE} mb`))
    }

    // rename resume
    file.name = `${req.user.name.replace(' ','_')}_${job._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async (error) => {
        if (error) {
            console.log(error)
            return next (new ErrorHandler(`resume upload failed: ${err}`, 500))
        }
        
        await Job.findByIdAndUpdate(req.params.id, {$addToSet: {applicantsApplied : {
            id: req.user.id,
            resume: file.name
        }}}, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            message: 'applied to the job successfully',
            data: file.name
        })
    })




})