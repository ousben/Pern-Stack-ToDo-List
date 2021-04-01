const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const port = 8080
const pool = require("./database");

app.use(express.static('public'));

app.get('/list', async function (req, res) {
    try {
        const allPosts = await pool.query("SELECT * FROM todos");
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/list/add', jsonParser, async function (req, res) {
    try {
        await pool.query(
            "INSERT INTO todos (text) VALUES($1)",
            [req.body.text]
        );
        res.send('added to the list')
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/list/edit', jsonParser, async function (req, res) {
    try {
        await pool.query(
            "UPDATE todos SET text = $1 WHERE position = $2",
            [req.body.text, req.body.position]
        );
        res.send('edited')
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/list/delete', jsonParser, async function (req, res) {
    try {
        await pool.query(
            "DELETE FROM todos WHERE position= $1",
            [req.body.position]
        );
        res.send('deleted from the list')
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, function() {
    console.log('server is running on port 8080')
})
