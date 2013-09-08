
    /**
     * Module dependencies.
     */

    var express = require('express');
    var http = require('http');
    var path = require('path');
//    var models = require('./models/');
    api = module.exports = require('./models/api');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    app = module.exports = express();

    var routes = require('./routes');
    var user = require('./routes/user');


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
    UserModel = module.exports = mongoose.model('Users', UserSchema);



//    app.use(app.router);
    app.get('/', routes.index);

    // User qeydiyyatdan kecir
    app.post('/user/new', user.new);

    // User sisteme daxil olur
    app.post('/user/login', user.login_post);

    // /user/login ucun postsuz giris baglansin
    app.get('/user/login', user.login_get);

    // Userin sehifesi goruntulenir
    app.get('/user/:name', user.profile);

    // Userlerin melumat bazasina baxis
    app.get('/data', routes.data);

    // User sistemden cixir
    app.get('/signout', user.signout);

    // User melumetlarini deyismek isteyir
    app.get('/user/:name/edit', user.get_edit);

    // User profilinde deyisikliyi tesdiqledi
    app.post('/user/:name/edit', user.post_edit);
