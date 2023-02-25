const express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    res.json('Nghia dang o router 1')
})

router.get('/:id', (req, res) => {
    res.json('toi da lay ra id: ' + req.params.id)
})

router.get('/product/', (req, res) => {
    res.json('Nghia dang lay san pham')
})

router.get('/cart/', (req, res) => {
    res.json('Nghia dang gom gio hang')
})

module.exports = router