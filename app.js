
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

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

//Database
mongoose.connect('mongodb://localhost/proj01');
var dbHashes = api.loadModels(mongoose);
var UserSchema = new Schema(dbHashes.UserHash);
var UserModel = mongoose.model('Users', UserSchema);


app.get('/', routes.index);
//app.get('/users', user.list);

app.post('/user/new', function(req, res){

    // Eger xanalar bos deyilse
    if (req.body.login && req.body.pass){
        // Find user
        api.getUser(UserModel, req.body.login, function(err, data){
            if (err) {throw err;} else {
                if(data[0]){
                    res.send('User already exists');
//          console.log(data[0]);
                } else {
                    var newUser = new UserModel({name: req.body.login, pass: req.body.pass});
                    newUser.save(function(err){
                        if(err) throw err;
//              res.render('./user/new', {login: req.body.login, pass: req.body.pass});
                        res.redirect('/user/' + req.body.login);
                        console.log('%s:%s', req.body.login, req.body.pass);
                    });
                }
            }
        });
    } else {
        res.send('Login or password is empty');
    }
});

app.post('/user/login', function(req, res){

    if (req.body.login && req.body.pass){
        api.getUser(UserModel, req.body.login, function(err, data){
            if (err) {throw err;} else {
                if (!data[0]) {
                    // Eger bele user movcud deyilse
                    res.send('User not found!');
                } else {
                    //Eger bele user movcuddursa shifreni yoxlayirig
                    if(req.body.pass == data[0].pass) {
                        //Dogrudursa
                        res.redirect('/user/' + req.body.login);
                    } else {
                        //Yanlisdirsa
                        res.send('Invalid Password');
                    }
                }
            }
        });
    } else {
        res.send('Login or password is empty');
    }

    //@TODO: login ve sifre yoxlanir ve sonra yonlenir userin profiline
    //res.redirect('/user/' + req.body.login);
});

app.get('/user/:name', function(req, res){

    // Find User
    api.getUser(UserModel, req.params.name, function(err, data){
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