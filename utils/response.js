exports.response_error = (res, status_code, msg) => {
    response_data = {
        success: false,
        msg
    }
    res.status(status_code).json(response_data)
}


exports.response_success = (res, status_code, msg, data) => {
    response_data = {
        success: true,
        msg,
        data
    }
    res.status(status_code).json(response_data)
}