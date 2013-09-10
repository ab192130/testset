
    /*
     * Blogs
     */


    exports.index = function(req, res){
        res.render('./blog/index', {title: 'Blogs'});
    };

    exports.new_get = function(req, res){
        res.render('./blog/new', {title: 'New Post'});
    };

    exports.new_post = function(req, res){
        api.newBlog(req, res, function(err, id){
            if(!err && id) res.redirect('/blog/list');
        });
    };

    exports.list = function(req, res){
        BlogModel.find({}, function(err,data){
            res.json(data);
        });
    };
