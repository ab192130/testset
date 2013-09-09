
/*
 * GET users listing.
 */

exports.new = function(req, res){
    api.supUser(req, res, api, function(uid){
        res.cookie('uid', uid); //kukiye yazag
    });
};

exports.login_post = function(req, res){
    api.sinUser(req, res, api, function(uid){
        res.cookie('uid', uid); //kukiye yazag
    });
};

exports.login_get = function(req, res){
    res.redirect('/');
};

exports.profile = function(req, res){
    api.openUser(req, res);
};

exports.me = function(req, res){
    var uid = req.cookies.uid;
    if (!uid){
        api.gotoHome(res);
    } else {
        api.getUserById(uid, function(err, user){
            var username = user.name;
            api.gotoUser(res, username);
        });
    }
};

exports.edit_get = function(req, res){
    var UserId = req.cookies.uid;
    var NameParam = req.params.name;
//    var User = api.getUserById(UserId);
    api.getUserById(UserId, function(err, user){
        var Username =  user.name;
        if(NameParam == Username){
//          res.send('Editing profile of ' + Username);
            res.render('./user/edit', {user: user});
        } else {
            res.send('You haven\'t access to edit this user');
        }
    });
};

exports.edit_post = function(req, res){
    var formData = req.body;
    var Params = req.params;
    api.getUser(Params.name, function(err, user){
        if (err) throw err;
        var newUsername = formData.username;
        user.name = newUsername;
        user.save(function(err){
            if (err) throw err;
//                res.send('saved!');
            api.gotoUser(res, newUsername);
        });
    });
};

exports.changepassword_get = function(req, res){
    res.render('./user/password');
};

exports.changepassword_post = function(req, res){
    var uid = req.cookies.uid;
    var formData = req.body;
    var CurrentPass = formData.currentpass;
    var NewPass = formData.newpass;
    var ConfirmPass = formData.confirmpass;
    api.getUserById(req.cookies.uid, function(err, user){
        if (err) throw err;
        var password = user.pass;
        if (CurrentPass == password){
            if(NewPass == ConfirmPass){
                user.pass = NewPass;
                user.save(function(err){
                    if (err) throw err;
                    api.gotoUser(res, user.name);
                });
            } else {
                res.send('passwords don\'t match!');
            }
        } else {
            res.send('invalid password');
        }

    })
};

exports.signout = function(req, res){
    api.soutUser(req, res);
};