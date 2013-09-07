
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
var Schema = mongoose.Schema;

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

//Database
mongoose.connect('mongodb://localhost/proj01');

var dbHashes = api.loadModels(mongoose);
var UserSchema = new Schema(dbHashes.UserHash);
var UserModel = mongoose.model('Users', UserSchema);

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/user/new', function(req, res){
    UserModel.find({name: req.body.login}, function(err,data){
        if(data[0]){
            res.send('Sorry, username is busy');
//            console.log(data[0]);
        } else {
            var newUser = new UserModel({name: req.body.login, pass: req.body.pass});
            newUser.save(function(err){
                if(err) throw err;
//              res.render('./user/new', {login: req.body.login, pass: req.body.pass});
                res.redirect('/user/' + req.body.login);
                console.log('%s:%s', req.body.login, req.body.pass);
            });
        }
    });


});

app.post('/user/login', function(req, res){
    res.redirect('/user/' + req.body.login);
});

app.get('/user/:name', function(req, res){
    UserModel.find({name: req.params.name}, function(err,data){
        if (err) {throw err;} else {
            if(data[0]){
                res.render('./user/index', {login: data[0].name, pass: data[0].pass});
                console.log('%s:%s', data[0].name, data[0].pass);
      //        console.log('Requested User: ', data);
            } else {
                res.send('User Not Found!');
            }
        }

    });

});

app.get('/data', function(req, res){
        UserModel.find({}, function(err,data){
            res.json(data);
        });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});