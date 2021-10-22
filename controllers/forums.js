const { request, response } = require('express')


const createForum = (req = request, res = response) => {
    // try {
    return res.status(200).json({
        ok: true,
        msg: req.body
    })
    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).json({
    //         ok: false,
    //         msg: "Error",
    //         error
    //     })
    // }
}



module.exports = {
    createForum
}
