
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
    api.getUserById(req.cookies.uid, function(err, user){
        var username = user.name;
        api.gotoUser(res, username);
    });
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
    api.getUser(req.params.name, function(err, user){
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