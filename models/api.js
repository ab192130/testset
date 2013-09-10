
    //load DB Hashes
    exports.loadModels = function ()
    {

        var dbHashes = {
            UserHash: {
                name:{type: String},
                pass:{type: String},
                email:{type: String}
            },

            BlogHash: {
                title: {type: String},
                content: {type: String},
                author: {type: String}
            }
        };

        return dbHashes;
    };

    // Db-den useri adina gore tap
    exports.getUser = function (name, callback){
        var model = UserModel;
        model.findOne({name: name}, function(err, data){
            callback(err, data);
        });
    };

    // Db-den useri ID-sine gore tap
    exports.getUserById = function (id, callback){
        var model = UserModel;
        var user = model.findById(id, function(err,data){
            if (err) throw err;
            console.log(data);
            callback(err, data);
        });
    };

    // User qeydiyyatdan kecende
    exports.supUser = function(req, res, api, callback){
        var model = UserModel;
        var username = req.body.username;
        var password = req.body.pass;
        var email = req.body.email;

        // Eger xanalar bos deyilse
        if (username && password && email){
            // Find user
            api.getUser(username, function(err, data){
                if (err) {throw err;} else {
                    if(data){
                        res.send('User already exists');
                    } else {
                        var newUser = new model({name: username, pass: password, email: email});
                        newUser.save(function(err){
                            if(err) throw err;
                            callback(newUser._id);
                            res.redirect('/user/me');
                        });
                    }
                }
            });
        } else {
            res.send('All fields should be filled in!');
        }
    };

    // User sisteme daxil olanda
    exports.sinUser = function(req, res, api, callback){
        var username = req.body.username;
        var password = req.body.pass;
        if (username && password){
            api.getUser(username, function(err, data){
                if (err) {throw err;} else {
                    if (!data) {
                        // Eger bele user movcud deyilse
                        res.send('User not found!');
                    } else {
                        //Eger bele user movcuddursa shifreni yoxlayirig
                        if(password == data.pass) {
                            //Dogrudursa
                            callback(data._id);
                            res.redirect('/user/' + username);
                        } else {
                            //Yanlisdirsa
                            res.send('Invalid Password');
                        }
                    }
                }
            });
        } else {
            res.send('Do not leave empty field!');
        }
    };

    // Userin profiline daxil olanda
    exports.openUser = function(req, res){
        api.getUser(req.params.name, function(err, user){
            if (err) {throw err;} else {
                if(user){
                    var own = false;
                    if(user._id == req.cookies.uid)
                    {
//                        console.log('it is my profile');
                        own = true;
                    }
                    res.render('./user/index', {title: user.name + '\'s profile', user: user, own: own});
                    console.log('%s:%s - %s', user.name, user.pass, user._id);
                } else {
                    res.send('User Not Found!');
                }
            }
        });
    };

    // User sistemden cixir
    exports.soutUser = function(req, res){
        res.clearCookie('uid');
        res.redirect('/');
    };

    // Userin profiline redirekt
    exports.gotoUser = function(res, username){
        res.redirect('/user/' + username);
    };

    // Yoxla gor user sistemdedi ya yox
    exports.checkAuth = function(cookies){
        return cookies.uid;
    };

    exports.gotoHome = function(res){
        res.redirect('/');
    };

//    exports.getCurrentUser = function(req, res){
//
//    };

    /*
     * Blogs
     */

    exports.newBlog = function(req, res, callback){
        var model = BlogModel;
        var title = req.body.blog_title;
        var content = req.body.blog_content;
        var uid = req.cookies.uid;

        var newBlog = new model({title: title, content: content, author: uid});
        newBlog.save(function(err){
            if (err) throw err;
            callback(err, newBlog._id);
        });
    };

    exports.getBlogs = function(callback){
        var model = BlogModel;

        model.find({}, function(err, data){
            callback(err, data);
        });
    };

    exports.getBlog = function(id, callback){
        var model = BlogModel;

        model.findOne({_id: id}, function(err, data){
            console.log(data);
            callback(err, data);
        });
    };



