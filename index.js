//requiring the dependencies
var bodyParser = require("body-parser"),
express 	   = require("express"),
session 	   = require("express-session"),
mongoose 	   = require("mongoose"),
morgan 		   = require("morgan"),
underscore 	   = require("underscore"),
app            = express(),
port		   = 3000,
server     	   = require('http').createServer(app),
fs         	   = require('fs');

//server to listen on 3000
server.listen(port, ()=> console.log("the server is on 3000"));

// server public files with express
app.use(express.static(__dirname + '/public'));

// morgan on dev
app.use(morgan('dev'));

// sessions
app.use(session({
  	secret: 'bright noah slaps all secrets away',
  	saveUninitialized: false,
  	resave: false,
}));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// connecting database
mongoose.connect('mongodb://localhost/blogMean',(err) => err ? console.log(err) : console.log("connected to blogMean database"));

// Going to use FS to connect all of our controllers vs express.router
fs.readdirSync('./controllers').forEach(function (file){
  	if(file.substr(-3) == '.js') {
      	route = require('./controllers/' + file);
      	route.controller(app);
  	}
});