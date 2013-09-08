
/*
 * GET users listing.
 */

exports.new = function(req, res){
    api.supUser(req, res, api, UserModel, function(uid){
        res.cookie('uid', uid); //kukiye yazag
    });
};

exports.login_post = function(req, res){
    api.sinUser(req, res, api, UserModel, function(uid){
        res.cookie('uid', uid); //kukiye yazag
    });
};

exports.login_get = function(req, res){
    res.redirect('/');
};

exports.profile = function(req, res){
    api.openUser(req, res, api, UserModel);
};

exports.me = function(req, res){
    api.getUserById(UserModel, req.cookies.uid, function(err, data){
        var username = data.name;
        api.gotoUser(res, username);
    });
};

exports.edit_get = function(req, res){
    var UserId = req.cookies.uid;
    var NameParam = req.params.name;
    api.getUserById(UserModel, UserId, function(err, user){
        var User = user;
        var Username =  User.name;
        if(NameParam == Username){
//              res.send('Editing profile of ' + Username);
            res.render('./user/edit', {user: User});
        } else {
            res.send('You haven\'t access to edit this user');
        }
    });
};

exports.edit_post = function(req, res){
    var formData = req.body;
    api.getUser(UserModel, req.params.name, function(err, user){
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

exports.signout = function(req, res){
    api.soutUser(req, res);
};