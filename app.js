
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var api = require('./models/api');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//DB
mongoose.connect('mongodb://localhost/proj01');
var dbSchemas = api.loadModels(mongoose);
var UserSchema = dbSchemas.UserSchema;
var UserModel = mongoose.model('Users', UserSchema);



app.get('/', routes.index);
app.get('/users', user.list);

app.post('/users/new', function(req, res){
    Users.push({login: req.body.login, pass: req.body.pass});
    res.render('./users/new', {users: Users});
    console.log('%s:%s', req.body.login, req.body.pass);
//    UserModel.save({id: '', name: req.body.login, pass: req.body.pass});
});

app.post('/user/login', function(req, res){
    res.redirect('/user/' + req.body.login);
});

app.get('/user/:name', function(req, res){
    res.render('./user/index', {userlist: Users, login: req.params.name});
});

app.get('/data', function(req, res){

    UserModel.find({}, function(err, data){
        res.send(data);
    });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});