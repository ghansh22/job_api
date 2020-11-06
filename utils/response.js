exports.response_error = (res, status_code, msg) => {
    response_data = {
        success: false,
        msg
    }
    res.status(status_code).send(response_data)
}

