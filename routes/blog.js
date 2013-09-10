
    /*
     * Blogs
     */


    exports.index = function(req, res){
        res.render('./blog/index', {title: 'Blogs', user: true});
    };

    exports.new_get = function(req, res){
        var uid = req.cookies.uid;
        if (!uid){
            res.send('Please sign in to post a new blog');
        } else {
            res.render('./blog/new', {title: 'New Post', user: true});
        }
    };

    exports.new_post = function(req, res){
        var uid = req.cookies.uid;
        if (!uid){
            res.send('Please sign in to post a new blog');
        } else {
            api.newBlog(req, res, function(err, id){
                if(!err && id) res.redirect('/blog/list');
            });
        }
    };

    exports.list = function(req, res){
        BlogModel.find({}, function(err,data){
            res.json(data);
        });
    };
