var express		= require('express');
var fs			= require('fs');
var crypto		= require('crypto');

var app			= express();
var http = require('http');
var server= http.createServer(app);

var staticDir	= express.static;
var io = require('socket.io').listen(server);

var opts = {
	port: 1947,
	baseDir : __dirname + '/../../'
};

app.set('views', __dirname + '/../../views');
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/../../public', {maxAge:0}));

io.set('log level', 1); // reduce logging
io.sockets.on('connection', function(socket) {

	console.log("connection ");

	socket.on('slidechanged', function(slideData) {
		
		if (typeof slideData.secret == 'undefined' || slideData.secret == null || slideData.secret === '') return;

		if (createHash(slideData.secret) === slideData.socketId) {
			console.log("secret "+slideData.secret);
			console.log("socketId:"+slideData.socketId +" :: "+ socket.id);

			slideData.secret = null;
			socket.broadcast.emit(slideData.socketId, slideData);
		};
	});
});

app.configure(function() {
	['css', 'js', 'plugin', 'lib' ,'clock', 'res'].forEach(function(dir) {
		app.use('/' + dir, staticDir(opts.baseDir + dir));
	});
});

app.get("/master", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(opts.baseDir + '/master.html').pipe(res);
});

app.get("/masterview", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(opts.baseDir + '/master-view.html').pipe(res);
});

app.get("/client", function(req, res) {
	if(typeof(req.query.num) != undefined){
		console.log(">>>>>>>>>>> page number:"+req.query.num);
	} else {
		console.log("client didn't sent anything");
	}
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(opts.baseDir + '/client.html').pipe(res);
});

app.get('/controller', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(opts.baseDir + '/controller.html').pipe(res);
});
/*
app.get('/', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(opts.baseDir + '/public/index.html').pipe(res);
});
*/
app.get("/token", function(req,res) {
	var ts = new Date().getTime();
	var rand = Math.floor(Math.random()*9999999);
	var secret = ts.toString() + rand.toString();

	console.log("get Token %s %s %s", ts, rand, secret);
	console.log(">>>>>>:%s", JSON.stringify({secret: secret, socketId: createHash(secret)}));
	res.send({secret: secret, socketId: createHash(secret)});
});

var createHash = function(secret) {
	var cipher = crypto.createCipher('blowfish', secret);
	return(cipher.final('hex'));
};

// Actually listen
server.listen(opts.port || null);

var brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

console.log( brown + "reveal.js:" + reset + " Multiplex running on port " + green + opts.port + reset );
