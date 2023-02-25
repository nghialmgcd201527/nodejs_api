const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const AccountModel = require('./models/account')
const port = 3000

var router = require('./apiRouter')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/register', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username
    }).then((data) => {
        if (data) {
            res.json("Username already exists")
        } else {
            return AccountModel.create({
                username: username,
                password: password
            })
        }
    }).then((data) => {
        res.json("Successfully")
    }).catch((err) => {
        res.status(500).json("Error")
    })
})

app.post('/login', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
        password: password
    }).then((data) => {
        if (data) {
            res.json("loged in Successfully")
        } else {
            res.status(400).json("Username or password is incorrect")
        }
    }).catch((err) => {
        res.status(300).json("Server Error")
    })
})

var accountRouter = require('./routers/account')

app.use('/api/account/', accountRouter)

app.get('/', (req, res, next) => {
    res.json('HOME')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})