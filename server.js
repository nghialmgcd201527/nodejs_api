const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
const port = 3000

var router = require('./apiRouter')

app.use('/public', express.static(path.join(__dirname, '/public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const AccountModel = require('./models/account')
const PAGE_SIZE = 2

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

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

app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

var accountRouter = require('./routers/account')

app.use('/api/account/', accountRouter)

app.get('/', (req, res) => {
    var duongDan = path.join(__dirname, 'home.html')
    res.sendFile(duongDan)
})

app.get('/user', (req, res, next) => {
    var page = req.query.page
    if (page) {
        page = parseInt(page)
        if (page < 1) page = 1
        var skip = (page - 1) * PAGE_SIZE
        AccountModel.find({})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then((data) => {
                AccountModel.countDocuments({}).then((count) => {
                    var totalPage = Math.ceil(count / PAGE_SIZE)
                    res.json({
                        total: count,
                        totalPage: totalPage,
                        data: data
                    })
                })
            })
            .catch((err) => {
                res.status(500).json("Error")
            })
    } else {
        AccountModel.find({}).then((data) => {
            res.json(data)
        }).catch((err) => {
            res.status(500).json("Error")
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})