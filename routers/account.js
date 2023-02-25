const express = require('express')
var router = express.Router()
const AccountModel = require('../models/account')

//lay du lieu tu db
router.get('/', (req, res, next) => {
    AccountModel.find({}).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.status(500).json("Server Error")
    })
})

router.get('/:id', (req, res, next) => {
    var id = req.params.id
    AccountModel.findById(id, {

    }).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.status(500).json("Server Error")
    })
})

//them moi du lieu vao db
router.post('/', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AccountModel.create({
        username: username,
        password: password
    }).then((data) => {
        res.json("Added account successfully")
    }).catch((err) => {
        res.status(500).json("Server Error")
    })
})

//update du lieu trong db
router.put('/:id', (req, res, next) => {
    var id = req.params.id
    var newPassword = req.body.newPassword

    AccountModel.findByIdAndUpdate(id, {
        password: newPassword
    }).then((data) => {
        res.json("Updated account successfully")
    }).catch((err) => {
        res.status(500).json("Server Error")
    })
})

//xoa du lieu trong db
router.delete('/:id', (req, res, next) => {
    var id = req.params.id
    AccountModel.deleteOne({
        _id: id
    }).then((data) => {
        res.json("Deleted account successfully")
    }).catch((err) => {
        res.status(500).json("Server Error")
    })
})

module.exports = router


