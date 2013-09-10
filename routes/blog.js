
    /*
     * Blogs
     */


    exports.index = function(req, res){
        res.render('./blog/index');
    };

    exports.new_get = function(req, res){
        res.render('./blog/new');
    };

    exports.new_post = function(req, res){
        api.newBlog(req, res);
        res.redirect('/blog/list');
    };

    exports.list = function(req, res){
        BlogModel.find({}, function(err,data){
            res.json(data);
        });
    };
