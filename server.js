const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    routes = require('./routes/routes'),
    crypto = require('crypto'),
    static = require('node-static'),
    request = require('request'),
    path = require('path'),
    cron = require('node-cron'),
    file = new static.Server('./'),
    app = express();

const db = require('./connection');
let https = require('http').Server(app);
let io = require('socket.io')(https);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const server = http.createServer(app);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});


app.use('/automation', routes);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


var notes = []
var isInitNotes = false

io.sockets.on('connection', function (socket) {
    // Working Ni Sha gaw uncomment lang, naay problem lang kailagan eh update

    // socket.on('new appliances', function (data) {
    //     console.log("trial");
    //     notes.push(data)
    //     io.sockets.emit('new appliances', data)
    //     var sql_register_device = "INSERT INTO registered_devices (application, deviceLists, area, macAddress, state, accountID) VALUES ('" + data.appliances + "','" + data.deviceList + "','" + data.area + "','" + data.macAddress + "','" + 1 + "','" + data.accountID + "')";
    //     db.query(sql_register_device)
    // })


    // socket.on('accountID', function (data) {
    //     if (!isInitNotes) {
    //         console.log(data.accountID);
    //         var sql_view = "SELECT *,registered_devices._id as registered_devices_id from accounts,registered_devices " +
    //             "where accounts._id = registered_devices.accountID AND accounts._id = '" + data.accountID + "'";
    //         db.query(sql_view)
    //             .on('result', function (data) {
    //                 notes.push(data)
    //             })
    //             .on('end', function () {
    //                 socket.emit('initial notes', notes)
    //             })
    //         isInitNotes = true
    //     } else {
    //         socket.emit('initial notes', notes)
    //     }
    // });
    sendData(socket);
})

let number = 0;
function sendData(socket) {
    socket.emit('data1', {
        text: number,
        created: new Date()
    });
    console.log('tr');
    setTimeout(() => {
        sendData(socket);
        number++;
    }, 2000);
}


// io.on('connection', (socket) => {
//     sendData(socket);
// });






var port = process.env.PORT || 3000;

https.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});
console.log('SERVER');
