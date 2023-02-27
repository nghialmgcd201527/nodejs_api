const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
const port = 3000

var router = require('./apiRouter')

app.use('/public', express.static(path.join(__dirname, '/public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

const AccountModel = require('./models/account')
const PAGE_SIZE = 2

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

var accountRouter = require('./routers/account')

app.use('/api/account/', accountRouter)

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

//Get Login
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})

//Post Login
app.post('/login', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
        password: password
    })
        .then((data) => {
            if (data) {
                var token = jwt.sign({ _id: data._id }, 'mk')
                return res.json({
                    message: 'thanh cong',
                    token: token
                })
            } else {
                return res.status(500).json("Error")
            }
        })
        .catch((err) => {
            res.status(500).json("Error")
        })
})

app.get('/private', (req, res, next) => {
    try {
        var token = req.cookies.token
        var ketqua = jwt.verify(token, 'mk')
        if (ketqua) {
            next()
        }
    } catch (error) {
        return res.redirect('/login')
    }
}, (req, res, next) => {
    res.json('welcome')
})

var checkStudent = (req, res, next) => {
    var role = req.data.role
    if (role === 'student' || role === 'teacher' || role === 'manager') {
        next()
    } else {
        res.json('ban khong co quyen')
    }
}

var checkTeacher = (req, res, next) => {
    var role = req.data.role
    if (role === 'teacher' || role === 'manager') {
        next()
    } else {
        res.json('ban khong co quyen')
    }
}

var checkManager = (req, res, next) => {
    var role = req.data.role
    if (role === 'manager') {
        next()
    } else {
        res.json('ban khong co quyen')
    }
}

var checkLogin = (req, res, next) => {
    //check login
    try {
        var token = req.cookies.token
        var idUser = jwt.verify(token, 'mk')
        AccountModel.findOne({
            _id: idUser
        })
            .then((data) => {
                if (data) {
                    req.data = data
                    next()
                } else {
                    res.json('ban khong co quyen')
                }
            })
            .catch((err) => {
                res.status(500).json("Error")
            })
    } catch (err) {
        res.status(500).json("token ko hop le")
    }
}

app.get('/task', checkLogin, checkStudent, (req, res, next) => {
    console.log(req.data)
    res.json('all task')
})

app.get('/student', checkLogin, checkTeacher, (req, res, next) => {
    //check login
    next()
}, (req, res, next) => {
    res.json('student')
})

app.get('/teacher', checkLogin, checkManager, (req, res, next) => {
    //check login
    next()
}, (req, res, next) => {
    res.json('teacher')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})