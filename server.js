const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 3000

var router = require('./apiRouter')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/admin/api1/', router)
app.use('/api1/', router)

app.get('/', (req, res) => {
    res.send('Say something')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})