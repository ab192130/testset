    /**
     * Module dependencies.
     */

    var express = require('express');
    var http = require('http');
    var path = require('path');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    api = module.exports.api = require('./lib/api');
    app = module.exports.app = express();

    var routes = require('./routes');
    var user = require('./routes/user');
    var blog = require('./routes/blog');

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(function(req, res, next) {
        var uid = req.cookies.uid;
        if (uid){
            api.getUserById(uid, function(err, user){
                res.locals.userauth = user;
            });
        }
        next();
    });

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
    var BlogSchema = new Schema(dbHashes.BlogHash);
    UserModel = module.exports = mongoose.model('Users', UserSchema);
    BlogModel = module.exports = mongoose.model('Blogs', BlogSchema);


    app.get('/', routes.index);

    // User qeydiyyatdan kecir
    app.post('/user/new', user.new);

    // Yeni blog gondermek
    app.post('/blog/new', blog.new_post);

    // Yeni blog yazmaq
    app.get('/blog/new', blog.new_get);

    // Bloqlarin siyahisi (ana sehifesi)
    app.get('/blog', blog.index);

    // Bloq melumat bazasi (json)
    app.get('/blog/data', blog.data);

    // Bloqu oxumaq
    app.get('/blog/:id', blog.view);

    // Bloqu redakte etmek
    app.get('/blog/:id/edit', blog.edit_get);

    // Bloqu redakte etmek
    app.post('/blog/:id/edit', blog.edit_post);

    // User sisteme daxil olur
    app.post('/user/login', user.login_post);

    // /user/login ucun postsuz giris baglansin
    app.get('/user/login', user.login_get);

    app.get('/user/me', user.me);

    // Userin sehifesi goruntulenir
    app.get('/user/:name', user.profile);

    // Userlerin melumat bazasina baxis
    app.get('/data', routes.data);

    // User sistemden cixir
    app.get('/signout', user.signout);

    // User melumetlarini deyismek isteyir
    app.get('/user/:name/edit', user.edit_get);

    // User profilinde deyisikliyi tesdiqledi
    app.post('/user/:name/edit', user.edit_post);

    // User sifresini deyismek isteyir
    app.get('/user/:name/edit/password', user.changepassword_get);

    app.post('/user/:name/edit/password', user.changepassword_post);






