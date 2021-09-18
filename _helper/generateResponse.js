const successResponse = (data, msg) => {
    let response = {
        sucess: true,
        msg: msg,
        data: data
    }
    if (data === true) {
        delete response.data
    }
    return response
}
const failureResponse = (req, res, error) => {
    console.log(error.status)
    let response = {
        sucess: false,
        msg: error.message,
        error: error.name
    }
    res.status(error.statusCode).send(response)
}

module.exports = { successResponse, failureResponse }