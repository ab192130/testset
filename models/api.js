
    //load DB Hashes
    exports.loadModels = function ()
    {

        var dbHashes = {
            UserHash: {
                name:{type: String},
                pass:{type: String}
            }
        };

        return dbHashes;
    };

    // Db-den useri adina gore tap
    exports.getUser = function getUser(model, name, callback){
        model.find({name: name}, function(err, data){
            callback(err, data);
        });
    };

    // Db-den useri ID-sine gore tap
    exports.getUserById = function getUser(model, id, callback){
        model.find({_id: id}, function(err, data){
            callback(err, data);
        });
    };

    // User qeydiyyatdan kecende
    exports.supUser = function(req, res, api, model, callback){
        // Eger xanalar bos deyilse
        if (req.body.login && req.body.pass){
            // Find user
            api.getUser(model, req.body.login, function(err, data){
                if (err) {throw err;} else {
                    if(data[0]){
                        res.send('User already exists');
    //          console.log(data[0]);
                    } else {
                        var newUser = new model({name: req.body.login, pass: req.body.pass});
                        newUser.save(function(err){
                            if(err) throw err;
                            callback(newUser._id);
                            res.redirect('/user/' + req.body.login);
                            console.log('New user signed up %s:%s', req.body.login, req.body.pass);
                        });
                    }
                }
            });
        } else {
            res.send('Login or password is empty');
        }
    };

    // User sisteme daxil olanda
    exports.sinUser = function(req, res, api, model, callback){
        if (req.body.login && req.body.pass){
            api.getUser(model, req.body.login, function(err, data){
                if (err) {throw err;} else {
                    if (!data[0]) {
                        // Eger bele user movcud deyilse
                        res.send('User not found!');
                    } else {
                        //Eger bele user movcuddursa shifreni yoxlayirig
                        if(req.body.pass == data[0].pass) {
                            //Dogrudursa
                            callback(data[0]._id);
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
    };

    // Userin profiline daxil olanda
    exports.openUser = function(req, res, api, model){
        api.getUser(model, req.params.name, function(err, data){
            if (err) {throw err;} else {
                if(data[0]){
                    var own = false;
                    if(data[0]._id == req.cookies.uid)
                    {
                        console.log('it is my profile');
                        own = true;
                    }
                    res.render('./user/index', {login: data[0].name, pass: data[0].pass, own: own});
                    console.log('%s:%s - %s', data[0].name, data[0].pass, data[0]._id);
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



