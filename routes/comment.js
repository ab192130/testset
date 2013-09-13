exports.new = function(comment, callback){
    var newComment = new CommentModel(comment);
    newComment.save(function(err){
        console.log(newComment);
        callback(err, newComment);
    });
};

exports.data = function(req, res){
    api.getComments(null, function(err, comments){
        res.json(comments);
    });
};
