var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

//tiles mobile
app.get('/', function (req, res) {
    res.sendfile('index.html')
});

//LISTEN

app.listen(3001);
console.log('Listening on port 3001');