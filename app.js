
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
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

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



//    app.use(app.router);
    app.get('/', routes.index);
    //app.get('/users', user.list);

    // User qeydiyyatdan kecir
    app.post('/user/new', function(req, res){
        api.supUser(req, res, api, UserModel);
    });

    // User sisteme daxil olur
    app.post('/user/login', function(req, res){
        api.sinUser(req, res, api, UserModel, function(uid){
            res.cookie('uid', uid); //kukiye yazag
        });

    });

    // Userin sehifesi goruntulenir
    app.get('/user/:name', function(req, res){
        api.openUser(req, res, api, UserModel)
    });

    app.get('/data', function(req, res){
        UserModel.find({}, function(err,data){
            res.json(data);
        });
    });

    app.get('/signout', function(req, res){
        api.soutUser(req, res);
    });
