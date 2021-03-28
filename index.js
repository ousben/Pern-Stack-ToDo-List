const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const port = 8080
const list = [2452,2222,2222,2863,2,87,"zebi"]

app.use(express.static('public'));

app.get('/list', function (req, res) {
    res.send(JSON.stringify(list))
})

app.put('/list/add', jsonParser, function (req, res) {
    list.push(req.body.text)
    res.send('added to the list')
    console.log(req.body)
})

app.post('/list/edit', jsonParser, function (req, res) {
    list[req.body.position] = req.body.text
    res.send('edited')
    console.log('You edited your post')
})

app.delete('/list/delete', jsonParser, function (req, res) {
    list.splice(req.body.position, 1)
    res.send('deleted')
    console.log('You deleted your post')
})

app.listen(port, function() {
    console.log('server is running on port 8080')
})
