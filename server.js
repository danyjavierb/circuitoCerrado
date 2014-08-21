var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes');
var users = require('./routes/user');

var app = express();
var server = http.Server(app);
var io = require("socket.io").listen(server);

server.listen(8080);
var rooms=[
    {"room1":0},
    {"room2":0},
   { "room3":0},
   { "room4":0},
    {"room5":0}
];



app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');



app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var usuariosOnline = {};

io.sockets.on('connection', function(socket) 
{   

    socket.on("refreshChat", function(username)
    {       

        console.log("hola  "+username);

    });

    socket.on("loginUser", function(username)
    {       
        
         usuariosOnline[username] = socket;
        
        
        
        //socket.emit("refreshChat", "yo", "Bienvenido " + socket.username + ", te has conectado correctamente.");
      var counter =1;
      rooms.forEach(function(i){

        if(i["room"+counter] < 2 ){
            
            socket.join("room"+counter );
              socket.emit ("unido","true");
             rooms[counter-1]["room"+counter]++;
             console.log( rooms);
             return;
        }
        
        
        counter++;
      })  
        
    });

    socket.on('create', function(room) {
        rooms[room]+=1;
        socket.join(room);
    }); 
});




module.exports = app;
