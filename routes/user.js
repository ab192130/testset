
/*
 * Users
 */

exports.new = function(req, res){
    var username = req.body.username;
    var password = req.body.pass;
    var email = req.body.email;

    api.supUser({name: username, pass: password, email: email}, function(data){
        if(data.error){
            res.send(data.error);
        } else {
            if(data.uid){
                res.cookie('uid', data.uid); //kukiye yazag
                res.redirect('/user/me');
            } else {
                res.send('Username is busy');
            }
        }
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

    api.getUserById(UserId, function(err, user){
        var Username =  user.name;
        if(NameParam == Username){
//          res.send('Editing profile of ' + Username);
            res.render('./user/edit', {title:'Edit Profile', user: user});
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
        var formUsername = formData.username;
        var formEmail = formData.email;
        var oldUsername = user.name;
        var oldEmail = user.email;

        if (formUsername !== oldUsername){
            user.name = formUsername;
            var changed = true;
        }

        if (formEmail !== oldEmail){
            user.email = formEmail;
        }

        user.save(function(err){
            if (err) throw err;
//          res.send('saved!');
            api.gotoUser(res, changed ? formUsername : oldUsername);
        });
    });
};

exports.changepassword_get = function(req, res){
    var uid = req.cookies.uid;
    console.log(uid);
    if (!uid) {
        res.send('You are not logged in!');
    } else {
        api.getUserById(uid, function (err, user) {
            res.render('./user/password', {title:'Change Password', user: user});
        });
    }

};

exports.changepassword_post = function(req, res){

    var uid = req.cookies.uid;
    var formData = req.body;
    var CurrentPass = formData.currentpass;
    var NewPass = formData.newpass;
    var ConfirmPass = formData.confirmpass;

    api.getUserById(uid, function(err, user){
        if (err) throw err;
        var password = user.pass;
        if(CurrentPass && NewPass && ConfirmPass)
        {
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
        } else {
            res.send('All fields should be filled in!');
        }
    })
};

exports.signout = function(req, res){
    api.soutUser(req, res);
};

exports.currUser = function(){
    var module = UserModule;
    api.getUserById()
};