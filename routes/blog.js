
    /*
     * Blogs
     */

    //@TODO: send html tags with textarea when post a new blog

    exports.index = function(req, res){
        api.getBlogs(function(err, blogs){
            res.render('./blog/index', {title: 'Blogs', blogs: blogs});
         });
//        res.render('./blog/index', {title: 'Blogs', user: true});
    };

    exports.view = function(req, res){
        var bid = req.params.id;
        api.getBlog(bid, function(err, blog){
            var uid = req.cookies.uid;
            res.render('./blog/view', {title: blog.title, blog: blog});
        });
    };

    exports.data = function(req, res){
        BlogModel.find({}, function(err,data){
            res.json(data);
        });
    };

    exports.new_get = function(req, res){
        var uid = req.cookies.uid;
        if (!uid){
            res.send('Please sign in to post a new blog');
        } else {
            res.render('./blog/new', {title: 'New Post'});
        }
    };

    exports.new_post = function(req, res){
        var uid = req.cookies.uid;
        var title = req.body.blog_title;
        var content = req.body.blog_content;
        content = content.replace(/\r\n/, "\n");
//        content = content.replace(/(\r\n|\n|\r)/gm, "<br>");
        if (!uid){
            res.send('Please sign in to post a new blog');
        } else {
            console.log(content);
            api.newBlog({title: title, content: content, author: uid}, function(err, id){
                if(!err && id) res.redirect('/blog/' + id);
            });
        }
    };





