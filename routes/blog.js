
    /*
     * Blogs
     */

    exports.index = function(req, res){
        api.getBlogs(function(err, blogs){
            res.render('./blog/index', {title: 'Blogs', blogs: blogs});
         });
//        res.render('./blog/index', {title: 'Blogs', user: true});
    };

    exports.view = function(req, res){
        var bid = req.params.id;
        var c = {parent: {object: 'blog', id: bid}};
        api.getBlog(bid, function(err, blog){
            var uid = req.cookies.uid;
            api.getUserById(blog.author, function(err, author){
                res.header('X-XSS-Protection', 0);

                api.getComments(c, function(err, comments){
                    if(err) throw err;
                    res.render('./blog/view', {title: blog.title, blog: blog, author: author, comments: comments});
                });

            });
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
        var date = Date.now();
//        content = content.replace(/\r\n/, "\n");
//        content = content.replace(/(\r\n|\n|\r)/gm, "<br>");
        if (!uid){
            res.send('Please sign in to post a new blog');
        } else {
            console.log(content);
            api.newBlog({title: title, content: content, author: uid, date: date}, function(err, id){
                if(!err && id) {
                    res.redirect('/blog/' + id);
//                    res.header('X-XSS-PROTECTION', 0);
                }
            });
        }
    };

    exports.edit_get = function(req, res){
        var bid = req.params.id;
        api.getBlog(bid, function(err, blog){
            res.render('./blog/edit', {blog: blog});
        });
    };

    exports.edit_post = function(req, res){
        var bid = req.params.id;
        api.getBlog(bid, function(err, blog){
            blog.title = req.body.blog_title;
            blog.content = req.body.blog_content;
            blog.save(function(err){
                res.redirect('/blog/' + blog._id);
            });
        });
    };

    exports.delete = function(req, res){
        var bid = req.params.id;
        api.getBlog(bid, function(err, blog){
            blog.remove(function(err){
                res.redirect('/blog');
            });
        });
    };

    exports.addcomment = function(req, res){
        var bid = req.params.id;
        var uid = req.cookies.uid;
        var newcomment = {
            content: req.body.comment_content,
            author: uid,
            date: Date.now(),
            parent: {
                object: 'blog',
                id: bid
            }
        };

        comment.new(newcomment, function(err, comment){
            res.redirect('/blog/' + bid);
        });
    };





