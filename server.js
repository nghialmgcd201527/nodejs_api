const express = require('express')
const app = express()
const port = 3000
var router = require('./apiRouter')

app.use('/admin/api1/', router)
app.use('/api1/', router)

app.get('/', (req, res) => {
    res.send('Say something')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})