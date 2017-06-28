var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

//tiles mobile
app.get('/', function (req, res) {
    res.sendfile('index.html')
});

//LISTEN
var port = process.env.PORT || '3001';


app.listen(port);
console.log('Listening on port 3001');