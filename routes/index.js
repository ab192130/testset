/*
 * GET home page.
 */

exports.index = function(req, res){
    if (api.checkAuth(req.cookies)) {
        api.getUserById(req.cookies.uid, function(err, user){
            res.render('index', {title: 'Project 01', user: user});
        });
    } else {
        res.render('index', {title: 'PROJ01'});
    }
};

exports.data = function(req, res){
    UserModel.find({}, function(err,data){
        res.json(data);
    });
};