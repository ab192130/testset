/*
 * GET home page.
 */

exports.index = function(req, res){
    var loggedIn = false;
    if (api.checkAuth(req.cookies)) loggedIn = true;
    res.render('index', {title: 'PROJ01', auth: loggedIn});
};

exports.data = function(req, res){
    UserModel.find({}, function(err,data){
        res.json(data);
    });
};